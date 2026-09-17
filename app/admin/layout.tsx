"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { ArrowRightIcon } from "@/components/icons";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg">
      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col border-r border-line bg-white/70 backdrop-blur-xl min-h-screen sticky top-0">
          <div className="p-6 border-b border-line">
            <Logo />
            <p className="mt-2 text-[11px] uppercase tracking-wider text-ink-muted">Admin console</p>
          </div>
          <nav className="p-4 flex-1">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
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
            </ul>
          </nav>
          <div className="p-4 border-t border-line">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-ink-muted hover:text-brand-800 cursor-pointer"
            >
              <ArrowRightIcon className="w-3 h-3 rotate-180" />
              Back to store
            </Link>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-line">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo size="small" />
            <Link href="/" className="text-xs text-ink-muted hover:text-brand-800 cursor-pointer">Store →</Link>
          </div>
          <nav className="px-2 pb-2 overflow-x-auto">
            <ul className="flex gap-1 min-w-max">
              {NAV.map((item) => {
                const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                        active ? "bg-brand-800 text-gold-soft" : "text-ink-soft hover:bg-brand-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>

        <main className="px-4 sm:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
