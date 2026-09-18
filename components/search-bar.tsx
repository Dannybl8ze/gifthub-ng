"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { searchProducts } from "@/lib/mock-data";
import { formatNaira } from "@/lib/format";
import { SearchIcon } from "./icons";

/**
 * Live product search with a small typeahead dropdown. Meant to be embedded
 * inside an already-visible panel (the desktop navbar's search dropdown, or
 * the mobile hamburger menu) — it has no open/close state of its own.
 */
export function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = searchProducts(query, 5);
  const trimmed = query.trim();

  function goToResults(e?: FormEvent) {
    e?.preventDefault();
    if (!trimmed) return;
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    onNavigate?.();
  }

  function goToProduct(slug: string) {
    router.push(`/shop/${slug}`);
    onNavigate?.();
  }

  return (
    <div>
      <form onSubmit={goToResults} className="relative">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gifts…"
          aria-label="Search gifts"
          className="input pl-10"
          autoFocus
        />
      </form>

      {trimmed && (
        <div className="mt-3 space-y-1">
          {results.length === 0 ? (
            <p className="text-sm text-ink-muted px-1 py-2">No gifts match "{trimmed}".</p>
          ) : (
            <>
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goToProduct(p.slug)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-brand-50 transition-colors duration-150 cursor-pointer text-left"
                >
                  <span className="relative h-10 w-10 rounded-lg overflow-hidden bg-bg-soft shrink-0">
                    <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-ink truncate">{p.name}</span>
                    <span className="block text-xs text-brand-900">{formatNaira(p.price)}</span>
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToResults()}
                className="w-full text-left px-2 py-2 text-xs font-medium text-brand-800 hover:underline cursor-pointer"
              >
                See all results for "{trimmed}" →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
