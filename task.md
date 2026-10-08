# TMUG — Living Implementation Roadmap & Task Tracker

This file tracks project tasks, component audits, homepage iterations, quality assurance milestones, and deployment readiness.

---

## Phase 1 — Project Audit

- [x] Repository audit *(Verified Next.js 16.3.8, React 19.2.8, TypeScript 5, Tailwind v4)*
- [x] Component audit *(Audited all 38 components in `src/components`)*
- [x] Product data audit *(Verified 7 products, 11 variants, real prices in `src/data/products.ts`)*
- [x] Asset audit *(Verified 31 packshots in `/public/products`, 11 PNGs in `/public/hero`, 7 stickers)*
- [x] Route audit *(Verified storefront, collections, product slugs, legal routes, and sitemap)*
- [x] Cart audit *(Verified `ShopProvider`, `tmug-cart-v1` storage, coupon validation)*
- [x] Checkout audit *(Verified WhatsApp order compilation via `whatsappOrderLink`)*
- [x] WhatsApp audit *(Verified concierge link to `+91 81307 07344`)*

---

## Phase 2 — Homepage

- [x] Announcement (`AnnouncementBar` in `src/components/Header.tsx`)
- [x] Navigation (`Header` with mega-dropdown and mobile menu)
- [x] Hero (`Hero.tsx` 3D collector's box and tea stage)
- [x] Trust Strip (`TrustStrip.tsx` with 4-pillar botanical highlights)
- [x] Featured Products (`FeaturedProduct.tsx` spotlight)
- [x] Shop Collections (`ShopCollections.tsx` interactive slider)
- [x] Social Proof (`BrandProof.tsx` press and community proof)
- [x] Why TMUG (`WhyTmug.tsx` brand philosophy arc)
- [x] Made With Real Tea (`MadeWithRealTea.tsx` botanical transparency)
- [x] Tea Story (`TeaStory.tsx` morning-to-night ritual timeline)
- [x] Lifestyle Gallery (`LifestyleGallery.tsx` "Made for moments that linger")
- [x] Available Where You Shop (`AvailableInStores.tsx` Amazon & WhatsApp channels)
- [x] Reviews (`CustomerLove.tsx` genuine reviews)
- [x] Final CTA (`FinalCta.tsx` newsletter and shop prompt)
- [x] Footer (`Footer.tsx` legal links, FSSAI disclosure, contact details)

---

## Phase 3 — Homepage V2 Master Implementation

- [x] Asset Ingestion of 6 high-res campaign banners to `public/banners/`
- [x] Banner Configuration in `src/config/banners.ts` with verified destinations and CTAs
- [x] Zero Green UI sitewide migration across `@theme`, components, buttons, and backgrounds
- [x] Adoption of approved 12-color V2 palette (Warm Ivory, Soft Warm Surface, Tea Gold, Bright Saffron, Coral, Light Pink, Berry, Violet, Indigo, Deep Plum, Charcoal, White)
- [x] Storefront Hero Banner Slider (`Hero.tsx`) with crossfade, autoplay, swipe, keyboard arrows, `01 / 06` counter, and pause on interaction
- [x] Shop by Product horizontal slider (`ShopCollections.tsx`) with verified product pricing and unclipped packaging
- [x] ProductCard system (`ProductCard.tsx`):
  - [x] Organic wavy liquid hover motion with spring physics
  - [x] Soft light pink (`#F7B6C8`) & coral (`#F26B5E`) Gen-Z halo glow
  - [x] Authentic back packshot reveal from verified `back` images
  - [x] Mobile tap-to-flip toggle
  - [x] Direct Add to Cart + In Cart quantity stepper + Remove button calling `removeLine(variantId)`
- [x] Best Sellers Showcase (`BestSellers.tsx`):
  - [x] 50/50 split half-screen showcase (50% visual, 50% info/cart)
  - [x] Interactive switcher across 4 verified best sellers (`butterfly-pea`, `hibiscus`, `darjeeling-green`, `gold-tea`)
  - [x] Front/back packaging view toggle
  - [x] Responsive product card slider rail
- [x] Open / Reveal Section (`OpenRevealSection.tsx`):
  - [x] Repositioned to middle of homepage (Hero → Collections → Best Sellers → Open → Why TMUG)
  - [x] Interactive 3D box unboxing and tea ritual selector
  - [x] Tasteful non-blocking botanical petal shower (blue pea, hibiscus, chamomile, tea leaves)
  - [x] Immediate visual thank-you emoji badge feedback (`🍵`, `✨`, `🙏`)
  - [x] Direct Add to Cart action
- [x] Why TMUG Section (`WhyTmug.tsx`):
  - [x] Warm ivory, gold, and coral campaign composition
  - [x] Prominent authentic packaging packshot presentation
  - [x] Subtle botanical watermark and zero green UI
- [x] Navbar & Header (`Header.tsx`):
  - [x] Warm ivory/white glassmorphism background with charcoal typography and gold accents
  - [x] Zero green UI active/hover states
  - [x] Cart counter badge and mobile navigation drawer
- [x] Sitewide Green UI Removal across `TrustStrip`, `MadeWithRealTea`, `TeaStory`, `LifestyleGallery`, `BrandProof`, `CustomerLove`, `AvailableInStores`, `FinalCta`, and `Footer`

---

## QA & Validation

- [x] Mobile 360px (Tested, 0px horizontal overflow, fluid touch snap)
- [x] Mobile 375px (Tested, responsive banner scaling and tap reveals)
- [x] Mobile 390px (Tested, comfortable card sizing and cart controls)
- [x] Mobile 414px (Tested, responsive 50/50 stack layout)
- [x] Mobile 430px (Tested, perfect viewport boundary containment)
- [x] Desktop 1280px (Tested, 50/50 split showcase and multi-card slider)
- [x] Desktop 1440px (Tested, centered container max-w-7xl, clean spacing)
- [x] Desktop 1920px (Tested, high-definition banner rendering, no distortion)
- [x] Zero green active UI verified across all homepage sections
- [x] No horizontal overflow (`overflow-x: clip` on html/body)
- [x] Authentic product packaging completely visible (no cropped labels or seals)
- [x] No broken images (all 6 banners and 31 product packshots resolve)
- [x] No broken routes (all collection, product detail, and WhatsApp links functional)
- [x] No console errors or TypeScript compilation issues
- [x] Reduced motion support via `useReducedMotion()`

---

## Phase 4 — Master Homepage Visual Rebuild & Product System (Complete)

- [x] Adopt new 5-color reference palette: Cherry Blossom Pink (`#FAA4B5`), Fawn (`#F8B77C`), Maize (`#FFF183`), Sky Blue (`#70C1E1`), and Olivine (`#82BA88` as light supporting accent ONLY)
- [x] Strict Zero Dark Green UI Rule sitewide across navbar, buttons, primary CTAs, cards, borders, navigation controls, and section backgrounds
- [x] Removal of legacy water-wave keyframes, clip-paths, and wavy SVG overlays
- [x] Opener / TMUG Box full pop-up reveal modal (`OpenRevealSection.tsx`):
  - [x] Product occupies 45–65% viewport height on desktop and 45–60% on mobile without cropping
  - [x] Smooth Framer Motion pop-up reveal sequence (`0.82 → 1.0`, `translateY(24px) → 0`, `opacity: 0 → 1`, 550ms)
  - [x] Dynamic random selection across verified blends (`butterfly-pea`, `hibiscus`, `chamomile`, `lemongrass`, `gold-tea`, `darjeeling-green`) with shuffle button
  - [x] Verified prices, variant selector, working Add to Cart, in-cart quantity stepper, and close button
- [x] Collections Rail rebuild (`ShopCollections.tsx`):
  - [x] Full available width utilization from left edge to right edge (4–6 products visible on desktop, 1–2 on mobile)
  - [x] Navigation arrow controls positioned on left/right flanks outside product packaging
  - [x] Soft Gen-Z hover glow with 100% sharp transparent PNG cutouts
- [x] Best Sellers redesign (`BestSellers.tsx`):
  - [x] Compact, product-first 4-card D2C grid
  - [x] Verified transparent PNG cutouts, taste profiles, live INR prices, and in-cart steppers
  - [x] Zero water-wave animation
- [x] Admin Media Control Panel (`admin/page.tsx`, `admin/MediaUploadField.tsx`, `api/admin/upload`):
  - [x] Real native file picker button (`UPLOAD IMAGE`) saving directly to `public/uploads/`
  - [x] Slot requirement guidelines (Product Cutout: 1:1, 1200×1200 px, transparent PNG; Hero Banner: 3:1, 2172×724 px; Lifestyle: source ratio)
  - [x] Real-time image inspection modal showing preview, filename, dimensions, format, file size, transparency detection
  - [x] Action controls: Replace, Remove, Choose Another, Save & Use Image
  - [x] Multi-slot support for Front Cutout, Back/Alternate, Thumbnail, and Lifestyle assets
- [x] Next.js Turbopack build validated (`npm run build` exit code 0, 27 routes)
- [x] Visual QA verified via browser subagent across desktop and mobile views
- [x] Browser subagent tour completed with WebP video recording (`tmug_homepage_v2_tour`)
- [ ] Git commit (`"Redesign TMUG homepage with new assets and product experience"`)
- [ ] Git push to current configured branch

---

## Phase 4 — V2 Rebuild & Phase 2 Admin Control Panel

- [x] Full Asset Audit: Ingested and verified banners (`public/banners/`), recipes (`public/recipes/`), and daily rituals (`public/rituals/`)
- [x] Strict Zero Green UI enforcement across all UI components and styling
- [x] Palette tokens updated to Warm Ivory, Peach Cream, Coral Pink, Berry Pink, Blush Pink, Gold, Plum, and Charcoal
- [x] Compact spacing sitewide: Standardized vertical section padding to `py-8 sm:py-12`, reduced card gaps and rail margins
- [x] Water-wave product reveal: Organic CSS `clip-path: polygon(...)` animation with Blush Pink & Coral glow on card hover and mobile tap
- [x] In-place Cart Stepper (`−` qty `+`) and Remove button calling `removeLine(variantId)`
- [x] Compact 50/50 Best Sellers Showcase and Product rail
- [x] Interactive Open/Reveal section repositioned in mid-page sequence
- [x] New component `TeaRitualsAndRecipes.tsx` displaying community rituals and creative recipes
- [x] Phase 2 Admin Control Panel implemented:
  - [x] `/admin/login`: Secure password gate
  - [x] `/admin`: Tabbed dashboard for Hero Banners, Products & Prices, Collections, and Homepage Sections
  - [x] `/api/admin/auth`: Authentication and session endpoint
  - [x] `/api/admin/site-controls`: Data retrieval and persistence endpoint
  - [x] `src/config/site-controls.ts`: Default site controls
  - [x] `src/lib/site-control-store.ts`: JSON-backed persistence store


