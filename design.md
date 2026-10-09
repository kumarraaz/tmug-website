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

## 3. Color System (TMUG Vibrant 5-Color Reference Palette)

> [!IMPORTANT]
> **STRICT ZERO DARK GREEN UI RULE**:
> Dark green is STRICTLY FORBIDDEN as a homepage UI color.
> Do NOT use dark green for navbar background, buttons, primary CTAs, main section backgrounds, product card backgrounds, primary UI colors, borders, or navigation controls.
> The uploaded Olivine `#82BA88` may only be used as a LIGHT SUPPORTING ACCENT where appropriate.
> Natural green appearing inside authentic TMUG product photography, packaging, tea leaves, or botanical imagery must NOT be altered or removed.
> The overall UI must NOT visually become a green-themed website.

All primary UI colors are configured in `@theme` inside `src/app/globals.css`:

### Approved Master UI Palette
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `Cherry Blossom Pink` / `--color-cherry-blossom` | `#FAA4B5` | Primary vibrant Gen-Z accent, playful CTAs, badge accents, hover glows |
| `Fawn` / `--color-fawn` | `#F8B77C` | Warm supporting accent, tea highlights, border glows |
| `Maize` / `--color-maize` | `#FFF183` | Radiant light gold, bestseller chips, active pills, selection highlights |
| `Sky Blue` / `--color-sky-blue` | `--color-sky-blue` / `#70C1E1` | Butterfly pea accents, cool botanical contrast, ambient aura |
| `Olivine` / `--color-olivine` | `#82BA88` | **Light supporting accent ONLY**; subtle botanical badges |
| `Warm Ivory` / `--color-warm-ivory` | `#FFF7EF` | Primary canvas; warm, breathable, tactile |
| `Soft Peach Cream` / `--color-warm-surface` | `#FBE7DC` | Cards, secondary section backgrounds, subtle container tints |
| `Deep Plum` / `--color-plum` | `#33243A` | Rich typography, high-contrast dark sections, footer canvas |
| `Warm Charcoal` / `--color-charcoal` | `#3A3438` | Editorial secondary text, dark buttons, navigation links |
| `White` / `--color-white` | `#FFFFFF` | Product stage card surfaces, contrast badges, clean cards |

### Product Card Hover & Interaction System
- **WATER-WAVE ANIMATION REMOVED**: All legacy water-wave keyframes, clip-path liquid waves, wavy pink overlays, animated water surfaces, and white reveal shapes have been completely removed.
- **Default State**: Clean authentic front packaging with 100% transparent PNG cutout (`object-fit: contain;`, sharp foreground).
- **Subtle Gen-Z Hover State (Desktop)**:
  - Card lifts slightly (`translateY(-4px)`).
  - Product image scales very subtly (`scale-105`).
  - Subtle radial glow behind the product using Cherry Blossom Pink (`#FAA4B5`) and Maize (`#FFF183`).
  - The foreground product remains **100% sharp** (never blurred).
  - Back packshot smoothly cross-fades without wave distortion.
- **Mobile Tap Reveal**: Touch-friendly flip toggle on card tap for packages with alternate back views.
- **In-Place Cart Controls**: Prominent Add to Cart button transitions immediately to an In Cart quantity stepper (`−` qty `+`) and a direct Remove button calling `removeLine(variantId)`.

### Open Your TMUG Box Opener System
- **Pop-Up Product Reveal**: Background dims slightly (existing page remains visible behind), opener box scales down, and the product pops forward dramatically.
- **Product Sizing**:
  - Desktop: Product occupies **45–65% of viewport height** (`object-fit: contain`).
  - Mobile: Product occupies **45–60% of viewport height** without cropping.
- **Animation Sequence (Framer Motion)**:
  - Product scales smoothly `0.82 → 1.0`
  - Moves upward `translateY(24px) → translateY(0)`
  - Opacity `0 → 1` with soft shadow settling over 450–700ms.
- **Random Product Selection**: Controlled dynamic selection from eligible verified products (`butterfly-pea`, `hibiscus`, `chamomile`, `lemongrass`, `gold-tea`, `darjeeling-green`) with a shuffle button.
- **Live Cart Integration**: Displays verified product name, tagline, description, price, compare-at price, variant toggles, and live working Add to Cart / quantity stepper.

### Collections Rail & Navigation
- Rail spans the full available width from LEFT edge to RIGHT edge (4–6 products on desktop, 1–2 on mobile).
- Navigation arrow controls are placed **outside the product visual area on the left and right flanks**, preventing occlusion of product packaging.
- Arrows use the vibrant palette (no dark green controls).

### Admin Media Control Panel
- Native system file upload (`<input type="file">` -> `/api/admin/upload` -> `/public/uploads/`).
- Slot-specific requirements (Product Cutout: 1:1, 1200×1200 px, transparent PNG; Hero Banner: 3:1, 2172×724 px; Collection/Lifestyle: source ratio).
- Real preview modal displaying dimensions, format, file size, transparency status, with Replace, Remove, Upload New, and Save options.
- Multi-slot support for Front Cutout, Back/Alternate, Thumbnail, Hero, and Lifestyle assets.

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

---

## 8. Dynamic Theme Tokens & Control Center Mapping

The TMUG design system dynamically adapts to operator visual controls via `DynamicThemeProvider.tsx` and `useSiteControls()`:

### Dynamic CSS Custom Properties (`:root`)
| Variable | Default | Visual Control Source |
| :--- | :--- | :--- |
| `--brand-cream` | `#FDFBF7` | `controls.globalDesign.colors.background` |
| `--brand-terracotta` | `#C2410C` | `controls.globalDesign.colors.accent` |
| `--brand-gold` | `#D97706` | Derived gold/maize supporting accent |
| `--brand-border` | `#E7E5E4` | `controls.globalDesign.colors.border` |
| `--font-display` | `Bricolage Grotesque` | `controls.globalDesign.typography.displayFont` |
| `--font-sans` | `DM Sans` | `controls.globalDesign.typography.primaryFont` |

### Dynamic Google Fonts
When an operator switches typography in the Control Center, `DynamicThemeProvider` dynamically injects the official Google Fonts stylesheet:
- **Display Options**: `Bricolage Grotesque`, `Playfair Display`, `Outfit`, `Cinzel`, `Montserrat`, `Plus Jakarta Sans`, `DM Sans`.
- **Primary Body Options**: `DM Sans`, `Inter`, `Outfit`, `Plus Jakarta Sans`, `Roboto`.

### Product Card Hover Presets
The Control Center provides 4 distinct hover interaction presets for product cards:
1. **`lift`**: Standard D2C vertical translation (`translateY(-6px)`) with expanded shadow depth.
2. **`scale`**: Fluid micro-scaling (`scale-105`) with smooth cubic-bezier easing.
3. **`glow`**: Radiant soft halo glow wrapped behind the transparent packshot cutout.
4. **`none`**: Modern flat editorial presentation without hover movement.

