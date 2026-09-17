"use client";

import Link from "next/link";
import { useAdminProducts } from "@/lib/admin-store";
import { useCart } from "@/lib/cart-context";
import { CONSUMER_GROUPS, OCCASIONS } from "@/lib/mock-data";
import { formatNaira } from "@/lib/format";
import { ArrowRightIcon } from "@/components/icons";

export default function AdminOverviewPage() {
  const { products } = useAdminProducts();
  const { orders } = useCart();

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Products", value: String(products.length), href: "/admin/products" },
    { label: "Consumer groups", value: String(CONSUMER_GROUPS.length), href: "/admin/categories" },
    { label: "Occasions", value: String(OCCASIONS.length), href: "/admin/categories" },
    { label: "Orders", value: String(orders.length), href: "/admin/orders" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">Welcome back</h1>
        <p className="text-ink-muted mt-1">
          Manage products, categories and orders for GiftHub NG.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card p-5 group cursor-pointer hover:shadow-glow transition-shadow"
          >
            <p className="text-xs uppercase tracking-wider text-ink-muted">{s.label}</p>
            <p className="font-display text-3xl font-semibold text-brand-900 mt-2">{s.value}</p>
            <p className="mt-3 text-xs text-brand-700 group-hover:underline">Manage →</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-8">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Revenue snapshot</h2>
          <p className="text-xs text-ink-muted mb-4">Based on local orders placed in this browser.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-muted">Total revenue</p>
              <p className="font-display text-2xl font-semibold text-brand-900 mt-1">{formatNaira(revenue)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-muted">Pending</p>
              <p className="font-display text-2xl font-semibold text-brand-900 mt-1">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Quick actions</h2>
          <div className="mt-4 space-y-2">
            <Link href="/admin/products/new" className="btn-gold w-full">
              Add new product
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link href="/admin/orders" className="btn-ghost w-full">
              View latest orders
            </Link>
          </div>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-1">Latest orders</h2>
        <p className="text-xs text-ink-muted mb-4">Most recent first.</p>
        {orders.length === 0 ? (
          <p className="text-sm text-ink-muted">No orders yet. Place a test order from the storefront to see them here.</p>
        ) : (
          <ul className="divide-y divide-line">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">#{o.id}</p>
                  <p className="text-xs text-ink-muted">{o.customer.name} · {o.items.length} item{o.items.length !== 1 ? "s" : ""}</p>
                </div>
                <p className="font-semibold text-brand-900">{formatNaira(o.total)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
