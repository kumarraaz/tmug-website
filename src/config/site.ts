/**
 * Central site configuration for TMUG.
 *
 * Edit values here to change site-wide behaviour. Nothing else in the
 * codebase should hard-code these values.
 */

export const siteConfig = {
  name: "TMUG",
  tagline: "Tea, but make it TMUG.",
  description:
    "TMUG is a modern Indian tea brand — whole-flower herbal teas, Darjeeling green tea and kadak CTC chai, packed fresh for your everyday ritual.",

  /** Canonical site URL. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://tmug.in). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tmug.in",

  /** Support / order WhatsApp number in international format (no +, no spaces). */
  whatsapp: {
    number: "918130707344",
    display: "+91 81307 07344",
    defaultMessage: "Hi TMUG! I want to know more about your teas.",
  },

  /**
   * IMPORTANT: prices in data/products.ts are PLACEHOLDER values only.
   * Set this to true only after real MRP has been entered there.
   * While false, prices are hidden from search-engine structured data.
   */
  pricesAreReal: false,

  /** Festive / promotional popup. Turn `enabled` off after the season ends. */
  promo: {
    enabled: true,
    code: "TMUG10",
    discountPercent: 10,
    title: "Festive Offer",
    headline: "Get 10% OFF your first order",
    message:
      "Mention the code on WhatsApp when you place your order and we’ll take 10% off. No auto-applied discounts — just show the code.",
    cta: "Shop Tea",
    /** Days before the popup may show again after dismissal. */
    remindAfterDays: 7,
    /** Delay (ms) before the popup appears on first visit. */
    delayMs: 2500,
  },

  nav: [
    { label: "Shop", href: "#shop" },
    { label: "Collections", href: "#collections" },
    { label: "About", href: "#about" },
    { label: "Why TMUG", href: "#why" },
  ],

  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },

  /** Contact email shown in footer (replace with the real one). */
  email: "hello@tmug.in",
} as const;

export function whatsappLink(message?: string): string {
  const text = encodeURIComponent(message ?? siteConfig.whatsapp.defaultMessage);
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${text}`;
}

/** Build a pre-filled WhatsApp order message from cart lines. */
export function whatsappOrderLink(lines: string[], subtotal: string): string {
  const message = [
    "Hi TMUG! I’d like to order:",
    "",
    ...lines.map((l) => `• ${l}`),
    "",
    `Subtotal: ${subtotal}`,
    `Promo code: ${siteConfig.promo.code} (10% off)`,
  ].join("\n");
  return whatsappLink(message);
}
