import { CONSUMER_GROUPS, OCCASIONS, PRODUCTS } from "@/lib/mock-data";
import { FAQ_ITEMS, SUPPORT_CONTACT } from "@/lib/support-data";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/types";
import { DELIVERY_FEE } from "@/lib/pricing";
import { LIMITS, type AssistantReply, type ChatTurn } from "./types";

/**
 * Simple keyword matcher used whenever the AI model is not configured or a
 * model call fails. It only ever recommends real catalogue items and only
 * repeats copy that already exists on the support page, so it can't make
 * anything up — it just understands less than the model.
 */

const GROUP_WORDS: Record<string, string[]> = {
  students: ["student", "students", "campus", "university", "uni", "undergrad", "hostel", "dorm", "exam", "exams", "nysc", "corper"],
  "corporate-workers": ["boss", "colleague", "colleagues", "coworker", "co-worker", "office", "corporate", "client", "clients", "staff", "employee", "employees", "executive", "manager", "team", "professional"],
  "health-workers": ["nurse", "nurses", "doctor", "doctors", "hospital", "medic", "midwife", "pharmacist", "caregiver", "health", "healthcare", "clinic"],
  "religious-groups": ["church", "pastor", "mosque", "imam", "faith", "thanksgiving", "harvest", "fellowship", "ministry", "priest", "reverend", "choir", "worship"],
  "couples-families": ["wife", "husband", "girlfriend", "boyfriend", "partner", "spouse", "couple", "couples", "family", "families", "fiance", "fiancee", "fiancé", "fiancée", "mum", "mom", "mother", "dad", "father", "parents", "parent"],
  "children-kids": ["kid", "kids", "child", "children", "son", "daughter", "baby", "toddler", "nephew", "niece", "boy", "girl", "pupil"],
};

const OCCASION_WORDS: Record<string, string[]> = {
  "valentines-day": ["valentine", "valentines", "valentine's", "romantic", "romance"],
  "wedding-anniversary": ["anniversary", "anniversaries", "wedding"],
  birthdays: ["birthday", "birthdays", "bday", "b-day"],
  "christmas-easter": ["christmas", "xmas", "easter", "festive"],
  graduation: ["graduation", "graduate", "graduating", "convocation", "graduated"],
  "mothers-fathers-day": ["mother's", "father's", "mothers", "fathers", "mum", "mom", "mother", "dad", "father"],
};

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "have", "need", "want", "looking", "gift", "gifts", "something",
  "give", "buy", "get", "who", "what", "which", "like", "some", "any", "can", "you", "please", "help", "idea",
  "ideas", "under", "below", "over", "above", "about", "from", "your", "our", "are", "not", "but", "has", "was",
  "naira", "budget", "around", "within", "less", "than", "more", "most", "best", "good", "nice", "suggest",
]);

