import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/mock-data";
import { SITE_URL } from "@/lib/site";

/**
 * Public pages only. Cart, checkout, order confirmations and /admin are left out on purpose.
 * Served at /sitemap.xml and advertised from public/robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/groups", priority: 0.7 },
    { path: "/occasions", priority: 0.7 },
    { path: "/support", priority: 0.5 },
  ];

  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p.path}`, priority: p.priority })),
    ...PRODUCTS.map((p) => ({ url: `${SITE_URL}/shop/${p.slug}`, priority: 0.8 })),
  ];
}
