/**
 * Central site configuration for TMUG.
 *
 * Edit values here to change site-wide behaviour. Nothing else in the
 * codebase should hard-code these values.
 */

import { formatINR } from "@/lib/format";

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

  /** Official TMUG Amazon Brand Store URL (Confirmed). */
  amazonStore:
    "https://www.amazon.in/stores/Tmug/page/4EF8CF60-EB4F-4438-B735-748BE0ED8162?lp_asin=B0H25XRHC5&ref_=ast_bln",

  /**
   * Verified retail channels & marketplaces. Only confirmed active channels
   * are marked active: true. Other marketplaces can be enabled when live.
   */
  marketplaces: [
    {
      id: "amazon",
      name: "Amazon",
      url: "https://www.amazon.in/stores/Tmug/page/4EF8CF60-EB4F-4438-B735-748BE0ED8162?lp_asin=B0H25XRHC5&ref_=ast_bln",
      badge: "Official Store",
      description: "Prime Fast Delivery across India",
      active: true,
    },
    {
      id: "whatsapp",
      name: "WhatsApp Store",
      url: "https://wa.me/918130707344?text=Hi%20TMUG!%20I%20want%20to%20order%20tea.",
      badge: "Direct from Brand",
      description: "Order directly with real tea humans",
      active: true,
    },
    {
      id: "blinkit",
      name: "Blinkit",
      url: "#",
      badge: "Coming Soon",
      description: "10-minute quick delivery",
      active: false,
    },
    {
      id: "zepto",
      name: "Zepto",
      url: "#",
      badge: "Coming Soon",
      description: "Instant delivery in select cities",
      active: false,
    },
  ],

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

/**
 * Pre-filled WhatsApp order link for a single product + variant.
 * Used on product detail pages and the featured-product section.
 */
export function whatsappProductLink(
  product: { name: string },
  variant: { label: string; price: number },
  qty: number,
): string {
  const messageLines = [
    "Hello TMUG,",
    "",
    "I would like to order:",
    "",
    `1. ${product.name}`,
    `Variant: ${variant.label}`,
    `Qty: ${qty}`,
    `Price: ${formatINR(variant.price)} each`,
    "",
    `Total: ${formatINR(variant.price * qty)}`,
    "",
    "Please confirm my order.",
  ];
  return whatsappLink(messageLines.join("\n"));
}
