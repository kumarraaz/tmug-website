# TMUG — Deployment & Release Workflow

This document details the exact deployment lifecycle, build scripts, version control practices, production testing protocols, and security guidelines for the TMUG storefront.

---

## 1. Local Development

Commands as configured in `package.json`:

```bash
# Start local development server with Turbopack / Next dev
npm run dev

# Starts on http://localhost:3000
```

Environment variables are defined in `.env.example`:
- `NEXT_PUBLIC_SITE_URL`: Base canonical URL (defaults to `https://tmug.in` in production).
- `ADMIN_EMAIL`: TMUG Admin login email (server-side secret, e.g., configured in `.env.local` / Vercel).
- `ADMIN_PASSWORD`: TMUG Admin login password (server-side secret, e.g., configured in `.env.local` / Vercel).

---

## 2. Production Build & Validation

The build pipeline enforces static compilation and strict type-checking across all App Router routes:

```bash
# Run linting check
npm run lint

# Compile production build
npm run build

# Start local production server to test compiled build
npm run start
```

### Build Verification Checklist
- Next.js builds cleanly with zero compile errors.
- TypeScript reports 0 type errors (`tsconfig.json`).
- Tailwind CSS v4 compiles design tokens via `@tailwindcss/postcss`.
- Static routes (`/about`, `/contact`, `/faq`, `/terms`, `/privacy`) and dynamic product pages (`/products/[slug]`) generate without hydration mismatches.

---

## 3. Git Version Control Workflow

### Verified Git Configuration
- **Active Branch**: `main`
- **Remote Name**: `origin`
- **Remote URL**: `https://github.com/kumarraaz/tmug-website.git`

### Standard Git Release Procedure
```bash
# 1. Verify working directory status
git status

# 2. Stage changes
git add .

# 3. Commit with approved semantic message
git commit -m "Redesign TMUG homepage with banners, product sliders and interactive reveals"

# 4. Push directly to current configured branch
git push origin <branch>
```

> [!WARNING]
> Always verify the active branch with `git branch --show-current` prior to pushing. Never push directly to unverified remote targets.

---

## 4. Vercel Continuous Deployment

The repository is linked to Vercel for automated zero-downtime deployments:

```mermaid
graph LR
    A[Local Code / Fixes] --> B[git commit]
    B --> C[git push origin main]
    D[GitHub Repository: kumarraaz/tmug-website]
    C --> D
    D --> E[Vercel Automated Build]
    E --> F[Global Edge CDN Deployment]
```

1. **Trigger**: Pushes to `main` automatically initiate a Vercel production deployment.
2. **Framework Detection**: Vercel detects Next.js automatically and executes `npm run build`.
3. **Environment Injection**: Set production environment variables in Vercel Project Settings > Environment Variables:
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://tmug.in`)
   - `ADMIN_EMAIL` (server-side secret for `/admin/login`)
   - `ADMIN_PASSWORD` (server-side secret for `/admin/login`)
4. **Instant Invalidation**: Static pages and Edge cached assets refresh across the global Vercel Edge network.

---

## 5. Production QA Protocol (Master Homepage Rebuild)

Before accepting any production deployment, execute the following audit checklist:

