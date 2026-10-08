# TMUG — Product Requirements Document

## Product
TMUG is a premium Indian D2C tea ecommerce experience focused on product discovery, storytelling and conversion. It blends the playful, vibrant energy of modern direct-to-consumer beverage branding with authentic Indian tea culture — from whole botanical flower teas (Butterfly Pea, Chamomile, Hibiscus) and fresh citrus herbals (Lemongrass) to high-grown single-origin Darjeeling Green tea and robust Assam CTC chai patti.

---

## Product Goals
- **Premium modern Indian tea positioning**: Elevate everyday tea rituals with an editorial aesthetic, playful typography, and rich visual textures.
- **Strong product discovery**: Enable customers to explore teas by category, aroma, taste profile, and brewing occasion with zero friction.
- **Strong ecommerce conversion**: Direct-to-consumer cart architecture, rapid WhatsApp concierge ordering, and transparent pricing.
- **Memorable homepage**: High-impact interactive hero, tactile botanical motifs, curated story sections, and playful sticker compositions.
- **Responsive experience**: Fluid performance and touch interactions across all mobile screens (360px–430px) and large desktop displays (1280px–1920px+).
- **Fast performance**: Static-first React Server Components, optimized WebP/JPG imagery, zero horizontal overflow, and minimal client-side overhead.
- **Preserve existing functionality**: Protect cart state, WhatsApp order generator, navigation tree, product routing, and SEO infrastructure.

---

## Homepage Requirements

The TMUG homepage follows a structured, conversion-driven narrative sequence:

1. **Announcement Bar** (`AnnouncementBar` in `Header.tsx`): Sitewide promotional ribbon featuring active discount code (`TMUG10` for 10% off) and free-delivery threshold alerts.
2. **Premium Navigation** (`Header.tsx`): Sticky blurred header with brand logo, dropdown collection links, quick search trigger, and cart drawer badge.
3. **Hero** (`Hero.tsx`): Interactive 3D collector's showcase featuring the TMUG tea box, steaming kulhad cup, floating botanical leaves, and immediate call to action.
4. **Trust Strip** (`TrustStrip.tsx`): Value-prop marquee highlighting 100% natural whole leaves, no artificial essences, fast dispatch, and direct sourcing.
5. **Featured Products**: Highlighted spotlight teas for first-time visitors seeking signature blends.
6. **Shop Our Collections** (`ShopCollections.tsx`): Interactive multi-tab horizontal product carousel (All Teas, Flower Teas, Chai, Green Tea, Herbal & Fresh, Bestsellers) with full packaging cards and variant selectors.
7. **Social Proof** (`BrandProof.tsx`): Community counters, media quotes, and customer enthusiasm without fabricated credentials.
8. **Why TMUG** (`WhyTmug.tsx`): Brand philosophy contrasting generic dusty CTC bags with whole-leaf, pesticide-free, small-batch tea.
9. **Made With Real Tea** (`MadeWithRealTea.tsx`): Transparent ingredient showcase detailing unadulterated botanicals (Aparajita, Babune ke phool, Gudhal, Nimbu ghas, Darjeeling whole leaf).
10. **Tea Story** (`TeaStory.tsx`): Daily ritual timeline (Morning Kadak Kickstart, Afternoon Violet Bloom, Evening Himalayan Reset, Nighttime Chamomile Drift).
11. **Lifestyle / Collaboration Gallery** (`LifestyleGallery.tsx`): Editorial poster section (*"Made for moments that linger."*) using playful typography, organic stickers, and decorative SVG motifs instead of oversized photos.
12. **Available Where You Shop** (`AvailableInStores.tsx`): Verified retail links — direct brand store, WhatsApp Concierge, and the confirmed Amazon Brand Store.
13. **Reviews** (`CustomerLove.tsx`): Genuine customer feedback and tea lover testimonials.
14. **Final CTA** (`FinalCta.tsx`): High-converting closing invitation with newsletter perks and instant shop navigation.
15. **Footer** (`Footer.tsx`): Complete legal navigation, FSSAI compliance notice, contact information, social links, and copyright statement.

---

## Critical UX Requirements

