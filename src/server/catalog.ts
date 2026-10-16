import "server-only";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { PRODUCTS } from "@/data/products";
import { effectivePricePaise, isInStock } from "@/lib/catalog-rules";
import type { Product, ProductImage, ProductVariant } from "@/types";
import { isDatabaseConfigured, pgErrorCode, queryExisting } from "./db";

/**
 * PUBLIC catalogue for the storefront.
 *
 * - With DATABASE_URL set and migrated, products come from PostgreSQL (what the
 *   admin edits). Only ACTIVE products are returned.
 * - Otherwise — or if the database errors — the built-in catalogue in
 *   src/data/products.ts is served, so the storefront never goes down because of
 *   the database. (Checkout re-prices from the database, so a stale fallback can
 *   never charge a wrong amount.)
 *
 * This reader never creates the schema; DDL only runs from admin / checkout.
 */

export const CATALOG_TAG = "catalog";

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  category_name?: string;
  description: string;
  brew_guide: string;
  ingredients: string;
  profile: string;
  accent: string;
  accent_soft: string;
  featured: boolean;
  seo_title: string;
  meta_description: string;
}

export interface VariantRow {
  id: string;
  product_id: string;
  sku: string;
  label: string;
  weight: string;
  pack: string;
  price_paise: number;
  sale_price_paise: number | null;
  stock_quantity: number | null;
  is_available: boolean;
  images: unknown;
}

function cleanImages(raw: unknown): ProductImage[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((i): ProductImage[] => {
    if (!i || typeof i !== "object") return [];
    const o = i as Record<string, unknown>;
    if (typeof o.src !== "string" || !o.src) return [];
    const kind = o.kind === "back" || o.kind === "fssai" ? o.kind : "front";
    return [{ src: o.src, alt: typeof o.alt === "string" ? o.alt : "", kind }];
  });
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}

export function toVariant(v: VariantRow): ProductVariant {
  const effective = effectivePricePaise(v.price_paise, v.sale_price_paise);
  const onSale = effective < v.price_paise;
  return {
    id: v.id,
    sku: v.sku,
    label: v.label,
    weight: v.weight,
    pack: v.pack,
    price: effective / 100,
    ...(onSale ? { compareAtPrice: v.price_paise / 100 } : {}),
    images: cleanImages(v.images),
    inStock: isInStock(v),
  };
}

export function toProduct(p: ProductRow, variants: VariantRow[]): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    ...(p.category_name ? { categoryName: p.category_name } : {}),
    description: p.description,
    brewGuide: p.brew_guide,
    ingredients: p.ingredients,
    profile: p.profile,
    accent: p.accent,
    accentSoft: p.accent_soft,
    ...(p.featured ? { featured: true } : {}),
    seoTitle: p.seo_title || `${p.name} | TMUG`,
    metaDescription: p.meta_description || truncate(p.description || p.name, 155),
    variants: variants.map(toVariant),
  };
}

async function loadCatalog(): Promise<Product[]> {
  const products = await queryExisting<ProductRow>(
    `SELECT p.id, p.slug, p.name, p.tagline, p.category, c.name AS category_name, p.description, p.brew_guide,
            p.ingredients, p.profile, p.accent, p.accent_soft, p.featured, p.seo_title, p.meta_description
       FROM products p JOIN categories c ON c.slug = p.category
      WHERE p.is_active ORDER BY p.sort_order, p.name`,
  );
  const variants = await queryExisting<VariantRow>(
    `SELECT v.id, v.product_id, v.sku, v.label, v.weight, v.pack, v.price_paise, v.sale_price_paise,
            v.stock_quantity, v.is_available, v.images
       FROM product_variants v JOIN products p ON p.id = v.product_id
      WHERE p.is_active ORDER BY v.product_id, v.sort_order, v.label`,
  );
  const byProduct = new Map<string, VariantRow[]>();
  for (const v of variants) {
    const list = byProduct.get(v.product_id) ?? [];
    list.push(v);
    byProduct.set(v.product_id, list);
  }
  return products
    .map((p) => toProduct(p, byProduct.get(p.id) ?? []))
    // A product with no variant or no image cannot be rendered / sold.
    .filter((p) => p.variants.length > 0 && p.variants.every((v) => v.images.length > 0));
}

const readCatalogCached = unstable_cache(loadCatalog, ["tmug-catalog-v1"], {
  tags: [CATALOG_TAG],
  revalidate: 60,
});

/** After a database failure, serve the built-in catalogue for a few seconds instead of waiting on timeouts. */
let breakerOpenUntil = 0;

export async function getCatalog(): Promise<Product[]> {
  if (!isDatabaseConfigured()) return PRODUCTS;
  if (Date.now() < breakerOpenUntil) return PRODUCTS;
  try {
    return await readCatalogCached();
  } catch (err) {
    // 42P01 = tables not created yet (first deploy before the admin/checkout touched the DB): expected, stay quiet.
    if (pgErrorCode(err) !== "42P01") {
      console.error("[catalog] database read failed, using built-in catalogue:", err instanceof Error ? err.message : err);
    }
    breakerOpenUntil = Date.now() + 15_000;
    return PRODUCTS;
  }
}

export async function getCatalogProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getCatalog()).find((p) => p.slug === slug);
}

/** Call after ANY change that affects what the storefront shows (products, prices, stock, availability). */
export function revalidateCatalog(): void {
  // The caller has just written to the database successfully, so it is reachable: stop serving the built-in fallback.
  breakerOpenUntil = 0;
  revalidateTag(CATALOG_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}
