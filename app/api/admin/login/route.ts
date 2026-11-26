import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  createSessionToken,
  isSecretUsable,
} from "@/lib/admin-session";
import { safeEqual, verifyPassword } from "@/lib/admin-password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort brute-force brake. Serverless instances don't share memory, so this
// slows guessing rather than stopping a determined attacker — use a long password.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map<string, { count: number; since: number }>();

function clientKey(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isLockedOut(key: string, now: number): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (now - entry.since > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function recordFailure(key: string, now: number) {
  const entry = failures.get(key);
  if (!entry || now - entry.since > WINDOW_MS) {
    failures.set(key, { count: 1, since: now });
  } else {
    entry.count += 1;
  }
}

export async function POST(req: Request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!adminEmail || !passwordHash || !isSecretUsable(secret)) {
    return NextResponse.json(
      { error: "Admin sign-in isn't configured yet." },
      { status: 503 }
    );
  }

  const now = Date.now();
  const key = clientKey(req);
  if (isLockedOut(key, now)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  let email = "";
  let password = "";
  try {
    const body = await req.json();
    if (typeof body?.email === "string") email = body.email.trim().toLowerCase();
    if (typeof body?.password === "string") password = body.password;
  } catch {
    // fall through to the failure path below
  }

  // Run both checks every time so the response doesn't reveal which one was wrong.
  const emailOk = safeEqual(email, adminEmail.trim().toLowerCase());
  const passwordOk =
    password.length > 0 && password.length <= 256 && verifyPassword(password, passwordHash);

  if (!(emailOk && passwordOk)) {
    recordFailure(key, now);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  failures.delete(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
  return response;
}
