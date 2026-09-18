"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupportMessage } from "./types";

const MESSAGES_KEY = "gifthub.support.v1";

function genId() {
  return `sm-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function readStored(): SupportMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Support inbox store. The public /support form calls `create`; the
 * /admin/support inbox reads `messages` and calls `setStatus`. Persists
 * to localStorage, mirroring the pattern used by cart-context and
 * admin-store — see README for the prototype's data-layer notes.
 */
export function useSupportMessages() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMessages(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages, hydrated]);

  const create = useCallback(
    (input: Omit<SupportMessage, "id" | "createdAt" | "status">) => {
      const message: SupportMessage = {
        ...input,
        id: genId(),
        createdAt: new Date().toISOString(),
        status: "new",
      };
      setMessages((prev) => [message, ...prev]);
      return message;
    },
    []
  );

  const setStatus = useCallback((id: string, status: SupportMessage["status"]) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }, []);

  return { messages, hydrated, create, setStatus };
}
