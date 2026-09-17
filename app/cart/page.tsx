"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { getProductById } from "@/lib/mock-data";
import { formatNaira } from "@/lib/format";
import { ArrowRightIcon, CartIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";

const DELIVERY_FEE = 2500;

export default function CartPage() {
  const { lines, setQty, removeItem, subtotal, itemCount, clear } = useCart();

  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  return (
    <div className="container-page">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
          Your cart
        </h1>
        <p className="mt-2 text-ink-muted">
          {itemCount === 0
            ? "Your cart is empty."
            : `${itemCount} item${itemCount !== 1 ? "s" : ""} ready to checkout.`}
        </p>
      </header>

      {lines.length === 0 ? (
        <div className="card mt-8 p-10 text-center max-w-xl mx-auto">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-brand-50 text-brand-800 inline-flex items-center justify-center">
            <CartIcon className="w-6 h-6" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink">Nothing here yet</h2>
          <p className="mt-1 text-sm text-ink-muted">Browse our collection and add a few gifts to get started.</p>
          <Link href="/shop" className="btn-gold mt-6 inline-flex">
            Browse gifts
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
          <ul className="space-y-3">
            {lines.map((line) => {
              const product = getProductById(line.productId);
              if (!product) return null;
              return (
                <li key={line.productId} className="card p-4 sm:p-5 flex gap-4">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-xl overflow-hidden bg-bg-soft cursor-pointer"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="font-display font-semibold text-ink hover:text-brand-800 transition-colors cursor-pointer"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-ink-muted hover:text-red-700 cursor-pointer transition-colors"
                        aria-label={`Remove ${product.name}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{product.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-xl border border-line bg-white">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, line.qty - 1)}
                          className="h-9 w-9 inline-flex items-center justify-center text-ink-soft hover:bg-brand-50 rounded-l-xl cursor-pointer transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, line.qty + 1)}
                          className="h-9 w-9 inline-flex items-center justify-center text-ink-soft hover:bg-brand-50 rounded-r-xl cursor-pointer transition-colors"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-semibold text-brand-900">
                        {formatNaira(product.price * line.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
            <li className="flex justify-between pt-2">
              <button
                type="button"
                onClick={clear}
                className="text-xs text-ink-muted hover:text-red-700 cursor-pointer"
              >
                Clear cart
              </button>
              <Link href="/shop" className="text-xs text-brand-800 hover:underline cursor-pointer">
                Continue shopping →
              </Link>
            </li>
          </ul>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-ink mb-4">Order summary</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd className="font-medium text-ink">{formatNaira(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Delivery (Lagos)</dt>
                  <dd className="font-medium text-ink">{formatNaira(DELIVERY_FEE)}</dd>
                </div>
                <div className="border-t border-line pt-3 mt-3 flex justify-between text-base">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd className="font-display font-semibold text-brand-900">{formatNaira(total)}</dd>
                </div>
              </dl>
              <Link href="/checkout" className="btn-gold w-full mt-6">
                Proceed to checkout
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <p className="mt-3 text-xs text-ink-muted text-center">
                Taxes and any additional fees calculated at checkout.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
