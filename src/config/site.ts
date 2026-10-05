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
   * Prices in data/products.ts are the REAL selling prices (confirmed).
   * While false, prices are hidden from search-engine structured data.
   */
  pricesAreReal: true,

  /**
   * Festive / promotional offer. Turn `enabled` off after the season ends —
   * the popup, announcement bar and coupon validation all respect this flag.
   * The coupon gives `discountPercent`% off the cart subtotal when applied.
   */
  promo: {
    enabled: true,
    code: "TMUG10", // the ONE valid coupon code (case-insensitive)
    discountPercent: 10,
    title: "Festive Offer",
    headline: "Get 10% OFF your first order",
    message:
      "Add teas to your cart, apply the code at checkout, and get 10% off instantly. No minimum order — the discount shows right in your cart.",
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
export function whatsappOrderLink(
  lines: { name: string; variant: string; qty: number; unitPrice: string; lineTotal: string }[],
  subtotal: string,
  discount?: { code: string; percent: number; amount: string },
  total?: string,
): string {
  const messageLines = [
    "Hello TMUG,",
    "",
    "I would like to order:",
    "",
    ...lines.flatMap((l, i) => [
      `${i + 1}. ${l.name}`,
      `Variant: ${l.variant}`,
      `Qty: ${l.qty}`,
      `Price: ${l.unitPrice} each`,
      "",
    ]),
    `Subtotal: ${subtotal}`,
    ...(discount ? [`Discount (${discount.code} — ${discount.percent}% off): -${discount.amount}`] : []),
    ...(total ? [`Total: ${total}`] : []),
    "",
    "Please confirm my order.",
  ];
  return whatsappLink(messageLines.join("\n"));
}
