import Link from "next/link";
import Image from "next/image";
import {
  CONSUMER_GROUPS,
  OCCASIONS,
  PRODUCTS,
  nearestUpcomingOccasion,
} from "@/lib/mock-data";
import { GroupIconFor } from "@/components/icons";
import { ProductGrid } from "@/components/product-card";
import { EditorialSection, Eyebrow } from "@/components/editorial";
import { DrawArrow } from "@/components/draw-arrow";
import { Magnetic } from "@/components/magnetic";
import { StickyShopCTA } from "@/components/sticky-shop-cta";

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const upcoming = nearestUpcomingOccasion();
  const upcomingProducts = PRODUCTS.filter((p) =>
    p.occasions.includes(upcoming.slug)
  ).slice(0, 4);

  return (
    <>
      {/* =================== HERO =================== */}
      <section className="container-page pt-2 sm:pt-6">
        <div className="relative overflow-hidden rounded-3xl border border-line shadow-card bg-bg-soft">
          {/* very soft warm wash — replaces the noisy radial gradient stack */}
          <div className="absolute inset-0 bg-gradient-to-br from-bg-soft via-bg to-brand-50 opacity-90" aria-hidden />

          <div className="relative grid lg:grid-cols-2 gap-6 lg:gap-12 p-4 sm:p-8 lg:p-14 items-center">
            {/* VIDEO — DOM first so mobile shows it on top; ordered right on desktop */}
            <div className="relative aspect-[5/4] lg:aspect-[5/4] rounded-2xl overflow-hidden shadow-card border border-line bg-bg-soft lg:order-2">
              <video
                src="/hero.mp4"
                poster="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=70"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Beautifully wrapped gift hampers, gently animated"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* gold hairline frame */}
              <div className="absolute inset-2 rounded-xl border border-gold/30 pointer-events-none" />
            </div>

            {/* TEXT */}
            <div className="lg:order-1 animate-fade-up">
              <Eyebrow>Field Guide № 01 · Made in Nigeria</Eyebrow>
              <h1 className="mt-5 font-display text-[40px] leading-[1.02] sm:text-5xl lg:text-[68px] font-medium tracking-[-0.025em] text-ink">
                Thoughtful gifts,
                <span className="block font-editorial italic font-light text-brand-800 mt-1">
                  beautifully matched.
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-ink-muted max-w-md leading-relaxed">
                Hand-picked hampers and gifts for students, professionals,
                health workers and families — tailored to the moments that
                matter most.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/shop" className="group btn-gold">
                  Shop all gifts
                  <DrawArrow className="text-ink" size={32} />
                </Link>
                <Link href="/occasions" className="group btn-outline">
                  Browse by occasion
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest"></span>
                  Same-day Lagos delivery
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-dark"></span>
                  Hand-wrapped, every order
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== DATE-AWARE OCCASION CALLOUT =================== */}
      <section className="container-page mt-16 sm:mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-white/60 backdrop-blur-sm">
          <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
          <div className="relative grid lg:grid-cols-[1fr_26rem] gap-8 p-6 sm:p-10 items-end">
            <div className="max-w-xl">
              <Eyebrow>Coming up next</Eyebrow>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl font-medium text-ink tracking-[-0.02em] leading-[1.1]">
                <span className="font-editorial italic font-light text-brand-800">
                  {upcoming.name}
                </span>{" "}
                is around the corner.
              </h2>
              <p className="mt-3 text-base text-ink-muted leading-relaxed max-w-md">
                {upcoming.description}
              </p>
              <Link
                href={`/shop?occasion=${upcoming.slug}`}
                className="group inline-flex items-center gap-3 mt-6 text-sm font-medium text-brand-900 cursor-pointer"
              >
                Shop {upcoming.name.toLowerCase()}
                <DrawArrow className="text-brand-900" />
              </Link>
            </div>

            {upcomingProducts.length > 0 && (
              <div
                className={`grid gap-2 sm:gap-3 ${
                  upcomingProducts.length >= 4
                    ? "grid-cols-4"
                    : upcomingProducts.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2"
                }`}
              >
                {upcomingProducts.map((p, idx) => (
                  <Link
                    key={p.id}
                    href={`/shop/${p.slug}`}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-bg-muted cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    style={{ transform: `translateY(${(idx % 2) * 12}px)` }}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 1024px) 45vw, 200px"
                      className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================== CHAPTER I — BY GROUP =================== */}
      <EditorialSection
        className="mt-20 sm:mt-28"
        numeral="I."
        eyebrow="Chapter One — By Group"
        title={
          <>
            Shop by <span className="accent">group.</span>
          </>
        }
        subtitle="Different people, different favourites — find what fits."
        monogram="G"
        monogramPos="br"
        trailing={
          <Link href="/groups" className="group hidden sm:inline-flex items-center gap-3 text-sm font-medium text-brand-800 cursor-pointer">
            View all groups
            <DrawArrow className="text-brand-800" />
          </Link>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {CONSUMER_GROUPS.map((g, i) => (
            <Magnetic key={g.slug} strength={0.14}>
              <Link
                href={`/shop?group=${g.slug}`}
                className="editorial-card group block p-5 sm:p-6 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div className="relative h-full flex flex-col">
                  {/* eyebrow row */}
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/90 text-brand-900 shadow-soft border border-line">
                      <GroupIconFor icon={g.icon} className="w-5 h-5" />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted/70">
                      № {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl sm:text-2xl font-medium text-ink tracking-tight leading-tight">
                    {g.name}
                  </h3>
                  <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">
                    {g.tagline}
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-xs font-medium text-brand-900">
                    Shop now
                    <DrawArrow className="text-brand-900" />
                  </div>
                </div>
              </Link>
            </Magnetic>
          ))}
        </div>
      </EditorialSection>

      {/* =================== CHAPTER II — BY OCCASION =================== */}
      <EditorialSection
        className="mt-24 sm:mt-32"
        numeral="II."
        eyebrow="Chapter Two — By Occasion"
        title={
          <>
            Shop by <span className="accent">occasion.</span>
          </>
        }
        subtitle="From Valentine's to graduations — every moment, beautifully marked."
        trailing={
          <Link href="/occasions" className="group hidden sm:inline-flex items-center gap-3 text-sm font-medium text-brand-800 cursor-pointer">
            View all occasions
            <DrawArrow className="text-brand-800" />
          </Link>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {OCCASIONS.map((o, i) => (
            <Magnetic key={o.slug} strength={0.14}>
              <Link
                href={`/shop?occasion=${o.slug}`}
                className="editorial-card group block p-5 sm:p-6 h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div className="relative h-full flex flex-col">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/90 text-brand-900 shadow-soft border border-line">
                      <GroupIconFor icon={o.icon} className="w-5 h-5" />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted/70">
                      № {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl sm:text-2xl font-medium text-ink tracking-tight leading-tight">
                    {o.name}
                  </h3>
                  <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">
                    {o.tagline}
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-xs font-medium text-brand-900">
                    Shop now
                    <DrawArrow className="text-brand-900" />
                  </div>
                </div>
              </Link>
            </Magnetic>
          ))}
        </div>
      </EditorialSection>

      {/* =================== CHAPTER III — FEATURED =================== */}
      <EditorialSection
        className="mt-24 sm:mt-32"
        numeral="III."
        eyebrow="Chapter Three — Featured"
        title={
          <>
            <span className="accent">Hand-picked</span> favourites.
          </>
        }
        subtitle="A small, deliberate selection of the gifts our customers come back for."
        trailing={
          <Link href="/shop" className="group hidden sm:inline-flex items-center gap-3 text-sm font-medium text-brand-800 cursor-pointer">
            See all
            <DrawArrow className="text-brand-800" />
          </Link>
        }
      >
        <ProductGrid products={featured} />
      </EditorialSection>

      {/* =================== CHAPTER IV — CORPORATE CTA =================== */}
      <section className="container-page mt-24 sm:mt-32 mb-4">
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 text-gold-soft shadow-card">
          {/* layered atmosphere — golden bloom + gold inset hairline frame + ornament */}
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
          <div className="absolute inset-3 rounded-2xl border border-gold/25 pointer-events-none" />
          <span aria-hidden="true" className="absolute top-4 right-6 chapter-numeral text-gold-soft/[0.08]">
            IV.
          </span>
          {/* corner flourish — small editorial ornament */}
          <svg
            aria-hidden="true"
            className="absolute bottom-6 left-6 w-14 h-14 text-gold/40"
            viewBox="0 0 56 56"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M28 4 L28 52 M4 28 L52 28" strokeLinecap="round" />
            <circle cx="28" cy="28" r="14" />
            <circle cx="28" cy="28" r="2" fill="currentColor" />
          </svg>

          <div className="relative p-8 sm:p-14 lg:p-20 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-12">
            <div className="max-w-2xl">
              <p className="eyebrow !text-gold/80">For the office</p>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] leading-[1.05] text-gold-soft">
                Bulk and corporate gifting,
                <span className="block font-editorial italic font-light text-gold mt-1">
                  delivered nationwide.
                </span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gold-soft/75 leading-relaxed max-w-lg">
                Branded hampers for offices, hospitals, churches and schools —
                across Lagos and beyond. Volume pricing, custom wrapping,
                scheduled delivery windows.
              </p>
            </div>
            <Link
              href="/shop?group=corporate-workers"
              className="group inline-flex items-center gap-3 rounded-xl bg-gold px-6 py-4 text-sm font-semibold text-ink hover:bg-gold-dark hover:text-white transition-colors duration-300 ease-editorial cursor-pointer shadow-glow"
            >
              Explore corporate gifts
              <DrawArrow className="text-ink group-hover:text-white" size={32} />
            </Link>
          </div>
        </div>
      </section>

      {/* mobile-only sticky CTA after scroll */}
      <StickyShopCTA />
    </>
  );
}
