import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="card group block overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-soft">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 chip-gold">{product.badge}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-ink leading-snug group-hover:text-brand-800 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-ink-muted line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-semibold text-brand-900">{formatNaira(product.price)}</span>
          <span className="text-xs text-brand-700 group-hover:underline">View →</span>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">No gifts match those filters yet</p>
        <p className="text-sm text-ink-muted mt-1">Try removing a filter or browsing all products.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
