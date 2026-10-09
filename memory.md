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

## 10. Complete Homepage Visual Rebuild & Product System (Current Truth)

### Master 5-Color Reference Palette
- **Cherry Blossom Pink**: `#FAA4B5` (Primary vibrant Gen-Z accent, playful CTAs, badge accents, hover glows)
- **Fawn**: `#F8B77C` (Warm supporting tone, tea highlights, border glows)
- **Maize**: `#FFF183` (Radiant light gold, bestseller chips, active pills, selection highlights)
- **Sky Blue**: `#70C1E1` (Aparajita blue accents, cool botanical contrast, ambient aura)
- **Olivine**: `#82BA88` (**Light supporting accent ONLY**; subtle botanical badges)
- **Deep Plum**: `#33243A` (Primary typography, high-contrast badges, dark accents)
- **Warm Charcoal**: `#3A3438` (Secondary text, dark buttons, navigation links)
- **Warm Ivory / Cream**: `#FFF7EF` / `#FBE7DC` (Primary and secondary canvas)

### Strict Zero Dark Green UI Rule
- Dark green is STRICTLY FORBIDDEN as a homepage UI color.
- No dark green navbar, buttons, primary CTAs, main section backgrounds, product cards, borders, or navigation controls.
- Olivine `#82BA88` is a light supporting accent only.
- Authentic natural green appearing in authentic tea packshots, packaging artwork, botanical photographs, and leaves is preserved and must not be altered.

### Water-Wave Animation Removed
- All legacy water-wave keyframes (`@keyframes tmugWave`), clip-path liquid waves, wavy pink overlays, animated water surfaces, and white reveal shapes have been permanently removed.
- Replaced by clean, smooth Gen-Z micro-interactions: subtle card lift, subtle image scaling (`1.05`), soft colored aura behind products, and 100% sharp packshots.

### Pop-Up Product Reveal ("Open Your TMUG Box")
- Opener modal pops forward dramatically: background dims while keeping existing page visible behind.
- Product occupies **45–65% of viewport height** on desktop, **45–60%** on mobile without cropping (`object-fit: contain`).
- Clean Framer Motion sequence: scale `0.82 → 1.0`, `translateY(24px) → translateY(0)`, opacity `0 → 1` over ~550ms.
- Random dynamic product selection from eligible verified products (`butterfly-pea`, `hibiscus`, `chamomile`, `lemongrass`, `gold-tea`, `darjeeling-green`) with a "Surprise Blend" shuffle button and selectable tea chips.
- Verified product details, live price and compare-at MRP, variant toggle (Jar/Pouch), working Add to Cart, active in-cart quantity stepper, and close button.

### Collections Rail & Flank Controls
- Full available width utilization from left edge across the screen (displays 4–6 products on desktop, 1–2 on mobile).
- Navigation arrow controls are placed on the **outside flanks** of the carousel track, never overlapping or covering product packaging.
- Subtle Gen-Z hover glow with transparent PNG cutouts that remain 100% sharp.

### Best Sellers Redesign
- Sleek, compact D2C 4-card grid featuring verified transparent PNG cutouts, tasting profile tags, variant selectors, live INR prices, and in-cart quantity steppers.
- Zero water-wave animation.

### Admin Real File Upload & Media Control Panel
- Native system file upload via `/api/admin/upload` saving directly to `/public/uploads/`.
- Slot-specific requirement boxes:
  - Product Cutout: 1:1, Recommended 1200 × 1200 px or higher, PNG with transparency preferred.
  - Hero Banner: 3:1, Recommended 2172 × 724 px, PNG / WEBP / JPG.
  - Lifestyle / Creative: Source aspect ratio (4:5 / 16:9), 1200 × 1500 px.
- Real-time image inspection modal showing preview, filename, dimensions (`width × height px`), format, file size (`KB`), and transparency status ("Transparent PNG Cutout ✓" or "Opaque Background").
- Action controls: Replace, Remove, Choose Another, Save & Use Image.
- Multi-slot support for Front Cutout, Back/Alternate, Thumbnail, and Lifestyle assets.

### Admin Authentication & Security Architecture
- **Environment-Variable Based**: Admin authentication at `/admin/login` and `/api/admin/auth` is strictly driven by server environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- **Zero Hardcoded Secrets**: Plaintext passwords or emails are NEVER hardcoded into client JavaScript bundles, React components, or committed to Git.
- **Local & Production Configuration**: Configured locally via `.env.local` (kept git-ignored by `.gitignore`) and in production via Vercel Project Environment Variables.
- **Session Protection**: Server issues an HTTP-only, SameSite=lax cookie (`tmug-admin`) with 12-hour expiration, safeguarding `/admin`, `/admin/seo`, `/api/admin/site-controls`, and `/api/admin/upload`.

---

## 11. Website Visual Control Center (Milestone Completion)

- **Comprehensive Visual Authority**: Operators have full visual and layout control over all 14 homepage sections and reusable UI components through `/admin` without manual code edits.
- **Typed Schema & Defaults**: `src/types/site-controls.ts` and `src/config/site-controls.ts` provide strict typing and canonical fallback values adhering to TMUG brand identity and zero dark green UI rules.
- **Dual-State Persistence Layer**: `src/lib/site-control-store.ts` enforces draft vs. published isolation. Draft changes are stored in `data/site-controls.json` and previewed privately. "Publish All" pushes changes atomically to public shoppers and records an immutable snapshot in `state.history` (retains last 10 snapshots).
- **One-Click Rollback**: Any historical snapshot can be restored with a single click, instantly reinstating prior published settings.
- **Real-Time Cross-Window Sync**: HTML5 `postMessage` protocol syncs live edits between admin form fields and the live preview iframe without page reload or network delay.
- **Dynamic Theme & Typography**: `DynamicThemeProvider.tsx` injects dynamic `:root` CSS custom properties (`--brand-cream`, `--brand-terracotta`, `--brand-gold`, font sizes, radii, shadows) and dynamically loads Google Fonts on demand.
- **Preserved Core Mechanics**: Authentic product catalog (`data/products.ts`), `ShopProvider` cart state, WhatsApp order generator, and SEO metadata remain 100% operational and non-destructively protected.
- **Automated Validation**: End-to-end automated verification script (`scripts/verify-control-center.mjs`) validates login, draft isolation, publishing, rollback, and reset.




