"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAdminProducts } from "@/lib/admin-store";
import { formatNaira } from "@/lib/format";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/icons";

export default function AdminProductsPage() {
  const { products, remove, reset } = useAdminProducts();
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.slug.includes(query.toLowerCase())
  );

  return (
    <div>
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">Products</h1>
          <p className="text-ink-muted mt-1">{products.length} total — manage your catalogue.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset products to default seed? Any changes will be lost.")) reset();
            }}
            className="btn-ghost text-xs"
          >
            Reset to seed
          </button>
          <Link href="/admin/products/new" className="btn-gold">
            <PlusIcon className="w-4 h-4" />
            New product
          </Link>
        </div>
      </header>

      <div className="card p-4 mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or slug…"
          className="input"
        />
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink-muted">No products match that search.</p>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4 hover:bg-brand-50/40 transition-colors">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-bg-soft shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{p.name}</p>
                  <p className="text-xs text-ink-muted">
                    {p.groups.length} group{p.groups.length !== 1 ? "s" : ""} · {p.occasions.length} occasion{p.occasions.length !== 1 ? "s" : ""}
                    {!p.inStock && <span className="ml-2 text-red-700 font-medium">Out of stock</span>}
                  </p>
                </div>
                <p className="hidden sm:block font-semibold text-brand-900">{formatNaira(p.price)}</p>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-ink-soft hover:bg-brand-100 cursor-pointer transition-colors"
                    aria-label={`Edit ${p.name}`}
                  >
                    <EditIcon className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"?`)) remove(p.id);
                    }}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-ink-muted hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors"
                    aria-label={`Delete ${p.name}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