- **Product packaging must never be cropped**: Real TMUG pouch and jar packshots must display their complete silhouette, label, weight indication, and FSSAI seal without being clipped by cards or overflow masks.
- **Shop Our Collections must be a real slider/carousel**: Smooth horizontal scrolling with desktop arrow controls, touch swipe on mobile, and boundary scroll indicators (`canScrollLeft` / `canScrollRight`).
- **Category tabs must work**: Instant filtering across *All Teas*, *Flower Teas*, *Chai*, *Green Tea*, *Herbal & Fresh*, and *Bestsellers* with scroll reset.
- **Mobile must support swipe**: Natural drag/swipe gestures with CSS snap scrolling and hidden default scrollbars for an app-like experience.
- **No horizontal overflow**: Strict `overflow-x: clip` on the body and containment on all absolute/floating animated elements to eliminate side-scrolling on 360px+ screens.
- **Existing cart must continue working**: `ShopProvider` local storage hydration (`tmug-cart-v1`), fly-to-cart animation, line item quantity manipulation, and coupon discount calculation.
- **Existing checkout must continue working**: Seamless transfer of cart line items into WhatsApp order links (`whatsappOrderLink`) pre-filled with items, quantities, and coupon totals.
- **Existing navigation must continue working**: Mobile drawer menu, desktop collection mega-dropdown, and anchor jumps to `#shop`, `#collections`, `#why`, and `#about`.
- **Existing WhatsApp integration must continue working**: Global floating button and contextual product order links mapped to `+91 81307 07344`.

---

## Content Integrity

All site copy, metadata, and marketing materials adhere to strict truth-in-advertising guidelines. **Never fabricate**:

- **Prices or MRP**: Only publish verified retail prices from `src/data/products.ts`. Never display artificial struck-through MRPs or fake discounts.
- **Discounts**: Only promote authorized promotional campaigns configured in `siteConfig.promo` (e.g. `TMUG10`).
- **Reviews**: Only feature actual customer comments; do not invent fictional buyers or false 5-star ratings.
- **Press coverage**: Do not display logos or citations from news outlets or publications unless formally featured.
- **Certifications & Awards**: Only state verified regulatory compliances (such as FSSAI registration); do not generate false organic or international awards.
- **Health claims**: Avoid unverified medicinal or curative assertions; focus strictly on natural ingredients, caffeine-free wellness, and authentic flavor profiles.
- **Ingredient claims**: State only 100% verified ingredients documented on official TMUG packaging.
- **Customer numbers & sales numbers**: Avoid made-up metrics like "100,000+ happy sippers" unless backed by authentic sales data.
- **Marketplace availability**: Do not claim availability on quick-commerce apps (Blinkit, Zepto, Swiggy Instamart) until brand integration is live and verified.

---

## Confirmed Amazon Store

The official TMUG Amazon Brand Store URL is:

```
https://www.amazon.in/stores/Tmug/page/4EF8CF60-EB4F-4438-B735-748BE0ED8162?lp_asin=B0H25XRHC5&ref_=ast_bln
```

- This URL must be used consistently in `siteConfig.amazonStore` and all marketplace call-to-actions.
- **Do NOT invent other marketplace URLs** or link to third-party resellers.

---

## Acceptance Criteria

The TMUG website homepage and documentation are accepted only when:

1. **Existing functionality works**: Cart drawer opens, adds items, updates quantities, deletes items, calculates totals, and applies promo codes without runtime exceptions.
2. **Product images are accurate**: Every card, carousel item, and quick-view modal loads authentic TMUG assets from `/public/products/` and `/public/hero/`.
3. **Products are fully visible**: No pouch tops, jar bases, or net-weight labels are clipped by card boundaries or responsive containers.
4. **Collection slider works**: Horizontal scroll arrows, touch-swipe navigation, and category filtering transition smoothly.
5. **Category filtering works**: Selecting any tab immediately filters the visible catalog and resets scroll position to index 0.
6. **Mobile works**: Flawless visual display and interaction on 360px, 375px, 390px, 414px, and 430px viewports.
7. **Desktop works**: Balanced layout, centered containers, and smooth hover interactions on 1280px, 1440px, and 1920px viewports.
8. **CTAs work**: All WhatsApp direct ordering, Amazon store links, and collection navigation buttons route to their designated destinations.
9. **No broken links**: All anchor links (`#shop`, `#collections`, `#why`, `#about`) and sub-routes (`/products/*`, `/collections`, `/contact`, `/faq`, `/privacy`, `/terms`) resolve cleanly.
10. **No horizontal overflow**: 0px horizontal scroll on any mobile viewport.
11. **No fake data**: All displayed prices, ingredients, and store references match official TMUG business records.
