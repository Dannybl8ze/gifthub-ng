import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-soft/60 backdrop-blur-sm">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 text-sm text-ink-muted max-w-md leading-relaxed">
              Thoughtfully curated gift hampers and products for every group and every
              special moment. Made in Nigeria, delivered with care.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li><Link className="hover:text-brand-800 cursor-pointer" href="/shop">All gifts</Link></li>
              <li><Link className="hover:text-brand-800 cursor-pointer" href="/groups">By group</Link></li>
              <li><Link className="hover:text-brand-800 cursor-pointer" href="/occasions">By occasion</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink mb-3">Customer</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li><Link className="hover:text-brand-800 cursor-pointer" href="/cart">My cart</Link></li>
              <li><Link className="hover:text-brand-800 cursor-pointer" href="/admin">Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-line/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} GiftHub NG. All rights reserved.</p>
          <p>Prices in Nigerian Naira (₦)</p>
        </div>
      </div>
    </footer>
  );
}
