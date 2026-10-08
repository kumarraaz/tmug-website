/** Shared TypeScript types for the TMUG storefront. */

export interface ProductImage {
  src: string;
  alt: string;
  /** front | back | fssai — controls where the image is used */
  kind: "front" | "back" | "fssai";
}

export interface ProductVariant {
  id: string;
  sku: string;
  label: string; // e.g. "50g Jar"
  weight: string; // e.g. "50g"
  pack: "jar" | "pouch";
  /** PLACEHOLDER price in INR — see siteConfig.pricesAreReal */
  price: number;
  /** PLACEHOLDER compare-at price in INR (optional) */
  compareAtPrice?: number;
  images: ProductImage[];
  inStock: boolean;
}

export type ProductCategory =
  | "herbal-flower"
  | "green-tea"
  | "chai";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  description: string;
  brewGuide: string;
  ingredients: string;
  /** Tasting notes — short, no health claims. */
  profile: string;
  /** Brand accent color for this tea (hex). */
  accent: string;
  /** Soft tinted background for this tea (hex). */
  accentSoft: string;
  featured?: boolean;
  variants: ProductVariant[];
  seoTitle: string;
  metaDescription: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  productIds: string[];
  accent: string; // tailwind-friendly hex for card accents
}

export interface CartLine {
  variantId: string;
  productId: string;
  productName: string;
  variantLabel: string;
  price: number;
  image: string;
  imageAlt: string;
  qty: number;
}

export interface SeoSettings {
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  h1: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  topics: string;
}

export interface HeroBannerControl {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  desktopSrc: string;
  mobileSrc: string;
  enabled: boolean;
  order: number;
}

export interface ProductControl {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  frontImage: string;
  backImage?: string;
  thumbnail?: string;
  heroImage?: string;
  lifestyleImage?: string;
  isBestSeller: boolean;
  isPopularPick: boolean;
  enabled: boolean;
  order: number;
}

export interface CollectionControl {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  order: number;
}

export interface SectionControl {
  id: string;
  label: string;
  heading: string;
  subheading: string;
  ctaText?: string;
  ctaLink?: string;
  enabled: boolean;
  order: number;
}

export interface SiteControls {
  banners: HeroBannerControl[];
  products: ProductControl[];
  collections: CollectionControl[];
  sections: SectionControl[];
}

