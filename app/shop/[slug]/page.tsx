import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, getConsumerGroup, getOccasion, getProductBySlug } from "@/lib/mock-data";
import { formatNaira } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";
import { ProductGrid } from "@/components/product-card";
import { CheckIcon } from "@/components/icons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? `${product.name} — GiftHub NG` : "Gift — GiftHub NG",
    description: product?.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  // Product JSON-LD for SEO + rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image],
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "NGN",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://gifthub-ng.me/shop/${product.slug}`,
    },
    brand: { "@type": "Brand", name: "GiftHub NG" },
  };

  const related = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.groups.some((g) => product.groups.includes(g)) ||
        p.occasions.some((o) => product.occasions.includes(o)))
  ).slice(0, 4);

  return (
    <div className="container-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-xs text-ink-muted mb-5" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-brand-800 cursor-pointer">Home</Link></li>
          <li>/</li>
          <li><Link href="/shop" className="hover:text-brand-800 cursor-pointer">Shop</Link></li>
          <li>/</li>
          <li className="text-ink-soft">{product.name}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-bg-soft border border-line shadow-card">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 chip-gold">{product.badge}</span>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            {product.name}
          </h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-brand-900">
              {formatNaira(product.price)}
            </span>
            {product.inStock ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-forest">
                <CheckIcon className="w-3.5 h-3.5" />
                In stock
              </span>
            ) : (
              <span className="text-xs font-medium text-red-700">Out of stock</span>
            )}
          </div>

          <p className="mt-5 text-base text-ink-muted leading-relaxed">{product.description}</p>

          <div className="mt-6 space-y-3">
            {product.groups.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted mb-2">For</p>
                <div className="flex flex-wrap gap-2">
                  {product.groups.map((slug) => {
                    const g = getConsumerGroup(slug);
                    if (!g) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/shop?group=${slug}`}
                        className="chip cursor-pointer hover:bg-brand-100 transition-colors"
                      >
                        {g.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            {product.occasions.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted mb-2">Perfect for</p>
                <div className="flex flex-wrap gap-2">
                  {product.occasions.map((slug) => {
                    const o = getOccasion(slug);
                    if (!o) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/shop?occasion=${slug}`}
                        className="chip-gold cursor-pointer hover:bg-gold/30 transition-colors"
                      >
                        {o.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-line">
            <AddToCart productId={product.id} />
          </div>

          <ul className="mt-8 space-y-2 text-sm text-ink-muted">
            <li className="flex items-center gap-2"><CheckIcon className="w-4 h-4 text-forest" /> Same-day Lagos delivery on orders before 12pm</li>
            <li className="flex items-center gap-2"><CheckIcon className="w-4 h-4 text-forest" /> Free hand-wrapping with kraft paper & ribbon</li>
            <li className="flex items-center gap-2"><CheckIcon className="w-4 h-4 text-forest" /> Personalised note included on request</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between mb-6">
            <h2 className="section-title">You may also like</h2>
            <Link href="/shop" className="hidden sm:inline-flex text-sm font-medium text-brand-800 hover:text-brand-900 cursor-pointer">
              See all →
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
