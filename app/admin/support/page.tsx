"use client";

import { useState } from "react";
import { useSupportMessages } from "@/lib/support-store";
import { formatDateLong } from "@/lib/format";
import type { SupportMessage } from "@/lib/types";

export default function AdminSupportPage() {
  const { messages, setStatus } = useSupportMessages();
  const [selected, setSelected] = useState<SupportMessage | null>(null);

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">Support inbox</h1>
        <p className="text-ink-muted mt-1">
          {messages.length === 0
            ? "No messages yet. Submissions from the /support contact form will appear here."
            : `${messages.length} message${messages.length !== 1 ? "s" : ""} · ${newCount} new`}
        </p>
      </header>

      {messages.length > 0 && (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-line">
            {messages.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-brand-50/40 transition-colors"
              >
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    m.status === "new" ? "bg-gold" : "bg-line"
                  }`}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">
                    {m.name} <span className="text-ink-muted font-normal">· {m.topic}</span>
                  </p>
                  <p className="text-xs text-ink-muted truncate">{m.message}</p>
                </div>
                <p className="hidden sm:block text-xs text-ink-muted shrink-0">
                  {formatDateLong(m.createdAt)}
                </p>
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  className="text-xs text-brand-800 hover:underline cursor-pointer shrink-0"
                >
                  View →
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-card max-w-lg w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-line flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-ink-muted">
                  {selected.topic}
                  {selected.orderId && ` · Order ${selected.orderId}`}
                </p>
                <h2 className="font-display text-xl font-semibold text-ink">{selected.name}</h2>
                <p className="text-xs text-ink-muted mt-1">
                  {selected.email} · {formatDateLong(selected.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-ink-muted hover:text-ink cursor-pointer text-xs"
              >
                Close ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </p>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              {selected.status === "new" ? (
                <button
                  type="button"
                  onClick={() => {
                    setStatus(selected.id, "resolved");
                    setSelected(null);
                  }}
                  className="btn-primary flex-1"
                >
                  Mark resolved
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setStatus(selected.id, "new");
                    setSelected(null);
                  }}
                  className="btn-ghost flex-1"
                >
                  Reopen
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
