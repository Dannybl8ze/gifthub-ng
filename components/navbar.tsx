"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartIcon, MenuIcon, CloseIcon } from "./icons";
import { Logo } from "./logo";
import { useCart } from "@/lib/cart-context";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop all" },
  { href: "/groups", label: "By group" },
  { href: "/occasions", label: "By occasion" },
  { href: "/support", label: "Support" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav className="container-page">
        <div className="glass-nav rounded-2xl flex items-center justify-between px-4 sm:px-6 py-3">
          <Logo />

          <ul className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
                      active
                        ? "bg-brand-800 text-gold-soft"
                        : "text-ink-soft hover:bg-brand-50 hover:text-brand-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden sm:inline-flex text-xs text-ink-muted hover:text-brand-800 px-2 py-1 rounded cursor-pointer transition-colors"
            >
              Admin
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl bg-brand-50 text-brand-800 hover:bg-brand-100 transition-colors cursor-pointer"
              aria-label={`Cart (${itemCount} items)`}
            >
              <CartIcon className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-gold text-ink text-[11px] font-semibold flex items-center justify-center px-1 shadow-glow">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl text-ink-soft hover:bg-brand-50 cursor-pointer"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass-nav rounded-2xl p-2 animate-fade-up">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                        active
                          ? "bg-brand-800 text-gold-soft"
                          : "text-ink-soft hover:bg-brand-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm text-ink-muted hover:bg-brand-50 cursor-pointer"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
