export type ConsumerGroupSlug =
  | "students"
  | "corporate-workers"
  | "health-workers"
  | "religious-groups"
  | "couples-families"
  | "children-kids";

export type OccasionSlug =
  | "valentines-day"
  | "wedding-anniversary"
  | "birthdays"
  | "christmas-easter"
  | "graduation"
  | "mothers-fathers-day";

export interface ConsumerGroup {
  slug: ConsumerGroupSlug;
  name: string;
  tagline: string;
  description: string;
  accent: string; // tailwind classes for accent
  icon: string; // icon key
}

export interface Occasion {
  slug: OccasionSlug;
  name: string;
  tagline: string;
  description: string;
  /** Approximate month (1-12) for date-aware surfacing. null = year-round */
  peakMonth: number | null;
  accent: string;
  icon: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // in NGN (whole naira)
  image: string;
  images?: string[];
  groups: ConsumerGroupSlug[];
  occasions: OccasionSlug[];
  inStock: boolean;
  featured?: boolean;
  badge?: string;
}

export interface CartLine {
  productId: string;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    qty: number;
    image: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cod" | "transfer" | "card-placeholder";
  status: "pending" | "confirmed" | "fulfilled" | "cancelled";
}

export interface SupportMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  topic: string;
  orderId?: string;
  message: string;
  status: "new" | "resolved";
}
