# TMUG — Sticker System & Visual Accents Specification

This document defines the sticker design guidelines, approved vector sources, search taxonomy, directory architecture, and active graphic elements for the TMUG digital storefront.

---

## 1. Aesthetic Direction & Guidelines

The TMUG sticker system adds editorial tactility, warmth, and brand charm. Stickers evoke physical washi tape, stamps, and hand-drawn doodles without feeling messy or juvenile.

### Core Style Attributes
- **PLAYFUL**: Brings delight, warmth, and conversational energy to product discovery.
- **PREMIUM**: Refined line weights, harmonious brand color palettes, and deliberate placement.
- **MODERN**: Minimalist vector geometry with high rendering fidelity.
- **TEA-FOCUSED**: Celebrating botanical leaves, blossoms, kulhad cups, and boiling kettles.
- **EDITORIAL**: Designed to feel like high-end art-directed magazine collages.
- **SLIGHTLY HAND-DRAWN**: Organic outlines, subtle imperfect contours, and stamped edges.

### Strict Prohibitions
- **NO cheap clipart**: Avoid generic office or 90s web clipart.
- **NO watermarks**: Never utilize unlicensed or preview vectors.
- **NO random emoji spam**: System emojis (🍃, ✨) must only be used in measured, styled badges.
- **NO childish cartoon graphics**: Avoid oversized cartoon eyes or hyper-juvenile mascots.
- **NO inconsistent styles**: Maintain unified line-weights (1.5px–2px stroke) and brand color fills.

---

## 2. Approved Source Repositories

When sourcing or expanding SVG assets, use the following approved platforms and verify that the individual asset license permits commercial usage:

| Platform | URL | License Check |
| :--- | :--- | :--- |
| **Open Stickers** | [https://openstickers.craftwork.design/](https://openstickers.craftwork.design/) | Free for commercial & personal projects |
| **SVG Repo** | [https://www.svgrepo.com/collections/sticker/](https://www.svgrepo.com/collections/sticker/) | Check individual CC0 / MIT licenses |
| **Flaticon Stickers** | [https://www.flaticon.com/stickers](https://www.flaticon.com/stickers) | Verify license attribute requirements |
| **oof.tools** | [https://oof.tools/stickers](https://oof.tools/stickers) | Open creative asset collection |
| **LottieFiles** | [https://lottiefiles.com/free-animations/stickers](https://lottiefiles.com/free-animations/stickers) | Verify free community license for JSON/Lottie |
| **ClipartDay** | [https://clipartday.com/](https://clipartday.com/) | Verify vector license terms |

---

## 3. Recommended Search Taxonomy

Use these precise search keywords when expanding the asset collection:

### Tea & Botanical
- `tea leaf sticker`
- `tea leaves doodle`
- `tea cup illustration`
- `tea mug sticker`
- `botanical doodle`
- `flower doodle`
- `leaf doodle`

### Ingredients & Infusions
- `lemon sticker`
- `orange sticker`
- `peach sticker`
- `mint leaf`
- `ginger illustration`
- `cinnamon illustration`
- `rose flower`
- `hibiscus`
- `chamomile`

### Decorative Accents
- `sparkle doodle`
- `star doodle`
- `hand drawn star`
- `flower doodle`
- `heart doodle`
- `hand drawn arrow`
- `swirl doodle`
- `burst sticker`
- `scribble`
- `wavy line`
- `organic blob`
- `hand drawn circle`

### Badges & Stamps
- `limited edition badge`
- `new sticker`
- `bestseller badge`
- `hand drawn badge`
- `starburst badge`

---

## 4. Directory & Asset Architecture

All stickers reside within the public asset tree:

```
public/assets/stickers/
├── tea/             # Tea leaves, teacups, kulhads, pots
├── ingredients/     # Chamomile blooms, aparajita petals, lemon slices, ginger
├── decorative/      # Sparkles, stars, hand-drawn arrows, swirls, wavy lines
├── badges/          # Circular stamps, washi ribbons, quality seals
└── animated/        # Lottie / SVG looped animations
```

### Active SVG Assets in Repository
Currently active in `/public/assets/stickers/`:
- `tea-leaf.svg` — Hand-drawn organic green botanical leaf
- `flower-doodle.svg` — Stylized blossom flower accent
- `tea-cup.svg` — Steaming Indian kulhad cup silhouette
- `sparkle.svg` — Four-point gold editorial sparkle
- `arrow-doodle.svg` — Playful directional hand-drawn arrow
- `badge-kadak.svg` — Circular Kadak Chai guarantee seal
- `badge-natural.svg` — 100% Natural Whole-Leaf badge

---

## 5. Approved Sticker Copy & Micro-Typography

When embedding text inside sticker pills, washi tape ribbons, or stamp badges:

- `"Tea Time"`
- `"Steep Happy"`
- `"Chai O'Clock"`
- `"Take a Sip"`
- `"Steep. Sip. Repeat."`
- `"Pour Something Good"`
- `"TMUG Moments"`
- `"100% Whole Flowers"`
- `"Properly Kadak"`
- `"Zero Artificial Flavors"`

---

## 6. Implementation & Hover Physics

In components like `LifestyleGallery.tsx` and `Hero.tsx`, stickers use Framer Motion for tactile hover interactions:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
  whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
  viewport={{ once: true }}
  whileHover={{ scale: 1.12, rotate: 2, y: -4 }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  className="cursor-pointer select-none"
>
  {/* Sticker SVG or Washi Container */}
</motion.div>
```

Stickers must never overlap critical product packshots, price tags, or conversion buttons.

---

## 7. Botanical Flower Petal Shower & Floral Watermark System (Homepage V2)

### Product-Specific Botanical Petal Shower (`OpenRevealSection.tsx`)
When a user selects or unboxes a tea ritual in the Open / Reveal section, a celebratory botanical shower triggers using lightweight vector petals:

- **Blue Pea Petal (`blue-pea`)**: Sculpted Clitoria ternatea flower petal rendered in royal indigo/violet (`fill-[#4056A1]`, `opacity-80`).
- **Hibiscus Petal (`hibiscus`)**: Flared Hibiscus sabdariffa petal rendered in deep ruby/berry (`fill-[#C94C7C]`).
- **Chamomile Petal (`chamomile`)**: Delicate Matricaria chamomilla ray floret in soft warm ivory with a golden center (`fill-[#FFF8EE]` with amber accent).
- **Golden Tea Leaf (`tea-leaf`)**: Single-origin Assam/Darjeeling tea leaf silhouette rendered in warm tea-gold (`fill-[#D9A441]`).

### Animation & Accessibility Guidelines
- **Duration**: Brief (1.8s–2.5s) organic drift using `keyframes petal-fall`.
- **Non-Blocking**: Floated in an absolute container with `pointer-events: none` and `z-20` so no CTA buttons or navigation links are obstructed.
- **Micro-Celebration Pill**: Accompanying floating badge displays immediate celebratory feedback (`🍵 Order Ready`, `✨ Added to Cart`, `🙏 Dhanyawad!`).
- **Reduced Motion**: When `prefers-reduced-motion` is active, particle drifting is completely disabled; only static status feedback is displayed.

### Background Floral Watermarks (`WhyTmug.tsx`)
- Subtle high-resolution botanical vector outlines placed as ambient watermarks in section backgrounds.
- Rendered in delicate translucent gold tones (`text-tea-gold/10`) to provide texture without cluttering product packshots.
