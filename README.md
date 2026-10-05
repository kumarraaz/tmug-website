# TMUG — Modern Indian Tea (Phase 1 Storefront)

One-page premium e-commerce website for the TMUG tea brand. Built with
Next.js 16, React 19, TypeScript and Tailwind CSS v4.

**Phase 1 scope:** premium design, product discovery, variants, cart,
promo popup, WhatsApp ordering, FAQ support bot, SEO foundations and a
lightweight protected SEO admin. No payment gateway, no CRM, no inventory
CRUD — those are Phase 2.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:3000
```

## Scripts

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Start the dev server                      |
| `npm run build`  | Production build (must pass before deploy)|
| `npm run start`  | Serve the production build locally        |
| `npm run lint`   | ESLint                                    |

## Project structure

```
src/
├── app/
│   ├── page.tsx            # one-page storefront (+ Product/ItemList JSON-LD)
│   ├── layout.tsx           # fonts, metadata, Organization/WebSite JSON-LD
│   ├── sitemap.ts / robots.ts
│   ├── admin/seo/page.tsx  # protected SEO admin (password via ADMIN_PASSWORD)
│   └── api/admin/seo/route.ts
├── components/             # design system (Header, Hero, ProductCard, CartDrawer…)
├── config/
│   ├── site.ts             # WhatsApp number, promo config, pricesAreReal flag
│   └── seo.ts              # default SEO settings
├── data/products.ts        # ★ single source of truth: products, variants, PRICES
├── lib/
│   ├── store.tsx           # cart + UI state (localStorage-persisted cart)
│   ├── seo-store.ts        # SEO storage abstraction (Phase 2: swap for DB)
│   └── format.ts
└── types/
public/
├── logo/tmug-logo.png      # transparent logo (extracted from supplied artwork)
└── products/               # 31 supplied product photos, URL-safe names
```

## Pricing

Real selling prices live in `src/data/products.ts` (the single source of
truth) and `pricesAreReal: true` is set in `src/config/site.ts`, so prices
are included in Product structured data. No MRP / compare-at prices are
shown — none were provided. The festive coupon is `TMUG10` (10% off, applied
in the cart); disable it after the season via `promo.enabled: false` in
`src/config/site.ts`.

## Admin panel

Visit `/admin/seo` and sign in with `ADMIN_PASSWORD`. Edit homepage SEO
fields with live length guidance and warnings (missing alt text,
duplicate titles, canonical issues).

Persistence note: settings save to `data/seo-overrides.json` where the
filesystem is writable (local dev). On serverless hosts (Vercel) writes
don’t persist — the UI says so explicitly. Phase 2 replaces
`src/lib/seo-store.ts` with a database-backed implementation of the same
interface.

## Checkout (Phase 1)

No payment gateway yet. The cart’s **“Order on WhatsApp”** button opens a
chat with the order pre-filled (`+91 81307 07344`). The **Checkout**
button shows an honest “coming soon” note instead of faking an order.

## Deploy to Vercel

1. Push this repo to GitHub (`main` branch).
2. In Vercel: **Add New → Project → Import** the repo.
3. Set environment variables: `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`.
4. Deploy. `npm run build` must pass locally first.

## Image alt text

All 31 product photos have meaningful alt text mapped in
`src/data/products.ts` (from the supplied alt-text sheet). The admin
panel flags any missing alt text.
