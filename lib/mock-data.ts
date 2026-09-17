import type { ConsumerGroup, Occasion, Product } from "./types";

export const CONSUMER_GROUPS: ConsumerGroup[] = [
  {
    slug: "students",
    name: "Students",
    tagline: "Care packages for campus life",
    description: "Snack hampers, study kits and dorm-room comforts that travel well.",
    accent: "from-amber-200 to-amber-400",
    icon: "academic",
  },
  {
    slug: "corporate-workers",
    name: "Corporate Workers",
    tagline: "Polished gifts that read 'professional'",
    description: "Branded hampers, premium notebooks and desk essentials suitable for any office.",
    accent: "from-stone-300 to-amber-300",
    icon: "briefcase",
  },
  {
    slug: "health-workers",
    name: "Health Workers",
    tagline: "Restorative gifts for the people who care",
    description: "Self-care bundles, wellness teas and comfort sets for long shifts.",
    accent: "from-emerald-200 to-amber-200",
    icon: "heart",
  },
  {
    slug: "religious-groups",
    name: "Religious Groups",
    tagline: "Faith-led gifts and thanksgiving hampers",
    description: "Curated hampers for harvests, dedications and faith-based celebrations.",
    accent: "from-amber-200 to-rose-200",
    icon: "sparkles",
  },
  {
    slug: "couples-families",
    name: "Couples & Families",
    tagline: "Shared moments, beautifully packaged",
    description: "Anniversary hampers, family treat boxes and bonding-time bundles.",
    accent: "from-rose-200 to-amber-200",
    icon: "users",
  },
  {
    slug: "children-kids",
    name: "Children & Kids",
    tagline: "Bright, joyful gifts that bring smiles",
    description: "Kid-friendly hampers, toys and treat boxes for birthdays and school milestones.",
    accent: "from-amber-200 to-orange-300",
    icon: "gift",
  },
];

