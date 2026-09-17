"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatNaira, formatDateLong } from "@/lib/format";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getOrder, orders } = useCart();
  const order = getOrder(id);

  // Wait for hydration: orders may be [] on first server-client mismatch
  if (!order) {
    // If we have NO orders at all yet, show a hydration-friendly loader
    if (orders.length === 0) {
      return (
        <div className="container-page py-12 text-center">
          <p className="text-ink-muted text-sm">Loading order…</p>
        </div>
      );
    }
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Order not found</h1>
        <p className="text-ink-muted mt-2">We couldn't find an order with the id <code className="text-brand-900">{id}</code>.</p>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">Back to shop</Link>
      </div>
    );
  }

  const methodLabel =
    order.paymentMethod === "cod"
      ? "Cash on delivery"
      : order.paymentMethod === "transfer"
      ? "Bank transfer"
      : "Card payment (placeholder)";

  return (
    <div className="container-page">
      <div className="max-w-3xl mx-auto">
        <div className="card p-8 sm:p-10 text-center bg-gradient-to-br from-white via-bg-soft/60 to-white">
          <div className="mx-auto inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-forest-soft text-forest shadow-soft">
            <CheckIcon className="w-7 h-7" />
          </div>
          <h1 className="mt-5 font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            Thank you, {order.customer.name.split(" ")[0]}!
          </h1>
          <p className="mt-2 text-ink-muted">
            Your order has been received. A confirmation has been sent to <span className="text-ink-soft font-medium">{order.customer.email}</span>.
          </p>
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="chip-gold">Order #{order.id}</span>
            <span className="chip">{formatDateLong(order.createdAt)}</span>
            <span className="chip">{methodLabel}</span>
          </div>
        </div>

        {/* Items */}
        <section className="card mt-6 p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Items</h2>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.productId} className="py-3 flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-bg-soft shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{item.name}</p>
                  <p className="text-xs text-ink-muted">Qty {item.qty} × {formatNaira(item.price)}</p>
                </div>
                <p className="font-semibold text-brand-900">{formatNaira(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-5 pt-5 border-t border-line space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd className="font-medium text-ink">{formatNaira(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="font-medium text-ink">{formatNaira(order.deliveryFee)}</dd>
            </div>
            <div className="border-t border-line pt-3 mt-3 flex justify-between text-base">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-display font-semibold text-brand-900">{formatNaira(order.total)}</dd>
            </div>
          </dl>
        </section>

        <div className="grid sm:grid-cols-2 gap-5 mt-6">
          <section className="card p-6">
            <h3 className="text-xs uppercase tracking-wider text-ink-muted">Deliver to</h3>
            <p className="mt-2 font-medium text-ink">{order.customer.name}</p>
            <p className="text-sm text-ink-soft">{order.customer.phone}</p>
            <p className="text-sm text-ink-muted mt-1">
              {order.customer.address}<br />
              {order.customer.city}, {order.customer.state}
            </p>
            {order.customer.notes && (
              <p className="mt-3 text-xs text-ink-muted italic">"{order.customer.notes}"</p>
            )}
          </section>
          <section className="card p-6">
            <h3 className="text-xs uppercase tracking-wider text-ink-muted">What happens next</h3>
            <ol className="mt-3 space-y-2 text-sm text-ink-soft">
              <li className="flex gap-2"><span className="text-forest">●</span> We'll confirm your order within 30 minutes</li>
              <li className="flex gap-2"><span className="text-gold-dark">●</span> Items hand-wrapped and prepared for delivery</li>
              <li className="flex gap-2"><span className="text-brand-700">●</span> Tracking link sent to your email</li>
            </ol>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/shop" className="btn-primary">
            Continue shopping
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <Link href="/" className="btn-ghost">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
