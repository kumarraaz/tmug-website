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

## Current Required Changes

- [x] Remove "Meet Your New Favourite Tea"
- [x] Remove "The Artisan Lineup"
- [x] Remove empty space after removal
- [x] Convert Shop Our Collections into real slider
- [x] Make category tabs functional
- [x] Ensure complete product visibility
- [x] Remove oversized images from "Made for moments that linger"
- [x] Remove giant TMUG logo from that section
- [x] Replace large images with sticker/text composition

---

## QA

- [ ] Mobile 360px
- [ ] Mobile 375px
- [ ] Mobile 390px
- [ ] Mobile 414px
- [ ] Mobile 430px
- [ ] Desktop 1280px
- [ ] Desktop 1440px
- [ ] Desktop 1920px
- [ ] No horizontal overflow
- [ ] No clipped products
- [ ] No broken images
- [ ] No broken links
- [ ] No console errors
- [ ] Reduced motion support
- [ ] Regression test

---

## Deployment

- [ ] Production build (`npm run build`)
- [x] Git commit (`Add TMUG project documentation`)
- [ ] GitHub push (`git push origin main`)
- [ ] Vercel deployment
- [ ] Production QA
