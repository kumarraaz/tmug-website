# TMUG — Design System & Visual Guidelines

This document establishes the official visual language, color tokens, typographic scales, motion principles, and product styling for the TMUG digital storefront.

---

## 1. Brand Personality

TMUG merges contemporary beverage culture with timeless Indian tea traditions. The design identity embodies eight core attributes:

- **PREMIUM**: Deliberate negative space, rich botanical greens, gold leaf accents, and high-fidelity photography.
- **PLAYFUL**: Tactile washi tape stickers, conversational microcopy, organic doodles, and interactive motion.
- **MODERN**: Ultra-clean layouts, fluid responsive typography, and mobile-first gestures.
- **INDIAN**: Proudly celebrating kadak chai, kulhad rituals, aparajita flowers, Darjeeling estates, and Assam single origins.
- **EDITORIAL**: Curated magazine-style typography, high-contrast headings, and deliberate content rhythms.
- **WARM**: Warm cream backgrounds (`#FFF8EA`) replacing harsh sterile whites; approachable and inviting.
- **PRODUCT-LED**: Full-pack visibility, vibrant infusions, and honest botanical ingredient transparency.
- **SOPHISTICATED**: Balanced hierarchy without cluttered badges, aggressive countdown timers, or intrusive banners.

---

## 2. Visual References

