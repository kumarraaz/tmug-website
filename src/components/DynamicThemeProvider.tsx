"use client";

import { useMemo } from "react";
import { useSiteControls } from "@/lib/site-controls-context";

/** List of Google Web Fonts that can be dynamically loaded */
const GOOGLE_FONTS = [
  "Bricolage Grotesque",
  "DM Sans",
  "Inter",
  "Playfair Display",
  "Outfit",
  "Plus Jakarta Sans",
  "Roboto",
  "Cinzel",
  "Poppins",
];

export default function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const { controls } = useSiteControls();

  const fontImports = useMemo(() => {
    const fontsToLoad = new Set<string>();
    if (controls.global?.typography?.fontDisplay && GOOGLE_FONTS.includes(controls.global.typography.fontDisplay)) {
      fontsToLoad.add(controls.global.typography.fontDisplay);
    }
    if (controls.global?.typography?.fontBody && GOOGLE_FONTS.includes(controls.global.typography.fontBody)) {
      fontsToLoad.add(controls.global.typography.fontBody);
    }

    if (fontsToLoad.size === 0) return null;

    const familiesQuery = Array.from(fontsToLoad)
      .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700;800;900`)
      .join("&");

    return `https://fonts.googleapis.com/css2?${familiesQuery}&display=swap`;
  }, [controls.global?.typography?.fontDisplay, controls.global?.typography?.fontBody]);

  const cssVariables = useMemo(() => {
    const g = controls.global || ({} as any);
    const colors = g.colors || {};
    const typo = g.typography || {};
    const btns = g.buttons || {};
    const h = controls.header || ({} as any);
    const sv = controls.sectionsVisual || ({} as any);
    const comps = controls.components || ({} as any);
    const card = comps.productCard || {};

    return `
      :root {
        /* ── Dynamic Brand Colors ── */
        --color-cherry-blossom: ${colors.brandPrimary || "#FAA4B5"};
        --color-fawn: ${colors.brandSecondary || "#F8B77C"};
        --color-maize: ${colors.brandGold || "#FFF183"};
        --color-tea-gold: ${colors.brandGold || "#FFF183"};
        --color-sky-blue: ${colors.brandSkyBlue || "#70C1E1"};
        --color-olivine: ${colors.brandOlivine || "#82BA88"};
        --color-warm-ivory: ${colors.canvas || "#FFF7EF"};
        --color-warm-surface: ${colors.surface || "#FBE7DC"};
        --color-charcoal: ${colors.charcoal || "#3A3438"};
        --color-deep-plum: ${colors.deepPlum || "#33243A"};
        --color-ink: ${colors.textPrimary || "#33243A"};
        --color-text-secondary: ${colors.textSecondary || "#3A3438"};
        --color-border-default: ${colors.borderDefault || "rgba(58,52,56,0.12)"};

        /* ── Dynamic Typography ── */
        --font-display-custom: "${typo.fontDisplay || "Bricolage Grotesque"}", var(--font-display), sans-serif;
        --font-sans-custom: "${typo.fontBody || "DM Sans"}", var(--font-sans), sans-serif;

        /* ── Dynamic Header ── */
        --tmug-header-bg: ${h.background || "#3A3438"};
        --tmug-header-text: ${h.textColor || "#FFF7EF"};
        --tmug-header-height: ${h.heightDesktop || 72}px;
        --tmug-header-height-mobile: ${h.heightMobile || 60}px;
        --tmug-nav-font-size: ${h.navFontSize || 17}px;
        --tmug-nav-gap: ${h.navGap || 32}px;
        --tmug-nav-hover: ${h.navHoverColor || "#FFF183"};
        --tmug-nav-active: ${h.navActiveColor || "#FFF183"};
        --tmug-logo-height: ${h.logoHeight || 44}px;

        /* ── Dynamic Buttons ── */
        --tmug-btn-primary-bg: ${btns.primaryBg || "#3A3438"};
        --tmug-btn-primary-text: ${btns.primaryText || "#FFFFFF"};
        --tmug-btn-primary-hover-bg: ${btns.primaryHoverBg || "#FFF183"};
        --tmug-btn-primary-hover-text: ${btns.primaryHoverText || "#3A3438"};
        --tmug-btn-secondary-bg: ${btns.secondaryBg || "#FAA4B5"};
        --tmug-btn-secondary-text: ${btns.secondaryText || "#FFFFFF"};

        /* ── Dynamic Sections Backgrounds ── */
        --sec-hero-bg: ${sv.hero?.bgColor || "#FFF7EF"};
        --sec-trust-bg: ${sv.trustStrip?.bgColor || "#FBE7DC"};
        --sec-collections-bg: ${sv.collections?.bgColor || "#FFF7EF"};
        --sec-bestsellers-bg: ${sv.bestSellers?.bgColor || "#FBE7DC"};
        --sec-openreveal-bg: ${sv.openReveal?.bgColor || "#FFF7EF"};
        --sec-whytmug-bg: ${sv.whyTmug?.bgColor || "#FBE7DC"};
        --sec-realtea-bg: ${sv.madeWithRealTea?.bgColor || "#FFF7EF"};
        --sec-teastory-bg: ${sv.teaStory?.bgColor || "#FBE7DC"};
        --sec-recipes-bg: ${sv.ritualsRecipes?.bgColor || "#FFF7EF"};
        --sec-lifestyle-bg: ${sv.lifestyleGallery?.bgColor || "#FBE7DC"};
        --sec-brandproof-bg: ${sv.brandProof?.bgColor || "#FFF7EF"};
        --sec-customerlove-bg: ${sv.customerLove?.bgColor || "#FBE7DC"};
        --sec-stores-bg: ${sv.availableInStores?.bgColor || "#FFF7EF"};
        --sec-finalcta-bg: ${sv.finalCta?.bgColor || "#3A3438"};
        --sec-footer-bg: ${sv.footer?.bgColor || "#3A3438"};

        /* ── Product Card Styling ── */
        --card-product-bg: ${card.cardBg || "#FFFFFF"};
        --card-product-border: ${card.borderColor || "rgba(58,52,56,0.08)"};
        --card-product-img-height: ${card.imageHeightDesktop || 280}px;
      }

      /* Apply font family overrides */
      .font-display {
        font-family: var(--font-display-custom) !important;
      }
      body {
        font-family: var(--font-sans-custom) !important;
      }
    `;
  }, [controls]);

  return (
    <>
      {fontImports && (
        <link rel="stylesheet" href={fontImports} />
      )}
      <style
        id="tmug-dynamic-theme"
        dangerouslySetInnerHTML={{ __html: cssVariables }}
      />
      {children}
    </>
  );
}