- [ ] **Vibrant 5-Color Palette**: Cherry Blossom Pink (`#FAA4B5`), Fawn (`#F8B77C`), Maize (`#FFF183`), Sky Blue (`#70C1E1`), and Olivine (`#82BA88` as light supporting accent ONLY) active sitewide.
- [ ] **Strict Zero Dark Green UI**: Verify that dark green is NOT used as an active UI color on navbar, buttons, primary CTAs, cards, borders, navigation controls, or main section backgrounds.
- [ ] **No Water-Wave Animation**: Verify all wave animations, liquid wave paths, and wavy overlays are removed.
- [ ] **Pop-Up Opener Reveal**: "OPEN TMUG BOX" modal opens smoothly; product occupies 45–65% vh on desktop and 45–60% on mobile without cropping; dynamic random selection works; working Add to Cart and close button.
- [ ] **Full-Width Collections Rail**: Product rail spans from left edge across the screen (4–6 items visible on desktop); navigation arrows live on outer flanks outside product visual area.
- [ ] **Compact Best Sellers Grid**: Sleek 4-product D2C card deck with transparent cutouts, live INR pricing, and in-cart steppers.
- [ ] **Admin Real Media File Upload**: Native file picker button (`UPLOAD IMAGE`), slot requirements boxes, dimensions inspection modal, and `/api/admin/upload` functional.
- [ ] **Packaging Visibility**: Zero cropped product silhouettes, zero pixelation, zero unwanted rectangular bounding boxes.
- [ ] **Cart & Order Flow**: Line item updates, promo codes, direct Add to Cart, quantity steppers, and WhatsApp checkout functional.
- [ ] **Mobile Responsiveness**: 0px horizontal scroll on 360px–430px devices.
- [ ] **Back-Side Packaging Reveal**: Alternate/back packshot renders cleanly from authentic `back` image assets.
- [ ] **Mobile Tap Flip**: Tapping a product card flips between front and back packaging views without blocking Add to Cart or links.
- [ ] **In-Place Cart & Remove Controls**: Add to Cart immediately shows In Cart state, quantity stepper, and a working Remove button calling `removeLine(variantId)`.
- [ ] **Best Sellers 50/50 Showcase**: 50% packaging visual with front/back toggle + 50% product details, pricing, Add to Cart, and Remove controls.
- [ ] **Open / Reveal Section**: Mid-page position, interactive unboxing, non-blocking flower petal shower, thank-you emoji badge feedback.
- [ ] **Why TMUG Section**: Warm ivory/gold/coral palette, prominent packshot, botanical watermark, zero green UI.
- [ ] **Cart Flow**: Cart opens, increments/decrements quantity, calculates subtotals, and persists across browser refreshes via `tmug-cart-v1`.
- [ ] **Promo Codes**: Coupon `TMUG10` applies 10% discount in cart and updates final payable sum.
- [ ] **Checkout via WhatsApp**: "Order on WhatsApp" correctly launches WhatsApp with pre-filled multi-line order details to `+91 81307 07344`.
- [ ] **Navigation & Menus**: Sticky header in warm ivory/white with charcoal typography, dropdowns, and mobile navigation drawer.
- [ ] **Amazon CTA**: Official store link correctly navigates to the verified Amazon Brand Store page.
- [ ] **Mobile Responsiveness**: Complete visual audit across 360px, 375px, 390px, 414px, and 430px screens with zero horizontal overflow.
- [ ] **Desktop Layout**: Balanced presentation and centered grid alignment across 1280px, 1440px, and 1920px viewports.
- [ ] **Console Errors**: Browser DevTools console must remain free of JavaScript exceptions, 404 image errors, or hydration warnings.
- [ ] **No Broken Images**: Every product image in `/public/products/`, `/public/banners/`, and `/public/hero/` loads with 200 HTTP status.
- [ ] **No Broken Links**: All internal anchors (`#shop`, `#collections`, `#why`, `#about`) and legal routes resolve properly.


---

## 6. Security & Credential Hygiene

- **Zero Secret Commits**: Never commit `.env.local`, `.env`, API tokens, private SSH keys, or administrative passwords. `.env*` remains ignored by Git.
- **Environment-Variable Admin Authentication**: Server-side admin authentication (`/api/admin/auth`) is strictly governed by `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Neither credential is ever exposed to client bundles or React components.
- **Client-Side Safety**: Ensure only variables prefixed with `NEXT_PUBLIC_` are referenced in client components. Never prefix admin auth variables with `NEXT_PUBLIC_`.
- **Session Security**: Session authentication relies on an HTTP-only, SameSite=lax cookie (`tmug-admin`).
- **Dependencies**: Periodically run `npm audit` to identify and patch vulnerable packages.

---

## 7. Phase 2 Admin Control Panel QA

- [x] `/admin/login` renders branded login interface with Admin Email and Password fields.
- [x] Correct credentials (configured via server environment variables) successfully authenticate and issue session cookie.
- [x] Invalid password or missing credentials return 401 Unauthorized with user-friendly error message.
- [x] Protected routes (`/admin`, `/api/admin/site-controls`, `/api/admin/upload`) enforce authenticated session.
- [x] Logout terminates session and redirects back to `/admin/login`.
- [x] Session persists seamlessly across navigation.
- [x] `/admin` displays all 4 tabs: Hero Banners, Products & Prices, Collections, Homepage Sections.
- [x] Modifying product prices, banner titles, or section visibility updates the live state.
- [x] Reset to Defaults restores default system state with confirmation.

