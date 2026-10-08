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

## 3. Color System (Homepage V2 Master Palette)

> [!IMPORTANT]
> **STRICT ZERO GREEN UI RULE**: Green is NOT an approved active homepage UI color.
> Do NOT use green for navbar, buttons, CTA buttons, section backgrounds, cards, borders, active states, hover states, navigation links, badges, gradients, or UI containers.
> Authentic photographic green appearing naturally inside supplied banner photography, authentic packaging, tea leaves, flowers, and natural estate photos is strictly preserved and must not be artificially altered.

All primary UI colors are configured in `@theme` inside `src/app/globals.css`:

### Approved Master UI Palette
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `Warm Ivory` / `--color-warm-ivory` | `#FFF7EF` | Primary page & hero canvas; warm, breathable, tactile |
| `Soft Peach Cream` / `--color-peach-cream` | `#FBE7DC` | Cards, secondary section backgrounds, subtle container tints |
| `Coral Pink` / `--color-coral` | `#F36F6F` | Primary vibrant CTA buttons, high-energy accents, remove action |
| `Berry Pink` / `--color-berry` | `#D94F7D` | Secondary vibrant punch, floral badges, taglines |
| `Blush Pink` / `--color-pink-accent` | `#F6B6C8` | Soft Gen-Z reveal accent, liquid glows, halo backdrops |
| `Tea Gold` / `--color-tea-gold` | `#D8A33E` | Signature heritage warm gold, rating stars, badge borders |
| `Violet` / `--color-violet` | `#7251B5` | Butterfly pea ritual accents, evening tea tags |
| `Deep Plum` / `--color-plum` | `#33243A` | Rich typography, high-contrast dark sections, footer canvas |
| `Warm Charcoal` / `--color-charcoal` | `#3A3438` | Editorial secondary text, dark buttons, navigation links |
| `White` / `--color-white` | `#FFFFFF` | Product stage card surfaces, contrast badges, clean cards |

### Product Card Water-Wave Reveal & Gen-Z Interaction System
- **Default State**: Clear authentic front packaging view with full label visibility.
- **Hover State (Desktop)**:
  - Organic liquid water-wave animation powered by CSS `@keyframes tmugWave` using alternating polygon clip paths:
    ```css
    @keyframes tmugWave {
      0%, 100% { clip-path: polygon(0% 12%, 18% 4%, 38% 14%, 58% 6%, 78% 16%, 100% 8%, 100% 100%, 0% 100%); }
      25% { clip-path: polygon(0% 6%, 22% 16%, 42% 6%, 62% 14%, 82% 4%, 100% 12%, 100% 100%, 0% 100%); }
      50% { clip-path: polygon(0% 14%, 20% 6%, 40% 16%, 60% 8%, 80% 18%, 100% 6%, 100% 100%, 0% 100%); }
      75% { clip-path: polygon(0% 8%, 24% 14%, 44% 8%, 64% 16%, 84% 6%, 100% 14%, 100% 100%, 0% 100%); }
    }
    ```
  - Back packshot smoothly surfaces with a luminous Blush Pink (`#F6B6C8`) & Coral (`#F36F6F`) liquid halo glow.
- **Mobile Tap Reveal**: Tapping card toggles front/back packshot on touch screens without blocking links/buttons.
- **In-Place Cart Controls**: Prominent Add to Cart button transitions immediately to an In Cart quantity stepper (`−` qty `+`) and a direct Remove button calling `removeLine(variantId)`.

  - Soft light pink (`#F7B6C8`) and coral (`#F26B5E`) halo glow wrapping the card perimeter (`glow-pulse` animation).
  - Authentic back packshot reveals smoothly from verified `back` image asset.
  - Duration: ~400–700ms smooth organic motion.
- **Mobile Tap Reveal**:
  - Touch-friendly toggle on card tap (without blocking CTA buttons or links).
  - Tapping reveals the back packshot; tapping again returns to front.
  - Important pricing and Add to Cart controls remain visible and accessible in both states.

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
- Typography: Bold font weight (`font-bold` or `font-black`), tracking-wide.
- Interactive Feedback: `active:scale-95` tap response, smooth hover elevation.
- Primary CTA Colors (Zero Green):
  - Primary Dark: `bg-charcoal text-white hover:bg-deep-plum`
  - High-Visibility Coral: `bg-coral text-white hover:bg-coral/90`
  - Gold Accent: `bg-tea-gold text-charcoal hover:bg-saffron`
  - WhatsApp: `bg-[#25D366] text-white hover:bg-[#20ba59]` (preserves authentic WhatsApp brand mark)
  - Outline: `border-2 border-charcoal/20 text-charcoal hover:border-charcoal`


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
