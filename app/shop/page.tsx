import Link from "next/link";
import {
  CONSUMER_GROUPS,
  OCCASIONS,
  filterProducts,
  getConsumerGroup,
  getOccasion,
} from "@/lib/mock-data";
import { ProductGrid } from "@/components/product-card";
import { CloseIcon, FilterIcon, SearchIcon } from "@/components/icons";

interface PageProps {
  searchParams: Promise<{ group?: string; occasion?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const group = sp.group ?? null;
  const occasion = sp.occasion ?? null;
  const q = sp.q?.trim() || null;

  const products = filterProducts({ group, occasion, q });
  const groupObj = group ? getConsumerGroup(group) : null;
  const occasionObj = occasion ? getOccasion(occasion) : null;

  const heading = q
    ? `Search results for "${q}"`
    : groupObj && occasionObj
    ? `${occasionObj.name} gifts for ${groupObj.name.toLowerCase()}`
    : groupObj
    ? `Gifts for ${groupObj.name.toLowerCase()}`
    : occasionObj
    ? `${occasionObj.name} gifts`
    : "All gifts";

  function chipHref(remove: "group" | "occasion" | "q") {
    const params = new URLSearchParams();
    if (remove !== "group" && group) params.set("group", group);
    if (remove !== "occasion" && occasion) params.set("occasion", occasion);
    if (remove !== "q" && q) params.set("q", q);
    return `/shop${params.toString() ? `?${params.toString()}` : ""}`;
  }

  function pillHref(kind: "group" | "occasion", slug: string) {
    const params = new URLSearchParams();
    if (kind === "group") {
      params.set("group", slug);
      if (occasion) params.set("occasion", occasion);
    } else {
      params.set("occasion", slug);
      if (group) params.set("group", group);
    }
    if (q) params.set("q", q);
    return `/shop?${params.toString()}`;
  }

  function clearHref(kind: "group" | "occasion") {
    const params = new URLSearchParams();
    if (kind === "group" && occasion) params.set("occasion", occasion);
    if (kind === "occasion" && group) params.set("group", group);
    if (q) params.set("q", q);
    return `/shop${params.toString() ? `?${params.toString()}` : ""}`;
  }

  return (
    <div className="container-page">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
          {heading}
        </h1>
        <p className="mt-2 text-ink-muted">
          {products.length} gift{products.length !== 1 ? "s" : ""} available
        </p>
      </header>

      {/* Active filter chips */}
      {(groupObj || occasionObj || q) && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted mr-1">Active filters:</span>
          {q && (
            <Link href={chipHref("q")} className="chip-gold cursor-pointer hover:bg-gold/30 transition-colors">
              "{q}"
              <CloseIcon className="w-3 h-3" />
            </Link>
          )}
          {groupObj && (
            <Link href={chipHref("group")} className="chip cursor-pointer hover:bg-brand-100 transition-colors">
              {groupObj.name}
              <CloseIcon className="w-3 h-3" />
            </Link>
          )}
          {occasionObj && (
            <Link href={chipHref("occasion")} className="chip cursor-pointer hover:bg-brand-100 transition-colors">
              {occasionObj.name}
              <CloseIcon className="w-3 h-3" />
            </Link>
          )}
          <Link href="/shop" className="text-xs text-brand-800 hover:underline ml-1 cursor-pointer">
            Clear all
          </Link>
        </div>
      )}

      <div className="mt-8 grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
        {/* Sidebar filters */}
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <form action="/shop" method="get" className="card p-5">
            {group && <input type="hidden" name="group" value={group} />}
            {occasion && <input type="hidden" name="occasion" value={occasion} />}
            <label htmlFor="shop-q" className="sr-only">
              Search gifts
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
              <input
                id="shop-q"
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search this catalogue…"
                className="input pl-10"
              />
            </div>
          </form>

          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-display font-semibold text-ink mb-3">
              <FilterIcon className="w-4 h-4 text-brand-700" />
              Consumer group
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href={clearHref("group")}
                  className={`block px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    !group ? "bg-brand-800 text-gold-soft" : "text-ink-soft hover:bg-brand-50"
                  }`}
                >
                  All groups
                </Link>
              </li>
              {CONSUMER_GROUPS.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={pillHref("group", g.slug)}
                    className={`block px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                      group === g.slug
                        ? "bg-brand-800 text-gold-soft"
                        : "text-ink-soft hover:bg-brand-50"
                    }`}
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-display font-semibold text-ink mb-3">
              <FilterIcon className="w-4 h-4 text-brand-700" />
              Occasion
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href={clearHref("occasion")}
                  className={`block px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    !occasion ? "bg-brand-800 text-gold-soft" : "text-ink-soft hover:bg-brand-50"
                  }`}
                >
                  All occasions
                </Link>
              </li>
              {OCCASIONS.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={pillHref("occasion", o.slug)}
                    className={`block px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                      occasion === o.slug
                        ? "bg-brand-800 text-gold-soft"
                        : "text-ink-soft hover:bg-brand-50"
                    }`}
                  >
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="min-w-0">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
