"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlipReveal, FlipRevealItem } from "@/components/ui/flip-reveal";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CONSUMER_GROUPS, PRODUCTS } from "@/lib/mock-data";
import { formatNaira } from "@/lib/format";

/**
 * Demo: animated, filterable product grid using FlipReveal + ToggleGroup.
 *
 * Filter pill set is the GiftHub consumer groups so the demo previews how the
 * component could later replace the static /shop sidebar filtering — without
 * us actually rewriting /shop (which would lose its URL-driven SSR).
 */
export default function FlipRevealDemoPage() {
  const [key, setKey] = useState<string>("all");

  return (
    <div className="container-page">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
          Animated catalogue filter
        </h1>
        <p className="mt-2 text-ink-muted">
          A live preview of the <code className="text-brand-900">FlipReveal</code> component, wired
          to the GiftHub catalogue. Pick a consumer group — products animate in and out using
          GSAP's Flip plugin.
        </p>
      </header>

      <div className="mt-8 flex justify-center">
        <ToggleGroup
          type="single"
          className="bg-background rounded-xl border border-line p-1 shadow-soft"
          value={key}
          onValueChange={(v) => v && setKey(v)}
        >
          <ToggleGroupItem value="all" className="sm:px-4">All</ToggleGroupItem>
          {CONSUMER_GROUPS.map((g) => (
            <ToggleGroupItem key={g.slug} value={g.slug} className="sm:px-4">
              {g.name.split(" ")[0]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <FlipReveal
        className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        keys={[key]}
        showClass="flex"
        hideClass="hidden"
      >
        {PRODUCTS.flatMap((p) =>
          p.groups.map((groupSlug) => (
            <FlipRevealItem
              key={`${p.id}-${groupSlug}`}
              flipKey={groupSlug}
              className="card overflow-hidden flex-col cursor-pointer"
            >
              <Link href={`/shop/${p.slug}`} className="block w-full">
                <div className="relative aspect-square bg-bg-soft">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <p className="font-display font-semibold text-sm text-ink line-clamp-1">
                    {p.name}
                  </p>
                  <p className="text-xs text-brand-900 font-medium mt-1">
                    {formatNaira(p.price)}
                  </p>
                </div>
              </Link>
            </FlipRevealItem>
          ))
        )}
      </FlipReveal>

      <footer className="mt-12 text-xs text-ink-muted max-w-2xl">
        <p>
          <strong className="text-ink">Note:</strong> this demo renders each product once per
          group it belongs to (since FlipReveal animates by a single key). The production
          <Link href="/shop" className="text-brand-800 hover:underline mx-1">/shop</Link>
          route uses URL-driven filtering with multi-tag support and SSR — a different
          architecture. Pick one model when you're ready to commit; mixing them on the same
          page would mean either deduplicating items or splitting into multiple FlipReveal
          instances.
        </p>
      </footer>
    </div>
  );
}
