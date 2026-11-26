import { NextResponse } from "next/server";
import { assistantMode, normaliseHistory, respond } from "@/lib/assistant/respond";
import { LIMITS, type ChatTurn } from "@/lib/assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Per-visitor brake: 20 messages per 10 minutes, per IP, per server instance. On serverless hosting
 * each instance keeps its own counter, so this slows scripted abuse rather than stopping it — the real
 * spending cap is an AWS Budget on the Bedrock account (see README).
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function tooMany(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return false;
}

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/** Browsers always send Origin on a cross-site POST; refuse any that isn't this site. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin GETs and non-browser clients don't send one
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

function parseBody(body: unknown): ChatTurn[] | null {
  if (!body || typeof body !== "object") return null;
  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) return null;
  const turns: ChatTurn[] = [];
  for (const m of messages) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    turns.push({ role, content });
  }
  return turns;
}

/** Tells the widget whether it is talking to the AI model or to the simple matcher. */
export async function GET() {
  return NextResponse.json({ mode: assistantMode() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const turns = parseBody(body);
  if (!turns) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const last = turns[turns.length - 1];
  if (last.role !== "user" || !last.content.trim()) {
    return NextResponse.json({ error: "Please type a message." }, { status: 400 });
  }
  if (last.content.length > LIMITS.messageChars) {
    return NextResponse.json(
      { error: `Messages are limited to ${LIMITS.messageChars} characters.` },
      { status: 400 }
    );
  }

  if (tooMany(clientIp(req))) {
    return NextResponse.json(
      { error: "You're sending messages quickly. Please wait a few minutes, or chat with us on WhatsApp." },
      { status: 429, headers: { "Retry-After": "300" } }
    );
  }

  const history = normaliseHistory(turns);
  const result = await respond(history);
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
