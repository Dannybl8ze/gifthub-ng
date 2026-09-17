"use client";

import { useAdminProducts } from "@/lib/admin-store";
import { CONSUMER_GROUPS, OCCASIONS } from "@/lib/mock-data";
import { GroupIconFor } from "@/components/icons";

export default function AdminCategoriesPage() {
  const { products } = useAdminProducts();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">Categories</h1>
        <p className="text-ink-muted mt-1">
          Browse your two category dimensions. Products tag against both — manage tags from the product editor.
        </p>
      </header>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-4">Consumer groups</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONSUMER_GROUPS.map((g) => {
            const count = products.filter((p) => p.groups.includes(g.slug)).length;
            return (
              <div key={g.slug} className="card p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-brand-50 text-brand-800">
                    <GroupIconFor icon={g.icon} className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-display font-semibold text-ink">{g.name}</p>
                    <p className="text-xs text-ink-muted">/{g.slug}</p>
                  </div>
                </div>
                <p className="text-sm text-ink-muted mt-3">{g.description}</p>
                <p className="mt-4 text-xs text-brand-700 font-medium">{count} product{count !== 1 ? "s" : ""}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink mb-4">Occasions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OCCASIONS.map((o) => {
            const count = products.filter((p) => p.occasions.includes(o.slug)).length;
            return (
              <div key={o.slug} className="card p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gold/20 text-brand-900">
                    <GroupIconFor icon={o.icon} className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-display font-semibold text-ink">{o.name}</p>
                    <p className="text-xs text-ink-muted">/{o.slug}</p>
                  </div>
                </div>
                <p className="text-sm text-ink-muted mt-3">{o.description}</p>
                <p className="mt-4 text-xs text-brand-700 font-medium">
                  {count} product{count !== 1 ? "s" : ""}
                  {o.peakMonth && <span className="ml-2 text-ink-muted">· peak month {o.peakMonth}</span>}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-10 text-xs text-ink-muted">
        Categories are defined in code (<code className="text-brand-900">lib/mock-data.ts</code>) so they stay consistent across the storefront.
        In production, these would live in Supabase.
      </p>
    </div>
  );
}
