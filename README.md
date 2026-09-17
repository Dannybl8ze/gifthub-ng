# GiftHub NG

A full-stack e-commerce prototype for a Nigerian gift shop. Products are organised across two independent dimensions — **consumer groups** (Students, Corporate Workers, Health Workers, Religious Groups, Couples & Families, Children & Kids) and **special occasions** (Valentine's Day, Wedding Anniversary, Birthdays, Christmas & Easter, Graduation, Mother's & Father's Day). A single product can belong to many of each.

## Stack

- **Next.js 14** (App Router, React 18, TypeScript)
- **Tailwind CSS** with a warm coffee/gold palette + Rubik / Nunito Sans typography
- **Supabase** client wired in (`lib/supabase.ts`) — auto-falls back to in-memory mock data when env vars are not set, so the demo runs with zero setup

## Getting started

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

### Optional: connect Supabase

Copy `.env.example` → `.env.local` and fill in your Supabase project URL + anon key. The app will still run without these (mock data is used).

```bash
cp .env.example .env.local
```

> `.env` files are intentionally not committed.

## Pages

| Route | What it does |
|---|---|
| `/` | Hero, date-aware upcoming occasion banner, group + occasion grids, featured products |
| `/groups` | All consumer groups |
| `/occasions` | All occasions |
| `/shop` | Product listing with sidebar filters (`?group=…&occasion=…`) — supports both at once |
| `/shop/[slug]` | Product detail with quantity selector, "for" + "perfect for" chips |
| `/cart` | Cart with quantity controls, delivery fee, subtotal |
| `/checkout` | Guest checkout — name, email, phone, address, state, delivery notes, payment method (placeholder) |
| `/orders/[id]` | Order confirmation with summary + delivery details |
| `/admin` | Admin overview — KPIs and latest orders |
| `/admin/products` | Product CRUD list |
| `/admin/products/new` | Create product (with image upload from device or URL) |
| `/admin/products/[id]` | Edit product |
| `/admin/categories` | Read-only view of all groups and occasions |
| `/admin/orders` | All orders placed in this browser, with a detail modal |

## How the data layer works (prototype)

- **Categories** (groups + occasions) live in `lib/mock-data.ts`. They're constants shared between the storefront and admin.
- **Products** are seeded from `mock-data.ts` and become editable from the admin via `lib/admin-store.ts`, which persists CRUD changes to `localStorage`. Use *Reset to seed* on `/admin/products` to wipe local edits.
- **Cart** state lives in `lib/cart-context.tsx` (React context + `localStorage`). It persists across pages and tabs in the same browser.
- **Orders** placed via checkout are stored in the same context and surface on `/admin/orders` and the order confirmation page.

In production, the admin store, cart, and orders would be replaced with reads/writes through `lib/supabase.ts`. The function `getSupabase()` already returns a configured client when env vars are present — wiring it in is a localised change to those three modules.

## Accepted features (vs the brief)

- [x] Consumer group filter shows correct products per group
- [x] Occasion filter shows correct products per occasion
- [x] A product can belong to multiple groups/occasions simultaneously
- [x] Cart persists across page navigation
- [x] Checkout captures customer name, email, delivery address, and selected payment method
- [x] Order confirmation shown after submission
- [x] All pages are mobile-responsive
- [x] Nigerian Naira (₦) as default currency
- [x] Full admin CRUD for products + categories + orders

## Scope notes

- Payment is a **placeholder** — no real card processing. The form captures a method choice (card placeholder / bank transfer / cash on delivery) and stores it with the order.
- Auth is **guest-only** — no accounts. Customers enter their details at checkout.
- Image upload in the admin uses a base64 data URL stored in `localStorage` (sufficient for a prototype). Wire to Supabase Storage in production.

## File map

```
app/
  layout.tsx, globals.css, page.tsx        # root + home
  groups/page.tsx                          # all groups
  occasions/page.tsx                       # all occasions
  shop/page.tsx                            # listing + filters
  shop/[slug]/page.tsx                     # product detail
  cart/page.tsx
  checkout/page.tsx
  orders/[id]/page.tsx                     # confirmation
  admin/layout.tsx
  admin/page.tsx                           # dashboard
  admin/products/page.tsx                  # list
  admin/products/new/page.tsx              # create
  admin/products/[id]/page.tsx             # edit
  admin/categories/page.tsx
  admin/orders/page.tsx
components/                                 # navbar, footer, product-card, product-form, icons, etc.
lib/
  mock-data.ts                              # groups, occasions, seed products
  types.ts                                  # shared TS types
  format.ts                                 # ₦ formatter, date formatter
  cart-context.tsx                          # cart + orders state
  admin-store.ts                            # admin products store
  supabase.ts                               # optional client
```