- **Primary Reference**: [Drink OLIPOP](https://drinkolipop.com/) — *Inspiration for playful typography, vibrant color harmony, and sticker-led product storytelling.*
- **Secondary Reference**: [Wildwonder](https://drinkwildwonder.com/) — *Inspiration for organic ingredient narratives, subtle motion, and warm pastel undertones.*

> [!IMPORTANT]
> These brands serve strictly as high-level aesthetic inspirations. Never copy their trade dress, logos, exact text, proprietary graphics, or brand illustrations.

---

## 3. Color System

All colors are defined in `@theme` inside `src/app/globals.css`. Do not invent unapproved color values.

### Core Brand Palette
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `--color-tea-green` | `#176B4D` | Primary brand green, key buttons, links, accents |
| `--color-tea-deep` | `#0E513B` | Deep botanical green for prominent headers and borders |
| `--color-tea-dark` | `#0B3D2E` | Deepest foliage shade; high-contrast text and dark cards |
| `--color-tea-ink` | `#082A20` | Ultra-dark green used as replacement for jet black |
| `--color-gold` | `#D8A62A` | Premium gold accent, ratings, highlight rings, Assam Gold tea |
| `--color-gold-soft` | `#EFC65E` | Secondary soft gold for background tints and glow rings |
| `--color-cream` | `#FFF8EA` | Primary page background; warm, tactile, paper-like |
| `--color-cream-light` | `#FFFDF7` | Card surfaces, modal backgrounds, input fields |
| `--color-cream-dark` | `#F3E8CF` | Section dividers, borders, subtle card containers |
| `--color-ink` | `#172018` | Primary body text and editorial headings |
| `--color-ink-soft` | `#4A5548` | Secondary copy, descriptions, captions, inactive tabs |

### Per-Tea Accent Colors
Used selectively for product cards, badges, and background glows:
| Token | Hex Value | Soft Hex | Tea Assignment |
| :--- | :--- | :--- | :--- |
| `--color-pea` | `#4A6FD4` | `#DBE4FF` | Butterfly Pea Flower Tea (Blue Tea) |
| `--color-blossom` | `#D84F6D` | `#FFDDE6` | Hibiscus Flower Tea (Ruby Red) |
| `--color-limepop` | `#8FC93A` | `#E9F6D2` | Lemongrass Tea (Citrus Herbal) |
| `--color-honey` | `#E8A93D` | `#FFEFD2` | Chamomile Flower Tea (Golden Calm) |
| `--color-darjeeling`| `#2E7D4F` | `#DDF0E2` | Darjeeling Green Tea (Misty Mountain) |

---

## 4. Typography

### Font Families
Configured via `next/font/google` in `src/app/layout.tsx`:
- **Display Font**: `Bricolage Grotesque` (`--font-display`) — Expressive, editorial, variable weights (400–800).
- **Body Font**: `DM Sans` (`--font-sans`) — Crisp, geometric, readable across all screen sizes.

### Typographic Hierarchy & Scale
| Class | CSS Definition | Intended Use |
| :--- | :--- | :--- |
| `.text-hero-xl` | `clamp(2.625rem, 9vw, 4.5rem); line-height: 0.96; letter-spacing: -0.025em;` | Primary hero display headlines |
| `.text-hero` | `clamp(2.625rem, 7vw, 4.5rem); line-height: 0.98; letter-spacing: -0.02em;` | Secondary hero titles |
| `.text-section` | `clamp(1.875rem, 4vw, 3rem); line-height: 1.04; letter-spacing: -0.015em;` | Major section titles (Why TMUG, Tea Story) |
| `.text-card-title`| `clamp(1.125rem, 2vw, 1.375rem); line-height: 1.15;` | Product titles & story card titles |
| `.text-outline` | `-webkit-text-stroke: 1.5px currentColor; -webkit-text-fill-color: transparent;` | Stylized outlined display accents |

### Button Styling
- Shape: Fully rounded pill shape (`rounded-full`).
- Padding: `px-6 py-3.5` on desktop, `px-5 py-3` on mobile.
- Typography: Bold font weight (`font-bold` or `font-extrabold`), tracking-wide.
- Interactive Feedback: `active:scale-95` tap response, smooth hover elevation.
- Primary CTA Colors: TMUG Green (`bg-tea-green text-cream`), WhatsApp (`bg-[#25D366] text-white`), Outline (`border-2 border-ink/15 text-ink`).

---

## 5. Product Presentation Guidelines

- **Image Treatment**: Clear natural lighting, authentic product packaging. High-definition packshots on cream backgrounds or transparent PNG cutouts for layered compositions.
- **Object-Fit Behavior**: Strictly `object-contain`. Packaging silhouettes, brand labels, weight indications, and FSSAI stamps must **NEVER** be cropped or masked by parent card containers.
- **Product Card Style**:
  - Warm cream container (`bg-[#FFFDF7]` or `bg-white`) with fine border (`border border-ink/10`).
  - Subtle drop shadow (`shadow-sm hover:shadow-md transition-shadow`).
  - Dedicated packshot frame with generous padding (`p-4` or `p-6`).
  - Interactive variant selector chips (e.g., `50g Jar` vs `100g Pouch`) with instant price recalculation.
- **Badges & Overlays**:
  - Soft rounded washi-tape style pills (`rounded-full px-2.5 py-0.5 text-xs font-bold`).
  - Authentic badges: `"100% Herbal"`, `"Caffeine-Free"`, `"Single Origin"`, `"Kadak Blend"`.
- **Pricing Presentation**:
  - Clear Indian Rupee symbol (`₹`).
  - Real selling prices (e.g. `₹99`, `₹149`, `₹299`) formatted cleanly via `formatINR`.
  - **No fabricated strike-through MRP or artificial percentage discount flags**.

---

## 6. Sticker System

The sticker system adds tactile warmth and editorial charm without cluttering the shopping interface.

### Sticker Elements
- **Botanical**: Hand-drawn tea leaves, chamomile blossoms, butterfly pea petals, hibiscus flowers, lemon wedges.
- **Decorative**: Sparkles, hand-drawn stars, arrows, organic wavy curves, washi tape strips, circular rubber stamps.
- **Badges**: `"100% Natural"`, `"Kadak Guarantee"`, `"Direct Sourced"`, `"Hand-Plucked"`.

### Approved Sticker Copy
- `"Tea Time"`
- `"Steep Happy"`
- `"Chai O'Clock"`
- `"Take a Sip"`
- `"Steep. Sip. Repeat."`
- `"Pour Something Good"`
- `"TMUG Moments"`

### Section Treatment: "Made for moments that linger"
- Replaced oversized product photographs and giant logos with a playful, editorial text-and-sticker composition.
- Interactive floating stickers with subtle hover tilt (`rotate: -2deg`, `scale: 1.12`).
- Washi tape borders with clean drop shadows (`shadow-[0_10px_24px_-8px_rgba(11,61,46,0.18)]`).

---

## 7. Motion & Animation Principles

All motion is purposeful, cinematic, and calm — never erratic or distracting.

### Motion Conventions
- **Hover Lift**: Cards gently elevate (`y: -4px`) with soft shadow expansion on hover.
- **Idle Float**: Key brand hero elements float smoothly along the vertical axis (2–6px displacement over 6–11 seconds).
- **Parallax**: Subtle mouse tracking on desktop hero stages (capped at 3–8 degrees rotation).
- **Entrance Reveals**: Viewport-triggered scroll reveals using cubic-bezier easing (`ease: [0.22, 1, 0.36, 1]`).
- **Tailwind Keyframes**:
  - `animate-marquee`: Linear 30s infinite scroll for announcement strips.
  - `animate-float`: 7s vertical idle float.
  - `animate-steam`: 7s delicate rising opacity loop for steaming kulhad cups.

### Accessibility (`prefers-reduced-motion`)
Strict adherence to user accessibility settings:
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
All Framer Motion components check `useReducedMotion()` and gracefully deactivate parallax and floating loops.
