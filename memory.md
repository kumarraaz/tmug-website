# TMUG — Persistent Project Context & Memory

This document stores persistent institutional context, core architectural decisions, design reference boundaries, and UX priorities for the TMUG digital storefront.

---

## 1. Project Overview

- **Brand**: TMUG
- **Category**: Premium Indian D2C Tea Storefront
- **Repository**: `kumarraaz/tmug-website`
- **Core Mission**: Modern, playful, product-led tea discovery connecting discerning drinkers with whole-flower infusions, single-origin Darjeeling greens, and robust Assam CTC chai.

---

## 2. Design References & Guardrails

- **OLIPOP**: [https://drinkolipop.com/](https://drinkolipop.com/)
- **Wildwonder**: [https://drinkwildwonder.com/](https://drinkwildwonder.com/)

> [!IMPORTANT]
> These sites serve as high-level aesthetic benchmarks for cheerful typography, vibrant color harmony, and engaging motion. Never copy their trade dress, proprietary illustrations, copy, or visual assets.

---

## 3. Existing Assets Reality

- Authentic TMUG product packaging photographs, transparent PNG hero cutouts, brand logos, and SVG stickers **already exist in this repository**.
- Packshots are located in `/public/products/` (31 files).
- Layered hero transparent cutouts are located in `/public/hero/` (11 files).
- Official logo is in `/public/logo/tmug-logo.png`.
- Custom SVG stickers are in `/public/assets/stickers/`.
- **Rule**: Do not ask the user to re-upload or provide assets that are already present in the workspace.

---

## 4. Key Homepage Architectural Decisions

### Sections Removed
- `"Meet Your New Favourite Tea"` has been removed from the homepage flow.
- `"The Artisan Lineup"` has been removed from the homepage flow.
- Any empty layout gaps resulting from these removals must remain cleaned up.

### Section Redesign: "Made for moments that linger"
The lifestyle section has been redesigned to eliminate visual bloat:
- **NO oversized product photos**.
- **NO giant TMUG logo**.
- **NO heavy, distracting image cards**.
- **YES**: Clean editorial typography, interactive floating stickers, washi tape labels, delicate botanical SVGs, and gentle interactive hover physics (`LifestyleGallery.tsx`).

### "Shop Our Collections" Carousel
- Must function as a **real horizontal product slider/carousel** (`ShopCollections.tsx`).
- Category tabs (*All Teas*, *Flower Teas*, *Chai*, *Green Tea*, *Herbal & Fresh*, *Bestsellers*) must filter items instantaneously.
- Switching tabs must smoothly reset scroll position to the first card.
- Packaging must remain **completely visible** without clipping or vertical cropping.

---

## 5. Amazon & Marketplace Policy

### Verified Amazon Store
- Official TMUG Amazon Brand Store URL:
  ```
  https://www.amazon.in/stores/Tmug/page/4EF8CF60-EB4F-4438-B735-748BE0ED8162?lp_asin=B0H25XRHC5&ref_=ast_bln
  ```
- Configured centrally in `siteConfig.amazonStore`.

### Marketplace Availability
- Never fabricate links or invent partnerships for quick-commerce apps (Blinkit, Zepto, Swiggy Instamart).
- Only confirmed retail channels may have active status.

---

## 6. Product & Packaging Integrity

- **Never generate or modify packaging**: Do not use AI image generation to invent or redraw packaging labels, pouches, or jars.
- **Never distort packaging**: Always preserve proper aspect ratios; never stretch or distort.
- **Never crop packshots**: Ensure full product silhouette, net weight markings, and certifications are clearly readable.

---

## 7. Content & Truth Integrity

Under no circumstances should any developer or automated agent fabricate:
- Product prices or comparative MRPs.
- Fake promotional discounts.
- Fabricated customer reviews or testimonials.
- Press logos or fictional media coverage.
- Medical or curative health claims.
- Certifications or awards not held by the brand.
- Ingredient compositions not stated on official labels.
- Artificial customer counts or sales volume metrics.

---

## 8. UX Priorities (Ranked Order)

1. **Product visibility**: Full, unclipped product packaging across all devices.
2. **Conversion**: High-converting, frictionless WhatsApp concierge ordering and direct add-to-cart actions.
3. **Mobile responsiveness**: 100% responsive, swipe-friendly, zero horizontal overflow across 360px–430px viewports.
4. **Performance**: Fast page load times, optimized assets, smooth 60fps animations.
5. **Premium design**: Editorial typography, warm cream canvas, refined botanical colors.
6. **Playful interaction**: Tactile stickers, 3D hover effects, gentle tea steam animations.
7. **Accessibility**: Clear contrast, screen-reader semantic HTML, full `prefers-reduced-motion` compliance.

---

## 9. Permanent Development & Context Control Protocol

1. **Mandatory Documentation Review**: Before every single task, review all 9 living documentation files (`prd.md`, `architecture.md`, `rules.md`, `design.md`, `task.md`, `content.md`, `deployment.md`, `memory.md`, `stickers.md`) alongside active components, styling, product data, and git state.
2. **Current State First**: Never rewrite working code to implement a new request. Modify the smallest appropriate part of the existing system.
3. **Documentation Evolves with Code**: Whenever a change is implemented, update the corresponding documentation files as part of the exact same task.
4. **Color Code Rule**: The latest user-approved color code is ALWAYS the current source of truth. When the user provides a new color code, update documentation and theme tokens immediately, remove conflicting older references, and record the change in `design.md` and `memory.md`. Never invent replacement colors without user approval.
5. **User Priority**: The latest explicit user-approved decision wins.
6. **Additive Memory**: Preserve valuable historical context; add new requirements without erasing foundational memory.
7. **Plan Before Code**: Map impacts across components, responsive layouts, data, tokens, and SEO prior to writing code.
8. **Brand & Asset Consistency**: Follow the current documented TMUG design system. Never introduce random styles. Reuse existing assets in `/public/`.
9. **Truth & Product Integrity**: Never fabricate prices, products, reviews, certifications, or URLs.
10. **Responsive & Quality Verification**: Test Desktop, Tablet, and Mobile (360px–430px). Verify builds and Git status.
11. **Final Task Reporting Standard**: Every task response must report:
    - What changed.
    - Which components/files changed.
    - Which documentation files were updated.
    - Any new design/color/content decisions recorded.
    - Validation/build result.
    - Git status.
    - Commit/push status if performed.
    - Any remaining issue or user decision required.
12. **Absolute Rule**: `READ → UNDERSTAND → CHECK CURRENT STATE → PLAN → IMPLEMENT → UPDATE DOCUMENTATION → VERIFY → GIT CHECK`.

---

## 10. Homepage V2 Architectural & Design Decisions

### Hero Banner Slider Architecture
- Transformed the hero from an isolated 3D stage into a storefront campaign promotional banner slider.
- Consumes 6 high-resolution brand campaign artworks stored in `/public/banners/` via centralized configuration `src/config/banners.ts`.
- Features crossfade transitions, autoplay with pause on hover/interaction, previous/next buttons, pagination pills, `01 / 06` counter, and touch swipe gestures.
- Direct links route users to verified product (`/products/butterfly-pea-flower-tea`) and collection (`/#collections`) pages.

### Strict Zero Green UI Rule
- Green is strictly prohibited as an active UI color across navbar, buttons, CTA controls, section backgrounds, cards, borders, active states, hover states, navigation links, badges, gradients, or UI containers.
- Natural photographic green appearing inside supplied banner artwork, tea packaging packshots, tea leaves, and garden photos is preserved.

### Master 12-Color Palette
- Warm Ivory (`#FFF8EE`), Soft Warm Surface (`#F7EBDD`), Tea Gold (`#D9A441`), Bright Saffron (`#F4B400`), Light Pink (`#F7B6C8`), Coral (`#F26B5E`), Berry (`#C94C7C`), Violet (`#6C4AB6`), Indigo (`#4056A1`), Deep Plum (`#33243A`), Warm Charcoal (`#272329`), White (`#FFFFFF`).

### Product Reveal & In-Place Cart Experience
- **Wavy Hover Reveal**: Organic liquid transition with spring physics and soft light pink (`#F7B6C8`) Gen-Z glow.
- **Authentic Back Packaging**: Back packshot renders from verified `back` images in `src/data/products.ts`.
- **Mobile Tap Reveal**: Tapping card toggles front/back packshot on touch screens without blocking links/buttons.
- **In-Place Cart Controls**: Prominent Add to Cart button transitions immediately to an In Cart quantity stepper (`−` qty `+`) and a direct Remove button calling `removeLine(variantId)`.

### Best Sellers 50/50 Split Showcase
- Split composition: 50% large packaging visual with front/back toggle + 50% product details, pricing, variant selector, Add to Cart, and Remove controls.
- Interactive product switcher between 4 verified best sellers: Butterfly Pea Flower Tea, Hibiscus Flower Tea, Darjeeling Green Tea, and TMUG Gold Tea.
- Accompanied by a responsive product card rail.

### Open / Reveal Section Repositioning
- Moved into the middle of the homepage between Best Sellers and Why TMUG.
- Interactive 3D box unboxing, ritual switcher, non-blocking botanical flower petal shower, thank-you emoji badge feedback (`🍵`, `✨`, `🙏`), and direct add-to-cart action.

### Why TMUG Redesign
- Redesigned in warm ivory, gold, and coral tones with prominent authentic packaging packshots, botanical watermark, and zero green UI.


