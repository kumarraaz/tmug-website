import type { ProductImage } from "@/types";

/** Shapes shared between the admin API layer and the admin forms. */

export interface AdminVariant {
  id: string;
  sku: string;
  label: string;
  weight: string;
  pack: string;
  pricePaise: number;
  salePricePaise: number | null;
  /** null = stock not tracked */
  stock: number | null;
  available: boolean;
  images: ProductImage[];
  sortOrder: number;
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  brewGuide: string;
  ingredients: string;
  profile: string;
  accent: string;
  accentSoft: string;
  featured: boolean;
  seoTitle: string;
  metaDescription: string;
  hsnCode: string | null;
  gstRateBp: number | null;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  variants: AdminVariant[];
}
