"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatNaira, formatDateLong } from "@/lib/format";
import type { Order } from "@/lib/types";

const STATUS_LABEL: Record<Order["status"], { text: string; chip: string }> = {
  pending: { text: "Pending", chip: "bg-amber-100 text-amber-900 border-amber-200" },
  confirmed: { text: "Confirmed", chip: "bg-sky-100 text-sky-900 border-sky-200" },
  fulfilled: { text: "Fulfilled", chip: "bg-forest-soft text-forest border-forest/30" },
  cancelled: { text: "Cancelled", chip: "bg-red-100 text-red-900 border-red-200" },
};

export default function AdminOrdersPage() {
  const { orders } = useCart();
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">Orders</h1>
        <p className="text-ink-muted mt-1">
          {orders.length === 0
            ? "No orders yet. Place a test order from the storefront to see them here."
            : `${orders.length} order${orders.length !== 1 ? "s" : ""} received.`}
        </p>
      </header>

      {orders.length > 0 && (
        <div className="card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 text-xs uppercase tracking-wider text-ink-muted border-b border-line bg-bg-soft/50">
            <span>Order</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
            <span></span>
          </div>
          <ul className="divide-y divide-line">
            {orders.map((o) => (
              <li key={o.id} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-brand-50/30 transition-colors">
                <div>
                  <p className="font-medium text-ink">#{o.id}</p>
                  <p className="text-xs text-ink-muted">
                    {o.customer.name} · {o.customer.email}<br />
                    <span className="text-ink-muted/80">{formatDateLong(o.createdAt)}</span>
                  </p>
                </div>
                <p className="text-sm text-ink-soft">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</p>
                <p className="font-semibold text-brand-900">{formatNaira(o.total)}</p>
                <span className={`inline-flex items-center self-start text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_LABEL[o.status].chip}`}>
                  {STATUS_LABEL[o.status].text}
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(o)}
                  className="text-xs text-brand-800 hover:underline cursor-pointer justify-self-start sm:justify-self-end"
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
            className="bg-white rounded-2xl shadow-card max-w-xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-line flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-ink-muted">Order</p>
                <h2 className="font-display text-xl font-semibold text-ink">#{selected.id}</h2>
                <p className="text-xs text-ink-muted mt-1">{formatDateLong(selected.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-ink-muted hover:text-ink cursor-pointer text-xs"
              >
                Close ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">Customer</p>
                <p className="font-medium text-ink mt-1">{selected.customer.name}</p>
                <p className="text-sm text-ink-soft">{selected.customer.email} · {selected.customer.phone}</p>
                <p className="text-sm text-ink-muted mt-1">
                  {selected.customer.address}, {selected.customer.city}, {selected.customer.state}
                </p>
                {selected.customer.notes && (
                  <p className="text-xs italic text-ink-muted mt-2">"{selected.customer.notes}"</p>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted mb-2">Items</p>
                <ul className="divide-y divide-line border border-line rounded-xl">
                  {selected.items.map((i) => (
                    <li key={i.productId} className="flex justify-between gap-3 px-4 py-3 text-sm">
                      <span className="text-ink">{i.qty}× {i.name}</span>
                      <span className="font-medium text-brand-900">{formatNaira(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="text-sm space-y-1 border-t border-line pt-4">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd>{formatNaira(selected.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Delivery</dt>
                  <dd>{formatNaira(selected.deliveryFee)}</dd>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2">
                  <dt>Total</dt>
                  <dd className="text-brand-900">{formatNaira(selected.total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
