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
  /** Pack type, e.g. "jar" or "pouch". */
  pack: string;
  /** Current selling price in INR (the sale price while a sale is active). */
  price: number;
  /** Regular price in INR, present only while a sale price is active (shown struck through). */
  compareAtPrice?: number;
  images: ProductImage[];
  /** false when the variant is marked unavailable or tracked stock has run out. */
  inStock: boolean;
}

/** Category slug. Built-in: "herbal-flower", "green-tea", "chai"; admins can add more. */
export type ProductCategory = string;

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  /** Display name of the category (set for database-backed products). */
  categoryName?: string;
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
  /** Set when the live catalogue says this pack is currently out of stock / unavailable. */
  unavailable?: boolean;
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

export * from "./site-controls";

