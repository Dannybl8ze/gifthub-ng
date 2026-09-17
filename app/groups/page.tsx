import Link from "next/link";
import { CONSUMER_GROUPS, PRODUCTS } from "@/lib/mock-data";
import { GroupIconFor } from "@/components/icons";
import { DrawArrow } from "@/components/draw-arrow";
import { Magnetic } from "@/components/magnetic";
import { Eyebrow } from "@/components/editorial";

export const metadata = { title: "Shop by group — GiftHub NG" };

export default function GroupsPage() {
  return (
    <div className="container-page relative">
      <span aria-hidden="true" className="chapter-numeral absolute top-0 right-2 sm:right-6">I.</span>
      <span aria-hidden="true" className="monogram monogram-bl">G</span>

      <header className="relative max-w-2xl pt-8">
        <Eyebrow>Catalogue — By Group</Eyebrow>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-medium text-ink tracking-[-0.02em] leading-[1.05]">
          Shop by <span className="font-editorial italic font-light text-brand-800">consumer group.</span>
        </h1>
        <p className="mt-3 text-base text-ink-muted leading-relaxed">
          Every group has different favourites — pick yours and we'll show you
          gifts that fit.
        </p>
        <span className="hairline mt-6"></span>
      </header>

      <div className="relative mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {CONSUMER_GROUPS.map((g, i) => {
          const count = PRODUCTS.filter((p) => p.groups.includes(g.slug)).length;
          return (
            <Magnetic key={g.slug} strength={0.14}>
              <Link
                href={`/shop?group=${g.slug}`}
                className="editorial-card group block p-6 sm:p-7 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div className="relative h-full flex flex-col">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/90 text-brand-900 shadow-soft border border-line">
                      <GroupIconFor icon={g.icon} className="w-5 h-5" />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted/70">
                      № {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-medium text-ink tracking-tight leading-tight">
                    {g.name}
                  </h2>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed flex-1">
                    {g.description}
                  </p>
                  <div className="mt-6 pt-5 border-t border-line/70 flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-ink-muted/80">
                      {count} gift{count !== 1 ? "s" : ""}
                    </span>
                    <span className="inline-flex items-center gap-3 text-sm font-medium text-brand-900">
                      Browse
                      <DrawArrow className="text-brand-900" />
                    </span>
                  </div>
                </div>
              </Link>
            </Magnetic>
          );
        })}
      </div>
    </div>
  );
}
