"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, CloseIcon, SparklesIcon, WhatsAppIcon } from "./icons";
import { getProductBySlug } from "@/lib/mock-data";
import { formatNaira } from "@/lib/format";
import { SUPPORT_CONTACT, whatsappLink } from "@/lib/support-data";
import { LIMITS, type AssistantMode } from "@/lib/assistant/types";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  products?: string[];
  /** Local-only notice (network error, rate limit). Never sent back to the server. */
  notice?: boolean;
}

const GREETING =
  "Hi! I can help you choose a gift or answer questions about delivery and payment. Tell me who you're shopping for and the occasion.";

const SUGGESTIONS = [
  "Gift for a nurse under ₦30,000",
  "Anniversary gift for my wife",
  "Graduation gift for a student",
  "How much is delivery?",
];

const MODE_LABEL: Record<AssistantMode | "unknown", string> = {
  ai: "AI assistant · can make mistakes",
  basic: "Gift finder · simple matching",
  unknown: "Gift assistant",
};

/**
 * Floating gift assistant. Sits above the WhatsApp button, hidden in the admin
 * console. Talks to /api/assistant, which answers with Amazon Bedrock when keys
 * are configured and with a simple catalogue matcher otherwise — the header says
 * which one is in use, so visitors are never told it's AI when it isn't.
 */
export function AssistantWidget() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <AssistantPanel />;
}

function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AssistantMode | null>(null);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const wasOpen = useRef(false);
  const modeRequested = useRef(false);

  // Learn which mode the server is in the first time the panel opens.
  useEffect(() => {
    if (!open || modeRequested.current) return;
    modeRequested.current = true;
    fetch("/api/assistant", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.mode === "ai" || d?.mode === "basic") setMode(d.mode);
      })
      .catch(() => {});
  }, [open]);

  // Focus the input on open, and hand focus back to the launcher on close.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      launcherRef.current?.focus();
    }
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(raw: string) {
    const content = raw.trim().slice(0, LIMITS.messageChars);
    if (!content || loading) return;

    const userMsg: Message = { id: nextId.current++, role: "user", content };
    const outgoing = [...messages, userMsg];
    setMessages(outgoing);
    setInput("");
    setLoading(true);

    // Only text the server wrote on purpose (rate limit, too long…) is shown as-is; anything else is generic.
    let failure = "I couldn't reach the assistant just now. Please try again, or message us on WhatsApp.";
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: outgoing.filter((m) => !m.notice).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || typeof data?.reply !== "string") {
        if (typeof data?.error === "string") failure = data.error;
        throw new Error("assistant request failed");
      }
      if (data.mode === "ai" || data.mode === "basic") setMode(data.mode);
      setMessages((m) => [
        ...m,
        {
          id: nextId.current++,
          role: "assistant",
          content: data.reply,
          products: Array.isArray(data.products) ? data.products : [],
        },
      ]);
    } catch {
      setMessages((m) => [...m, { id: nextId.current++, role: "assistant", content: failure, notice: true }]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function closeOnPhone() {
    if (window.matchMedia("(max-width: 639px)").matches) setOpen(false);
  }

  if (!open) {
    return (
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the gift assistant"
        aria-haspopup="dialog"
        className="fixed z-40 right-4 bottom-[10.5rem] md:right-6 md:bottom-24 inline-flex items-center gap-2 h-12 pl-4 pr-5 rounded-full bg-brand-800 text-gold-soft text-sm font-medium shadow-card hover:bg-brand-900 hover:scale-105 transition-all duration-200 ease-overshoot cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <SparklesIcon className="w-5 h-5" />
        Gift assistant
      </button>
    );
  }

  const hasUserMessages = messages.some((m) => m.role === "user");

  return (
    <section
      role="dialog"
      aria-label="Gift assistant"
      className="fixed z-[60] inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem] h-[min(36rem,calc(100dvh-2rem))] flex flex-col overflow-hidden rounded-2xl border border-line bg-bg shadow-card motion-safe:animate-fade-up"
    >
      <header className="flex items-start gap-3 bg-brand-800 text-gold-soft px-4 py-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10">
          <SparklesIcon className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base leading-tight text-white">Gift assistant</h2>
          <p className="text-xs text-gold-soft/80">{MODE_LABEL[mode ?? "unknown"]}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close the gift assistant"
          className="grid h-8 w-8 place-items-center rounded-full text-gold-soft hover:bg-white/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        <Bubble role="assistant">{GREETING}</Bubble>

        {!hasUserMessages && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                className="chip hover:bg-brand-100 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className="space-y-2">
            <Bubble role={m.role} notice={m.notice}>
              {m.content}
            </Bubble>
            {m.products?.map((slug) => {
              const p = getProductBySlug(slug);
              if (!p) return null;
              return (
                <Link
                  key={slug}
                  href={`/shop/${p.slug}`}
                  onClick={closeOnPhone}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white p-2 pr-3 hover:border-brand-500 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bg-soft">
                    <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{p.name}</span>
                    <span className="block text-xs text-brand-900">{formatNaira(p.price)}</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-brand-800" />
                </Link>
              );
            })}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-1.5 px-1 text-brand-800" role="status">
            <span className="sr-only">The assistant is typing</span>
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                aria-hidden
                className="h-2 w-2 rounded-full bg-brand-800/60 motion-safe:animate-pulse"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-line bg-white/70 px-3 pt-3">
        <div className="flex items-center gap-2">
          <label htmlFor="assistant-input" className="sr-only">
            Your message
          </label>
          <input
            id="assistant-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={LIMITS.messageChars}
            placeholder="Ask about gifts or delivery…"
            autoComplete="off"
            className="input min-w-0 flex-1 py-2.5"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="btn-primary h-10 w-10 shrink-0 !p-0"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2 text-[11px] leading-snug text-ink-muted">
          <span>Please don&apos;t share passwords or card details.</span>
          <a
            href={whatsappLink("Hi! I'd like to talk to someone at GiftHub NG.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-forest hover:underline"
            title={`Chat on WhatsApp: ${SUPPORT_CONTACT.whatsappDisplay}`}
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            Talk to a person
          </a>
        </p>
      </form>
    </section>
  );
}

function Bubble({
  role,
  notice,
  children,
}: {
  role: "user" | "assistant";
  notice?: boolean;
  children: React.ReactNode;
}) {
  const base = "w-fit max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed";
  if (role === "user") {
    return <div className={`${base} ml-auto rounded-br-md bg-brand-800 text-gold-soft`}>{children}</div>;
  }
  return (
    <div
      className={`${base} rounded-bl-md border ${
        notice ? "border-red-200 bg-red-50 text-red-900" : "border-line bg-white text-ink"
      }`}
    >
      {children}
    </div>
  );
}
