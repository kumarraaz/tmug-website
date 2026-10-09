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
- **NO ZOOM / NO PIXELATION RULE**: Never unnecessarily upscale a source image. Never force an image to `width: 100%; height: 100%; object-fit: cover` when that causes cropping, pixelation, or packaging distortion. Always prefer `object-fit: contain` and preserve native source aspect ratio.
- **PRODUCT TRANSPARENT CUTOUT RULE**: Product images must visually appear as clean product cutouts with transparent backgrounds (PNG). Never render product cutouts inside unwanted white or grey rectangular bounding blocks. Authentic TMUG packaging artwork, logos, and certifications must remain untouched.
- **STRICT ZERO DARK GREEN UI RULE**: Dark green is strictly forbidden for navbar backgrounds, buttons, primary CTAs, main section backgrounds, product card backgrounds, primary UI colors, borders, or navigation controls. The uploaded Olivine `#82BA88` is a light supporting accent only.
- **NO WATER-WAVE ANIMATION RULE**: Water-wave clip-path animations, liquid waves, and wavy overlays are permanently removed. All reveals use smooth Framer Motion pop-up scaling.
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

---

## 8. Permanent Context Control & Documentation Evolution Protocol

1. **Mandatory Documentation Review**: Before starting ANY task, always inspect and understand the 9 official documentation files (`prd.md`, `architecture.md`, `rules.md`, `design.md`, `task.md`, `content.md`, `deployment.md`, `memory.md`, `stickers.md`), along with active source code, assets, and product data.
2. **Current State First**: Never rewrite working functionality just to implement a new request. Modify the smallest appropriate part of the existing system.
3. **Documentation Evolves with Code**: Whenever a website, design, content, UI, UX, styling, feature, product, or architectural change is implemented, update the relevant documentation files as part of the exact same task. Code and documentation must never drift apart.
4. **Color Code Rule**: The latest user-approved color code is ALWAYS the current source of truth. When the user provides a new color code, update documentation and theme tokens immediately, remove conflicting older references, and record the change in `design.md` and `memory.md`. Never invent replacement colors without user approval.
5. **User Instructions Have Priority**: The latest explicit user-approved decision wins. Compare new instructions with existing docs; refine additively or replace outdated rules cleanly.
6. **Additive Memory & Change Logging**: Preserve valuable historical context while establishing current rules.
7. **Plan Before Code**: Evaluate impacts on components, responsive views, product assets, and design tokens prior to writing code.
8. **Brand & Asset Consistency**: Follow the documented TMUG design system. Never introduce random styles. Reuse existing assets in `/public/`.
9. **Truth & Product Integrity**: Never fabricate prices, products, reviews, certifications, or URLs.
10. **Responsive & Quality Verification**: Test Desktop, Tablet, and Mobile (360px–430px). Verify builds and Git status.
11. **Absolute Workflow**: `READ → UNDERSTAND → CHECK CURRENT STATE → PLAN → IMPLEMENT → UPDATE DOCUMENTATION → VERIFY → GIT CHECK`.

---

## 9. Homepage V2 & Zero Green UI Directives

- **STRICT ZERO GREEN UI RULE**: Green is NOT an approved active homepage UI color. Never use green for navbars, buttons, CTA controls, section backgrounds, cards, borders, active states, hover states, navigation links, badges, gradients, or UI containers. Avoid dark green, forest green, bottle green, emerald, sage, olive, or mint green as UI styling. Authentic photographic greens inside verified packaging packshots, tea leaves, flowers, and natural estate photos are strictly preserved.
- **Approved Master UI Palette**:
  - Warm Ivory: `#FFF7EF`
  - Peach Cream / Surface: `#FBE7DC`
  - Coral Pink: `#F36F6F`
  - Berry Pink: `#D94F7D`
  - Blush Pink: `#F6B6C8`
  - Tea Gold: `#D8A33E`
  - Violet: `#7251B5`
  - Deep Plum: `#33243A`
  - Warm Charcoal: `#3A3438`
  - White: `#FFFFFF`
- **Compact Spacing Rule**:
  - Excessive whitespace is strictly eliminated across all homepage sections.
  - Section vertical padding is standardized to `py-8 sm:py-12` (avoiding excessive `py-16` to `py-24` empty spaces).
  - Component gaps and margins are compact, visually cohesive, and content-rich.
- **Hero Banner Slider**: Storefront campaign window using authentic supplied artwork from `public/banners/`. Do not redraw banners in HTML. Maintain correct aspect ratio and image-fit strategy.
- **Water-Wave Reveal Animation**:
  - Card hover triggers organic liquid water wave reveal utilizing CSS `clip-path: polygon(...)` (`@keyframes tmugWave`).
  - Accompanied by Blush Pink (`#F6B6C8`) and Coral (`#F36F6F`) subtle liquid glow.
  - Back-side reveal must use real `back` image assets from `variant.images`. Never fabricate unverified back labels.
  - Mobile tap provides touch-friendly flip toggle.
  - Must provide Add to Cart, In Cart quantity stepper, and direct Remove option calling `removeLine(variantId)`.
  - "Delete/Remove" strictly modifies the customer's cart selection. Never delete catalog data.
- **Open / Reveal Section**: Placed mid-page between Best Sellers and Why TMUG. Features 3D box unboxing, subtle non-blocking flower petal shower, thank-you emoji feedback, and add-to-cart action.
- **Phase 2 Admin Control Panel Directives**:
  - Storefront admin operations reside at `/admin/login` and `/admin`.
  - Authentication is strictly environment-variable based (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).
  - Passwords, emails, and secrets must NEVER be hardcoded into frontend bundles, client-side React components, or committed to Git.
  - Local credentials are configured via `.env.local` (kept strictly Git-ignored); production credentials are configured via Vercel Project Environment Variables.
  - Controls must cover Hero banners, Products, Prices, Images, Collections, Best Seller / Popular Pick flags, and Section visibility/ordering.

---

## 10. Website Visual Control Center Directives

- **Zero-Code Styling Operations**: Routine design changes (colors, typography, spacing, section visibility, banner sequencing, product card styling, hover effects) must be fully executed through the Admin Panel (`/admin`) without modifying codebase files.
- **Draft vs. Published Isolation**: Draft modifications remain strictly isolated to the admin operator environment. Public shoppers only ever receive published settings.
- **Safe Rollback**: Every "Publish All" action must automatically log a history snapshot. Operators can roll back to any historical snapshot without engineering intervention.
- **Strict Zero Dark Green UI Rule Enforcement**: Admin visual controls default to canonical warm ivory, terracotta, gold, and coral tones. Dark green UI must never be applied to buttons, navbars, cards, or headers.
- **Non-Destructive E-Commerce Preservation**: Visual control mutations must never destructively alter authentic catalog definitions (`data/products.ts`), cart mechanics (`ShopProvider`), or WhatsApp checkout generation.
- **Multi-Device Responsiveness**: All custom styles, padding overrides, and font sizes must preserve flawless layouts across Desktop (1280px+), Tablet (768px), and Mobile (360px–430px) viewports with zero horizontal overflow.



