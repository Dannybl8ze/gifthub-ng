"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { CartIcon } from "@/components/icons";

/**
 * StickyShopCTA — mobile-only persistent action bar.
 *
 * Appears after the user scrolls past the hero on small screens. Frosted glass,
 * dual CTAs (cart status + shop entry). Designed for mobile because a desktop
 * site has the navbar always pinned — phones don't.
 */
export function StickyShopCTA() {
  const { itemCount } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed left-3 right-3 bottom-3 z-40 transition-all duration-500 ease-editorial
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}
      aria-hidden={!visible}
    >
      <div className="glass-nav rounded-2xl px-3 py-2.5 flex items-center gap-2">
        <Link
          href="/cart"
          className="relative inline-flex items-center justify-center h-11 w-11 rounded-xl bg-brand-50 text-brand-800 hover:bg-brand-100 cursor-pointer shrink-0"
          aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
        >
          <CartIcon className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-gold text-ink text-[11px] font-semibold flex items-center justify-center px-1 shadow-glow">
              {itemCount}
            </span>
          )}
        </Link>
        <Link
          href="/shop"
          className="btn-gold flex-1 h-11 !py-0"
        >
          Shop all gifts
        </Link>
      </div>
    </div>
  );
}
