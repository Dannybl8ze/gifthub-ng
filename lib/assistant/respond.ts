import { basicReply } from "./basic";
import { askBedrock, bedrockConfigured, BedrockError } from "./bedrock";
import { buildSystemPrompt, recommendableSlugs } from "./knowledge";
import { LIMITS, type AssistantMode, type AssistantReply, type ChatTurn } from "./types";

export function assistantMode(): AssistantMode {
  return bedrockConfigured() ? "ai" : "basic";
}

/**
 * Cleans up a conversation sent by the browser so it is valid for the model:
 * trims and caps every message, drops empty ones, merges consecutive turns from the
 * same side, keeps the most recent turns, and makes sure it starts and ends with the visitor.
 */
export function normaliseHistory(input: ChatTurn[]): ChatTurn[] {
  const merged: ChatTurn[] = [];
  for (const t of input) {
    const content = t.content.trim().slice(0, LIMITS.messageChars);
    if (!content) continue;
    const prev = merged[merged.length - 1];
    if (prev && prev.role === t.role) prev.content = `${prev.content}\n${content}`.slice(0, LIMITS.messageChars * 2);
    else merged.push({ role: t.role, content });
  }
  let recent = merged.slice(-LIMITS.historyTurns);
  while (recent.length && recent[0].role !== "user") recent = recent.slice(1);
  return recent;
}

/**
 * The model ends a recommendation with a line like "PRODUCTS: slug-a, slug-b". Take that line out of
 * the visible text and keep only slugs that really exist and are in stock, so the model can never
 * surface a product (or a price) that isn't in the catalogue.
 */
export function parseModelAnswer(raw: string): { text: string; products: string[] } {
  const allowed = recommendableSlugs();
  const products: string[] = [];
  const kept: string[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*\**\s*products\s*:\s*\**\s*(.*)$/i);
    if (!m) {
      kept.push(line);
      continue;
    }
    for (const part of m[1].split(/[,;]/)) {
      const slug = part.trim().replace(/^[`"'*\s]+|[`"'*.\s]+$/g, "").toLowerCase();
      if (allowed.has(slug) && !products.includes(slug)) products.push(slug);
    }
  }

  const text = kept
    .join("\n")
    .replace(/\*\*|__/g, "") // the page shows plain text, so drop markdown emphasis
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { text, products: products.slice(0, LIMITS.maxProducts) };
}

/** Answers with the model when it's configured; otherwise (or if the call fails) with the simple matcher. */
export async function respond(history: ChatTurn[]): Promise<AssistantReply> {
  if (bedrockConfigured()) {
    try {
      const raw = await askBedrock(buildSystemPrompt(), history);
      const { text, products } = parseModelAnswer(raw);
      if (text) return { reply: text, products, mode: "ai" };
    } catch (err) {
      const e = err as BedrockError;
      // Log the failure reason only — never the visitor's messages or any credential.
      console.error(`[assistant] model call failed (${e.status ?? "no status"}): ${e.message}`);
    }
  }
  return basicReply(history);
}