const SUGGESTION_HINT =
  "Tell me who the gift is for (a student, a nurse, your wife, a colleague…) and the occasion, and a budget if you have one.";

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .split(/[^a-z0-9'é-]+/)
    .filter(Boolean);
}

function detect(words: Record<string, string[]>, toks: Set<string>): string[] {
  return Object.entries(words)
    .filter(([, list]) => list.some((w) => toks.has(w)))
    .map(([slug]) => slug);
}

export interface Budget {
  min?: number;
  max?: number;
}

/**
 * Pulls a naira budget out of free text: "under 20k", "₦15,000", "between 10k and 30k",
 * "at least 40000". Returns {} when it can't find one. Bare 4-digit years are ignored.
 */
export function parseBudget(text: string): Budget {
  const lower = text.toLowerCase().replace(/(\d),(\d{3})/g, "$1$2");
  const NUM = String.raw`(?:₦|\bn(?=\d)|ngn\s*)?\s*(\d+(?:\.\d+)?)\s*(k|thousand)?\b`;
  const value = (raw: string | undefined, suffix: string | undefined, allowYear = true): number | null => {
    if (!raw) return null;
    let n = parseFloat(raw);
    if (Number.isNaN(n)) return null;
    if (suffix) n *= 1000;
    if (n < 1000) return null;
    if (!allowYear && !suffix && /^\d{4}$/.test(raw) && n >= 1900 && n <= 2100) return null;
    return Math.round(n);
  };

  const between = lower.match(new RegExp(String.raw`between\s+${NUM}\s*(?:and|to|-)\s*${NUM}`));
  if (between) {
    // "between 10 and 20k": the suffix on the second number applies to both
    const a = value(between[1], between[2] ?? between[4]);
    const b = value(between[3], between[4]);
    if (a && b) return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  const range = lower.match(new RegExp(String.raw`${NUM}\s*(?:-|to)\s*${NUM}`));
  if (range) {
    const a = value(range[1], range[2] ?? range[4], false);
    const b = value(range[3], range[4], false);
    if (a && b) return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  const max = lower.match(new RegExp(String.raw`(?:under|below|less than|max(?:imum)?|up to|within|not more than|budget(?: is| of)?|around|about)\s*${NUM}`));
  if (max) {
    const n = value(max[1], max[2]);
    if (n) return { max: n };
  }
  const min = lower.match(new RegExp(String.raw`(?:over|above|more than|at least|minimum)\s*${NUM}`));
  if (min) {
    const n = value(min[1], min[2]);
    if (n) return { min: n };
  }
  // A lone amount: "₦20,000", "20k", or a plain 4–7 digit number that isn't a year.
  const lone = lower.match(new RegExp(NUM, "g"));
  if (lone) {
    for (const piece of lone) {
      const m = piece.match(new RegExp(NUM));
      const hasCurrencyOrSuffix = /[₦k]|thousand|^n\d|ngn/.test(piece.trim());
      const n = value(m?.[1], m?.[2], hasCurrencyOrSuffix);
      if (n) return { max: n };
    }
  }
  return {};
}

const FAQ_RULES: Array<{ faq: number; words: string[] }> = [
  { faq: 0, words: ["deliver", "delivery", "shipping", "ship", "arrive", "arrives", "dispatch", "lagos", "abuja", "same-day", "states"] },
  { faq: 1, words: ["pay", "payment", "payments", "transfer", "cod", "cash", "pos", "visa", "mastercard", "debit"] },
  { faq: 2, words: ["cancel", "change", "edit", "modify", "amend"] },
  { faq: 3, words: ["bulk", "wholesale", "branded", "volume"] },
  { faq: 4, words: ["damaged", "broken", "missing", "incomplete", "refund", "replace", "replacement", "wrong", "faulty", "spoilt", "spoiled"] },
  { faq: 5, words: ["message", "note", "personalised", "personalized", "handwritten", "hand-written"] },
];

const HUMAN_WORDS = ["human", "agent", "whatsapp", "call", "phone", "speak", "talk", "contact", "email", "support", "complaint"];

const contactReply = () =>
  `You can reach the team on WhatsApp (${SUPPORT_CONTACT.whatsappDisplay}) or at ${SUPPORT_CONTACT.email}, ${SUPPORT_CONTACT.hours}. They can help with anything about an order.`;

function pickProducts(
  groups: string[],
  occasions: string[],
  budget: Budget,
  keywords: string[]
): { picks: Product[]; relaxedBudget: boolean } {
  const scored = PRODUCTS.filter((p) => p.inStock)
    .map((p) => {
      const g = groups.filter((x) => p.groups.includes(x as never)).length;
      const o = occasions.filter((x) => p.occasions.includes(x as never)).length;
      let score = g * 3 + o * 3 + (g && o ? 2 : 0);
      const haystack = `${p.name} ${p.description}`.toLowerCase();
      for (const k of keywords) if (haystack.includes(k)) score += 1;
      if (p.featured) score += 0.5;
      return { p, score, g, o };
    })
    // If the visitor named a group and/or occasion, require at least one real match.
    .filter((x) => (groups.length || occasions.length ? x.g > 0 || x.o > 0 : true))
    .sort((a, b) => b.score - a.score || a.p.price - b.p.price);

  const hasBudget = budget.min !== undefined || budget.max !== undefined;
  const within = scored.filter(
    (x) => (budget.max === undefined || x.p.price <= budget.max) && (budget.min === undefined || x.p.price >= budget.min)
  );
  if (within.length || !hasBudget) {
    return { picks: within.slice(0, LIMITS.maxProducts).map((x) => x.p), relaxedBudget: false };
  }
  // Nothing in budget: offer the closest options rather than an empty answer.
  const target = budget.max ?? budget.min ?? 0;
  const closest = [...scored].sort((a, b) => Math.abs(a.p.price - target) - Math.abs(b.p.price - target));
  return { picks: closest.slice(0, LIMITS.maxProducts).map((x) => x.p), relaxedBudget: true };
}

function describeBudget(b: Budget): string {
  if (b.min !== undefined && b.max !== undefined) return `between ${formatNaira(b.min)} and ${formatNaira(b.max)}`;
  if (b.max !== undefined) return `up to ${formatNaira(b.max)}`;
  if (b.min !== undefined) return `from ${formatNaira(b.min)}`;
  return "";
}

export function basicReply(history: ChatTurn[]): AssistantReply {
  const reply = (text: string, products: string[] = []): AssistantReply => ({ reply: text, products, mode: "basic" });

  const userTurns = history.filter((t) => t.role === "user");
  const latest = userTurns[userTurns.length - 1]?.content ?? "";
  const text = latest.toLowerCase().trim();
  const latestToks = new Set(tokens(latest));

  // Slots: what the visitor said most recently wins; earlier turns fill any gaps.
  const latestFirst = [...userTurns].reverse();
  const groups = latestFirst.map((t) => detect(GROUP_WORDS, new Set(tokens(t.content)))).find((x) => x.length) ?? [];
  const occasions = latestFirst.map((t) => detect(OCCASION_WORDS, new Set(tokens(t.content)))).find((x) => x.length) ?? [];
  const budget = latestFirst.map((t) => parseBudget(t.content)).find((b) => b.min !== undefined || b.max !== undefined) ?? {};

  // "mum"/"dad" mean Mother's/Father's Day — don't also treat them as the couples & families group.
  const effectiveGroups =
    occasions.includes("mothers-fathers-day") && groups.length === 1 && groups[0] === "couples-families" ? [] : groups;

  const latestNamesGroupOrOccasion =
    detect(GROUP_WORDS, latestToks).length > 0 || detect(OCCASION_WORDS, latestToks).length > 0;
  const hasGiftSlots = effectiveGroups.length > 0 || occasions.length > 0 || budget.min !== undefined || budget.max !== undefined;

  // 1. Greetings and thanks
  if (/^(hi|hello|hey|good (morning|afternoon|evening)|howdy)\b/.test(text) && !hasGiftSlots) {
    return reply(`Hello! I can help you pick a gift or answer questions about delivery and payment. ${SUGGESTION_HINT}`);
  }
  if (/^(thanks|thank you|thx|cheers)\b/.test(text)) {
    return reply("You're welcome! Message me again any time you need help with a gift.");
  }

  // 2. Specific orders, or a request for a person: we can't see orders from here, so hand off.
  const asksAboutOrder = /\b(where is|track|status of|order number|order id)\b/.test(text);
  const wantsHuman = HUMAN_WORDS.some((w) => latestToks.has(w));
  if (asksAboutOrder) {
    return reply(`I can't see individual orders from here. ${contactReply()}`);
  }
  if (wantsHuman && !latestNamesGroupOrOccasion) {
    return reply(contactReply());
  }

  // 3. Delivery fee, asked directly
  if (/\b(deliver\w*|shipping)\b.*\b(fee|cost|price|charge|how much)\b|\bhow much\b.*\b(deliver\w*|shipping)\b/.test(text)) {
    return reply(`Delivery is a flat ${formatNaira(DELIVERY_FEE)} per order, added in your cart. ${FAQ_ITEMS[0].answer}`);
  }

  // 4. FAQ topics, unless the visitor is clearly describing who/what the gift is for
  const faqHit = FAQ_RULES.find((r) => r.words.some((w) => latestToks.has(w)));
  if (faqHit && !latestNamesGroupOrOccasion) {
    return reply(FAQ_ITEMS[faqHit.faq].answer);
  }

  // 5. Gift recommendations
  if (hasGiftSlots) {
    const keywords = [...latestToks].filter((t) => t.length >= 4 && !STOPWORDS.has(t));
    const { picks, relaxedBudget } = pickProducts(effectiveGroups, occasions, budget, keywords);

    const who = effectiveGroups.map((g) => CONSUMER_GROUPS.find((x) => x.slug === g)?.name).filter(Boolean);
    const when = occasions.map((o) => OCCASIONS.find((x) => x.slug === o)?.name).filter(Boolean);
    const forWhat = [who.length ? `for ${who.join(" / ")}` : "", when.length ? `(${when.join(" / ")})` : ""]
      .filter(Boolean)
      .join(" ");
    const budgetText = describeBudget(budget);

    if (!picks.length) {
      return reply(
        `I couldn't find a match${forWhat ? ` ${forWhat}` : ""}. Try a different group or occasion, or browse the whole shop. ${SUGGESTION_HINT}`
      );
    }
    // The product cards render right under this text, so the sentence ends with a full stop, not a colon.
    const lead = relaxedBudget
      ? `Nothing is priced ${budgetText}, but these are the closest${forWhat ? ` ${forWhat}` : ""}.`
      : `Here ${picks.length === 1 ? "is a good option" : `are ${picks.length} good options`}${forWhat ? ` ${forWhat}` : ""}${budgetText ? `, ${budgetText}` : ""}.`;
    // "mum"/"dad" already say who the gift is for, so only ask when neither group nor occasion pins it down.
    const nudge = !groups.length && !occasions.includes("mothers-fathers-day")
      ? " Who is it for? I can narrow it down."
      : !occasions.length
        ? " What's the occasion? I can narrow it down."
        : "";
    return reply(`${lead}${nudge}`, picks.map((p) => p.slug));
  }

  // 6. A FAQ word alongside a gift mention, a plain contact request, or nothing recognised
  if (faqHit) return reply(FAQ_ITEMS[faqHit.faq].answer);
  if (wantsHuman) return reply(contactReply());
  return reply(`I'm not sure I got that. ${SUGGESTION_HINT} You can also ask about delivery, payment or damaged items.`);
}