export const OCCASIONS: Occasion[] = [
  {
    slug: "valentines-day",
    name: "Valentine's Day",
    tagline: "Love, packaged with care",
    description: "Romantic hampers, gourmet chocolates and thoughtful surprises for the 14th.",
    peakMonth: 2,
    accent: "from-rose-300 to-amber-300",
    icon: "heart",
  },
  {
    slug: "wedding-anniversary",
    name: "Wedding Anniversary",
    tagline: "Mark the milestone in style",
    description: "Elegant gifts to celebrate years together — from paper to gold.",
    peakMonth: null,
    accent: "from-amber-300 to-yellow-200",
    icon: "sparkles",
  },
  {
    slug: "birthdays",
    name: "Birthdays",
    tagline: "Make every year unforgettable",
    description: "Birthday hampers for every age, group and personality.",
    peakMonth: null,
    accent: "from-pink-200 to-amber-200",
    icon: "cake",
  },
  {
    slug: "christmas-easter",
    name: "Christmas & Easter",
    tagline: "Season's hampers, beautifully arranged",
    description: "Festive hampers for the holidays — perfect for family, staff or congregation.",
    peakMonth: 12,
    accent: "from-emerald-300 to-amber-300",
    icon: "sparkles",
  },
  {
    slug: "graduation",
    name: "Graduation",
    tagline: "Celebrate the win",
    description: "Hampers and keepsakes to mark a new chapter — perfect for students and families.",
    peakMonth: 7,
    accent: "from-amber-300 to-violet-200",
    icon: "academic",
  },
  {
    slug: "mothers-fathers-day",
    name: "Mother's & Father's Day",
    tagline: "Thank them with something thoughtful",
    description: "Curated hampers that say what words sometimes can't.",
    peakMonth: 5,
    accent: "from-rose-200 to-amber-300",
    icon: "users",
  },
];

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=70`;

export const PRODUCTS: Product[] = [
  {
    id: "p-001",
    slug: "campus-comfort-hamper",
    name: "Campus Comfort Hamper",
    description:
      "A care package built for late-night study sessions: artisan biscuits, premium tea, a reusable mug, an enamel pen and a hand-bound notebook. Comes wrapped in a kraft gift box.",
    price: 18500,
    image: img("photo-1513885535751-8b9238bd345a"),
    groups: ["students", "children-kids"],
    occasions: ["birthdays", "graduation"],
    inStock: true,
    featured: true,
    badge: "Bestseller",
  },
  {
    id: "p-002",
    slug: "executive-leather-set",
    name: "Executive Leather Set",
    description:
      "Premium leather journal, branded pen and card holder in a wood-grain presentation box. Suited to executives and team milestones.",
    price: 42000,
    image: img("photo-1583394838336-acd977736f90"),
    groups: ["corporate-workers"],
    occasions: ["wedding-anniversary", "christmas-easter"],
    inStock: true,
    featured: true,
  },
  {
    id: "p-003",
    slug: "nurse-restore-bundle",
    name: "Restore Self-Care Bundle",
    description:
      "Shea body butter, lavender bath salts, herbal tea and a silk eye mask — a thank-you for the people who care for us.",
    price: 24500,
    image: img("photo-1556228720-195a672e8a03"),
    groups: ["health-workers", "couples-families"],
    occasions: ["mothers-fathers-day", "birthdays"],
    inStock: true,
    featured: true,
    badge: "Self-care",
  },
  {
    id: "p-004",
    slug: "thanksgiving-harvest-basket",
    name: "Thanksgiving Harvest Basket",
    description:
      "A generously filled woven basket of seasonal fruits, nuts and homemade preserves — a centrepiece for thanksgiving services.",
    price: 36000,
    image: img("photo-1502741126161-b048400d085d"),
    groups: ["religious-groups", "couples-families"],
    occasions: ["christmas-easter"],
    inStock: true,
  },
  {
    id: "p-005",
    slug: "romance-deluxe-box",
    name: "Romance Deluxe Gift Box",
    description:
      "Belgian chocolates, sparkling rosé (non-alcoholic option available), scented candles and a hand-written keepsake card.",
    price: 32000,
    image: img("photo-1518895949257-7621c3c786d7"),
    groups: ["couples-families"],
    occasions: ["valentines-day", "wedding-anniversary"],
    inStock: true,
    featured: true,
    badge: "Limited",
  },
  {
    id: "p-006",
    slug: "graduation-keepsake-bundle",
    name: "Graduation Keepsake Bundle",
    description:
      "A leather-bound journal, a premium pen, a celebratory mug and a personalised card to mark the milestone.",
    price: 21000,
    image: img("photo-1523050854058-8df90110c9f1"),
    groups: ["students", "couples-families"],
    occasions: ["graduation", "birthdays"],
    inStock: true,
  },
  {
    id: "p-007",
    slug: "kids-celebration-box",
    name: "Kids Celebration Box",
    description:
      "Colourful treats, fun stationery, a plush toy and a personalised card — perfect for a child's birthday or special day.",
    price: 16500,
    image: img("photo-1530021232320-687d8e3dba54"),
    groups: ["children-kids"],
    occasions: ["birthdays", "christmas-easter"],
    inStock: true,
    badge: "Kid-favourite",
  },
  {
    id: "p-008",
    slug: "office-pickme-up-hamper",
    name: "Office Pick-Me-Up Hamper",
    description:
      "Specialty coffees, premium snacks and an elegant mug — a thoughtful welcome-back-to-work or appreciation gift.",
    price: 19500,
    image: img("photo-1481833761820-0509d3217039"),
    groups: ["corporate-workers", "health-workers"],
    occasions: ["birthdays", "mothers-fathers-day"],
    inStock: true,
  },
  {
    id: "p-009",
    slug: "anniversary-gold-hamper",
    name: "Anniversary Gold Hamper",
    description:
      "Champagne flutes, gourmet chocolates, a silk rose and a personalised gold-foil card. Beautifully presented.",
    price: 48000,
    image: img("photo-1549465220-1a8b9238cd48"),
    groups: ["couples-families"],
    occasions: ["wedding-anniversary", "valentines-day"],
    inStock: true,
    featured: true,
  },
  {
    id: "p-010",
    slug: "study-snack-stack",
    name: "Study Snack Stack",
    description:
      "An affordable but generous box of campus-favourite snacks, energy drinks and a study planner.",
    price: 8500,
    image: img("photo-1490474418585-ba9bad8fd0ea"),
    groups: ["students"],
    occasions: ["birthdays"],
    inStock: true,
  },
  {
    id: "p-011",
    slug: "faith-blessings-hamper",
    name: "Faith & Blessings Hamper",
    description:
      "An olive-wood cross, devotional book, scented candle, herbal teas and a hand-written prayer card.",
    price: 28000,
    image: img("photo-1512496015851-a90fb38ba796"),
    groups: ["religious-groups", "couples-families"],
    occasions: ["christmas-easter", "wedding-anniversary"],
    inStock: true,
  },
  {
    id: "p-012",
    slug: "mums-treasure-hamper",
    name: "Mum's Treasure Hamper",
    description:
      "Skincare essentials, gourmet teas, dark chocolate and a hand-written card — a thank-you she'll remember.",
    price: 26500,
    image: img("photo-1522335789203-aaa00abc69b3"),
    groups: ["couples-families", "health-workers"],
    occasions: ["mothers-fathers-day", "birthdays"],
    inStock: true,
    featured: true,
  },
];

/**
 * Custom photography roster.
 *
 * As you generate each product photo (prompts in docs/photography-prompts.md)
 * and save it to public/products/<slug>.jpg, add the slug to this Set.
 * Any product whose slug is listed here renders from the local file;
 * everything else continues to use the Unsplash fallback. This lets you
 * roll out the catalogue one photo at a time without breaking the site.
 *
 * Once all 12 are in place, replace the Set with `new Set(PRODUCTS.map(p => p.slug))`.
 */
const CUSTOM_PHOTOGRAPHY = new Set<string>([
  "campus-comfort-hamper",
  "executive-leather-set",
  "nurse-restore-bundle",
  "thanksgiving-harvest-basket",
  "romance-deluxe-box",
  "graduation-keepsake-bundle",
  "kids-celebration-box",
  "office-pickme-up-hamper",
  "anniversary-gold-hamper",
  "study-snack-stack",
  "faith-blessings-hamper",
  "mums-treasure-hamper",
]);

for (const p of PRODUCTS) {
  if (CUSTOM_PHOTOGRAPHY.has(p.slug)) {
    p.image = `/products/${p.slug}.jpg`;
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getConsumerGroup(slug: string): ConsumerGroup | undefined {
  return CONSUMER_GROUPS.find((g) => g.slug === slug);
}

export function getOccasion(slug: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}

export function filterProducts(opts: { group?: string | null; occasion?: string | null }): Product[] {
  return PRODUCTS.filter((p) => {
    if (opts.group && !p.groups.includes(opts.group as never)) return false;
    if (opts.occasion && !p.occasions.includes(opts.occasion as never)) return false;
    return true;
  });
}

/**
 * Pick the occasion whose peakMonth is nearest to (and not far behind) the given month.
 * Returns the first year-round occasion (peakMonth=null) only as fallback.
 */
export function nearestUpcomingOccasion(now: Date = new Date()): Occasion {
  const m = now.getMonth() + 1; // 1..12
  const dated = OCCASIONS.filter((o) => o.peakMonth !== null);
  const scored = dated.map((o) => {
    const diff = (o.peakMonth! - m + 12) % 12; // months until peak
    return { o, diff };
  });
  scored.sort((a, b) => a.diff - b.diff);
  return scored[0]?.o ?? OCCASIONS[0];
}
