# TMUG — Permanent Development Rules

This document serves as the permanent rulebook for engineering, design, and content operations within the TMUG repository. These directives are mandatory and apply to all contributors and automated agents.

---

## 1. Non-Negotiable Foundation

- **DO NOT rebuild the application from scratch**: Build iteratively upon the existing Next.js 16 / React 19 architecture.
- **DO NOT alter established conventions**: Respect existing project patterns, TypeScript models, and folder structures.
- **DO NOT introduce breaking modifications**: Any update must preserve backward compatibility with existing routes and components.

---

## 2. Preserve Existing Functionality

Under no circumstance should any change intentionally break or degrade:
- **Cart**: `ShopProvider` state, local storage persistence (`tmug-cart-v1`), fly-to-cart animation, line item increments, and coupon discount logic.
- **Checkout**: WhatsApp order generator (`whatsappOrderLink`), total computations, and prompt order messaging.
- **Product pages**: Dynamic routes (`/products/[slug]`), variant toggle pills, brewing guides, and ingredients view.
- **Product data**: Single source of truth in `src/data/products.ts` and `src/data/collections.ts`.
- **Navigation**: Desktop header dropdowns, mobile navigation drawer, and in-page anchor jumps (`#shop`, `#collections`, `#why`, `#about`).
- **Mobile menu**: Touch toggle, body scroll lock during open state, and accessibility attributes.
- **WhatsApp**: Direct chat launcher button, customer concierge floating trigger, and product inquiry links targeting `+91 81307 07344`.
- **Routing**: Static legal pages (`/terms`, `/privacy`, `/faq`, `/contact`), collections browser (`/collections`), and sitemap (`sitemap.ts`).
- **Backend/API**: SEO route handler (`src/app/api/admin/seo/route.ts`) and server data store (`src/lib/seo-store.ts`).

---

## 3. Product Presentation Rules

- **Use real TMUG product assets only**: Load packshots exclusively from verified assets located in `/public/products/` and transparent cutouts in `/public/hero/`.
- **Never generate fake packaging**: Do not use generative AI to fabricate imaginary TMUG boxes, pouches, labels, or containers.
- **Never redraw packaging**: Do not replace authentic photographs with graphic approximations or flat 2D vector representations of packs.
- **Never distort packaging**: Maintain exact aspect ratios. Never squish or stretch jar or pouch images.
- **Never crop important packaging**: Packaging images must remain completely visible. Never crop product titles, weight markings (50g, 100g, 250g, 500g), brewing descriptions, or FSSAI certifications. Always apply `object-contain` or generous card paddings.
- **Never replace real TMUG product images with generic stock imagery**: Stock tea leaves or generic mug photos must never stand in for authentic TMUG inventory.

---

## 4. Content Integrity Rules

Never fabricate or guess business data. Specifically:
- **Prices & MRP**: Display only genuine prices from `src/data/products.ts`. Never display artificial struck-through MRPs or fake discounts.
- **Reviews & Testimonials**: Only display verified feedback from actual customers. Never invent fictitious reviews or false ratings.
- **Press Coverage**: Do not include media brand logos or editorial quotes unless formally published and verified.
- **Certifications & Awards**: Reference only authentic legal registrations (such as FSSAI registration details shown on product packaging). Do not claim uncertified awards.
- **Health & Therapeutic Claims**: Never claim medical treatments or cures. Describe products truthfully based on authentic botanical profiles (e.g. caffeine-free, natural whole flowers, antioxidant-rich green tea).
- **Ingredient Claims**: List only authentic ingredients as printed on verified TMUG packaging.
- **Customer Metrics**: Never inflate customer numbers (e.g. "Over 100,000 customers") without verified sales data.
- **Marketplace Availability**: Never list unconfirmed delivery platforms or marketplaces.

---

## 5. Competitor Reference Rules

Brands such as **OLIPOP** and **Wildwonder** serve as high-level visual and artistic references for playful, modern beverage e-commerce.

**Strict Prohibitions**:
- **NEVER copy brand logos or emblems**.
- **NEVER copy exact copywriting, taglines, or microcopy**.
- **NEVER copy proprietary artwork or bespoke typography**.
- **NEVER copy exact illustrations or custom mascot designs**.
- **NEVER copy exact layouts or distinctive brand compositions pixel-for-pixel**.
- **NEVER copy custom interactive animations directly from competitor scripts**.

TMUG’s personality must remain distinctly Indian, botanically authentic, editorial, and playful in its own right.

---

## 6. Sticker & Graphic Asset Rules

- **Prefer licensed SVG assets**: Use clean, scalable vectors with transparent backgrounds.
- **Verify commercial licenses**: Ensure assets from approved libraries allow commercial usage.
- **Avoid watermarked assets**: Never commit watermarked, preview, or unlicensed graphics.
- **Do not use competitor-specific artwork**: Keep stickers general (botanical doodles, tea leaves, stars, sparkles, stamps, washi tape).
- **Do not cover products or vital text**: Stickers should enhance the editorial composition without obstructing packshots, pricing, or calls to action.
- **Asset storage**: Organize stickers in `/public/assets/stickers/` by subcategory (`tea/`, `ingredients/`, `decorative/`, `badges/`).

---

## 7. Engineering & Code Rules

- **Reuse existing components**: Use `ProductCard.tsx`, `QuantitySelector`, `Reveal.tsx`, and existing iconography before writing new primitives.
- **Reuse existing data**: Always consume `PRODUCTS` from `@/data/products` and `COLLECTIONS` from `@/data/collections`.
- **Avoid unnecessary dependencies**: Leverage built-in Next.js, React 19, and Tailwind v4 utilities. Do not install duplicate animation or slider libraries.
- **Keep code maintainable**: Write clear TypeScript interfaces and modular components.
- **Keep marketplace URLs configurable**: Reference `siteConfig.amazonStore` and `siteConfig.marketplaces` in `src/config/site.ts`. Never hardcode raw URLs in component bodies.
- **Avoid duplicated business data**: Centralize promotional codes, contact phone numbers, and WhatsApp messages inside `src/config/site.ts`.
