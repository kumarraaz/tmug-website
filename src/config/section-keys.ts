/** Homepage sections that can be styled from the admin Page Builder. */
export const BUILDER_SECTIONS: { key: string; label: string }[] = [
  { key: "hero", label: "Hero Banners" },
  { key: "trustStrip", label: "Trust Strip" },
  { key: "collections", label: "Shop Collections" },
  { key: "bestSellers", label: "Best Sellers" },
  { key: "openReveal", label: "Box Opener" },
  { key: "whyTmug", label: "Why TMUG" },
  { key: "madeWithRealTea", label: "Real Botanicals" },
  { key: "teaStory", label: "Tea Story" },
  { key: "ritualsRecipes", label: "Recipes & Rituals" },
  { key: "lifestyleGallery", label: "Moments Gallery" },
  { key: "brandProof", label: "Brand Proof" },
  { key: "customerLove", label: "Reviews" },
  { key: "availableInStores", label: "Store Channels" },
  { key: "finalCta", label: "Final CTA" },
  { key: "footer", label: "Footer" },
];

/** Only fonts that are actually loaded by the site (layout.tsx) or are universal system stacks. */
export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: "Site default", value: "" },
  { label: "Bricolage Grotesque (display)", value: "var(--font-display), system-ui, sans-serif" },
  { label: "DM Sans (body)", value: "var(--font-sans), system-ui, sans-serif" },
  { label: "System sans", value: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
  { label: "Serif (Georgia)", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "ui-monospace, Menlo, Consolas, monospace" },
];
