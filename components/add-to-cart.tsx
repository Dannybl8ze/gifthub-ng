"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { CartIcon, CheckIcon, MinusIcon, PlusIcon } from "./icons";

export function AddToCart({ productId }: { productId: string }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(productId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem(productId, qty);
    router.push("/cart");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-ink-soft font-medium">Quantity</label>
        <div className="inline-flex items-center rounded-xl border border-line bg-white">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-10 w-10 inline-flex items-center justify-center text-ink-soft hover:bg-brand-50 rounded-l-xl cursor-pointer transition-colors"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="h-10 w-10 inline-flex items-center justify-center text-ink-soft hover:bg-brand-50 rounded-r-xl cursor-pointer transition-colors"
            aria-label="Increase quantity"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button type="button" onClick={handleAdd} className="btn-outline">
          {added ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Added
            </>
          ) : (
            <>
              <CartIcon className="w-4 h-4" />
              Add to cart
            </>
          )}
        </button>
        <button type="button" onClick={handleBuyNow} className="btn-gold">
          Buy now
        </button>
      </div>
    </div>
  );
}
