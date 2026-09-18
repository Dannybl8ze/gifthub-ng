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
| `/shop` | Product listing with sidebar search + filters (`?q=…&group=…&occasion=…`) — all three combine |
| `/shop/[slug]` | Product detail with quantity selector, "for" + "perfect for" chips |
| `/cart` | Cart with quantity controls, delivery fee, subtotal |
| `/checkout` | Guest checkout — name, email, phone, address, state, delivery notes, payment method (placeholder) |
| `/orders/[id]` | Order confirmation with summary + delivery details |
| `/support` | Customer support — WhatsApp/email/phone, FAQ accordion, contact form |
| `/admin` | Admin overview — KPIs and latest orders |
| `/admin/products` | Product CRUD list |
| `/admin/products/new` | Create product (with image upload from device or URL) |
| `/admin/products/[id]` | Edit product |
| `/admin/categories` | Read-only view of all groups and occasions |
| `/admin/orders` | All orders placed in this browser, with a detail modal |
| `/admin/support` | Support inbox — messages from the `/support` form, with a resolve/reopen toggle |

A floating WhatsApp button (bottom-right, hidden on `/admin`) is available site-wide via `components/whatsapp-button.tsx`.

Search is available two ways: a live typeahead in the navbar (`components/search-bar.tsx`, click the search icon on desktop or open the mobile menu) that shows up to 5 matching products as you type, and a plain search field in the `/shop` sidebar that combines with the group/occasion filters via the URL (`?q=…`). Both match against product name + description client-side — there's no backend involved given the catalogue's size.

## How the data layer works (prototype)

- **Categories** (groups + occasions) live in `lib/mock-data.ts`. They're constants shared between the storefront and admin.
- **Products** are seeded from `mock-data.ts` and become editable from the admin via `lib/admin-store.ts`, which persists CRUD changes to `localStorage`. Use *Reset to seed* on `/admin/products` to wipe local edits.
- **Cart** state lives in `lib/cart-context.tsx` (React context + `localStorage`). It persists across pages and tabs in the same browser.
- **Orders** placed via checkout are stored in the same context and surface on `/admin/orders` and the order confirmation page.
- **Support messages** submitted via `/support` are stored in `localStorage` through `lib/support-store.ts` and surface on `/admin/support`. Contact details (WhatsApp number, email, phone, FAQ copy) live in `lib/support-data.ts` — **the WhatsApp number there is a placeholder**, replace it before going live.

In production, the admin store, cart, orders, and support inbox would be replaced with reads/writes through `lib/supabase.ts`. The function `getSupabase()` already returns a configured client when env vars are present — wiring it in is a localised change to those four modules.

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
  support/page.tsx                         # customer support
  admin/layout.tsx
  admin/page.tsx                           # dashboard
  admin/products/page.tsx                  # list
  admin/products/new/page.tsx              # create
  admin/products/[id]/page.tsx             # edit
  admin/categories/page.tsx
  admin/orders/page.tsx
  admin/support/page.tsx                   # support inbox
components/                                 # navbar, footer, product-card, product-form, icons,
                                             # whatsapp-button, search-bar, etc.
lib/
  mock-data.ts                              # groups, occasions, seed products
  types.ts                                  # shared TS types
  format.ts                                 # ₦ formatter, date formatter
  cart-context.tsx                          # cart + orders state
  admin-store.ts                            # admin products store
  support-data.ts                           # support contact info + FAQ content
  support-store.ts                          # support inbox store
  supabase.ts                               # optional client
```
