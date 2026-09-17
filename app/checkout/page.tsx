"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getProductById } from "@/lib/mock-data";
import { formatNaira } from "@/lib/format";
import type { Order } from "@/lib/types";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

const DELIVERY_FEE = 2500;

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear, saveOrder } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [redirectedEmpty, setRedirectedEmpty] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Lagos",
    notes: "",
    paymentMethod: "card-placeholder" as Order["paymentMethod"],
  });

  useEffect(() => {
    if (lines.length === 0 && !redirectedEmpty) {
      const t = setTimeout(() => router.replace("/cart"), 50);
      return () => clearTimeout(t);
    }
  }, [lines.length, router, redirectedEmpty]);

  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting || lines.length === 0) return;
    setSubmitting(true);

    const order: Order = {
      id: `GH-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer: { ...form },
      items: lines.flatMap((l) => {
        const p = getProductById(l.productId);
        if (!p) return [];
        return [{
          productId: p.id,
          name: p.name,
          price: p.price,
          qty: l.qty,
          image: p.image,
        }];
      }),
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      paymentMethod: form.paymentMethod,
      status: "pending",
    };

    saveOrder(order);
    setRedirectedEmpty(true);
    clear();
    // small UX delay so the "Placing" state is visible
    setTimeout(() => router.replace(`/orders/${order.id}`), 350);
  }

  return (
    <div className="container-page">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
          Checkout
        </h1>
        <p className="mt-2 text-ink-muted">
          Fill in your details — payment is a placeholder for this prototype.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
        <div className="space-y-6">
          {/* Contact */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="label">Full name</label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="input"
                  placeholder="Aminat Bello"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="input"
                  placeholder="you@email.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="label">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="input"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Delivery address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="label">Street address</label>
                <input
                  id="address"
                  required
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="input"
                  placeholder="12 Adeola Odeku Street"
                />
              </div>
              <div>
                <label htmlFor="city" className="label">City</label>
                <input
                  id="city"
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="input"
                  placeholder="Victoria Island"
                />
              </div>
              <div>
                <label htmlFor="state" className="label">State</label>
                <select
                  id="state"
                  required
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className="input cursor-pointer"
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="label">Delivery notes (optional)</label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="input min-h-[88px] resize-y"
                  placeholder="Gate code, landmark, gift message..."
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold text-ink mb-1">Payment</h2>
            <p className="text-xs text-ink-muted mb-4">Placeholder only — no real charge will occur.</p>
            <div className="grid gap-2">
              {[
                { id: "card-placeholder", label: "Card payment (placeholder)", note: "Stripe / Paystack will plug in here" },
                { id: "transfer", label: "Bank transfer", note: "We'll send account details after order" },
                { id: "cod", label: "Cash / Pay on delivery", note: "Lagos & Abuja only" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    form.paymentMethod === opt.id
                      ? "border-brand-800 bg-brand-50/70"
                      : "border-line bg-white/70 hover:bg-brand-50/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="mt-1 accent-brand-800 cursor-pointer"
                    checked={form.paymentMethod === opt.id}
                    onChange={() => update("paymentMethod", opt.id as Order["paymentMethod"])}
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">{opt.label}</p>
                    <p className="text-xs text-ink-muted">{opt.note}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Order summary</h2>
            <ul className="space-y-3 mb-4 max-h-72 overflow-auto pr-1">
              {lines.map((l) => {
                const p = getProductById(l.productId);
                if (!p) return null;
                return (
                  <li key={l.productId} className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md bg-brand-100 text-brand-900 text-xs font-semibold">
                      {l.qty}×
                    </span>
                    <span className="flex-1 truncate text-ink">{p.name}</span>
                    <span className="text-ink-muted">{formatNaira(p.price * l.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="space-y-2 text-sm border-t border-line pt-4">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="font-medium text-ink">{formatNaira(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Delivery</dt>
                <dd className="font-medium text-ink">{formatNaira(DELIVERY_FEE)}</dd>
              </div>
              <div className="border-t border-line pt-3 mt-3 flex justify-between text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-display font-semibold text-brand-900">{formatNaira(total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={submitting || lines.length === 0}
              className="btn-gold w-full mt-6"
            >
              {submitting ? "Placing order…" : (
                <>
                  Place order
                  <CheckIcon className="w-4 h-4" />
                </>
              )}
            </button>
            <Link href="/cart" className="block text-center text-xs text-ink-muted mt-3 hover:text-brand-800 cursor-pointer">
              ← Back to cart
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
