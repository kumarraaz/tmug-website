import "server-only";
import { rupeesToPaise } from "@/lib/money";
import { slugify } from "@/lib/slug";
import type { ProductInput, VariantInput } from "@/lib/product-schema";
import type { AdminProduct } from "@/lib/admin-types";
import type { ProductImage } from "@/types";
import { query, queryOne, tx, type Queryable } from "./db";
import { ConflictError } from "./errors";

/** Admin-side product management (create / read / update / delete). Never cached. */

export interface AdminProductListRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  active: boolean;
  featured: boolean;
  variantCount: number;
  minPricePaise: number;
  maxPricePaise: number;
  trackedVariants: number;
  totalStock: number;
  lowStockVariants: number;
  thumb: string | null;
}

export interface CategoryRow {
  slug: string;
  name: string;
  productCount: number;
}

/* ------------------------------ categories ------------------------------ */

export async function listCategories(): Promise<CategoryRow[]> {
  const rows = await query<{ slug: string; name: string; product_count: number }>(
    `SELECT c.slug, c.name, COUNT(p.id)::int AS product_count
       FROM categories c LEFT JOIN products p ON p.category = c.slug
      GROUP BY c.slug, c.name, c.sort_order ORDER BY c.sort_order, c.name`,
  );
  return rows.map((r) => ({ slug: r.slug, name: r.name, productCount: r.product_count }));
}

export async function createCategory(name: string): Promise<{ slug: string; name: string }> {
  const clean = name.trim().replace(/\s+/g, " ");
  const slug = slugify(clean);
  if (clean.length < 2 || clean.length > 60 || !slug) throw new ConflictError("Enter a category name (2–60 characters).");
  const row = await queryOne<{ slug: string; name: string }>(
    `INSERT INTO categories (slug, name, sort_order)
     VALUES ($1, $2, COALESCE((SELECT MAX(sort_order) FROM categories), 0) + 10)
     ON CONFLICT (slug) DO NOTHING RETURNING slug, name`,
    [slug, clean],
  );
  if (!row) throw new ConflictError("A category with this name already exists.");
  return row;
}

/* -------------------------------- listing -------------------------------- */

export interface ProductListFilters {
  search?: string;
  category?: string;
  status?: "active" | "inactive" | "all";
  lowStockThreshold: number;
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");

export async function listProductsAdmin(f: ProductListFilters): Promise<AdminProductListRow[]> {
  const search = f.search?.trim() ? escapeLike(f.search.trim()) : null;
  const statusFlag = f.status === "active" ? true : f.status === "inactive" ? false : null;
  const rows = await query<{
    id: string; slug: string; name: string; category: string; category_name: string; is_active: boolean; featured: boolean;
    variant_count: number; min_price: number | null; max_price: number | null; tracked: number; total_stock: number;
    low: number; thumb: string | null;
  }>(
    `SELECT p.id, p.slug, p.name, p.category, c.name AS category_name, p.is_active, p.featured,
            COUNT(v.id)::int AS variant_count,
            MIN(COALESCE(v.sale_price_paise, v.price_paise)) AS min_price,
            MAX(COALESCE(v.sale_price_paise, v.price_paise)) AS max_price,
            COUNT(*) FILTER (WHERE v.stock_quantity IS NOT NULL)::int AS tracked,
            COALESCE(SUM(v.stock_quantity), 0)::int AS total_stock,
            COUNT(*) FILTER (WHERE v.stock_quantity IS NOT NULL AND v.stock_quantity <= $1)::int AS low,
            (array_agg(v.images->0->>'src' ORDER BY v.sort_order))[1] AS thumb
       FROM products p
       JOIN categories c ON c.slug = p.category
       LEFT JOIN product_variants v ON v.product_id = p.id
      WHERE ($2::text IS NULL
              OR p.name ILIKE '%' || $2 || '%'
              OR p.slug ILIKE '%' || $2 || '%'
              OR EXISTS (SELECT 1 FROM product_variants x WHERE x.product_id = p.id AND x.sku ILIKE '%' || $2 || '%'))
        AND ($3::text IS NULL OR p.category = $3)
        AND ($4::boolean IS NULL OR p.is_active = $4)
      GROUP BY p.id, c.name
      ORDER BY p.sort_order, p.name`,
    [f.lowStockThreshold, search, f.category || null, statusFlag],
  );
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    categoryName: r.category_name,
    active: r.is_active,
    featured: r.featured,
    variantCount: r.variant_count,
    minPricePaise: r.min_price ?? 0,
    maxPricePaise: r.max_price ?? 0,
    trackedVariants: r.tracked,
    totalStock: r.total_stock,
    lowStockVariants: r.low,
    thumb: r.thumb,
  }));
}

export async function productCounts(): Promise<{ total: number; active: number; inactive: number }> {
  const row = await queryOne<{ total: number; active: number }>(
    "SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE is_active)::int AS active FROM products",
  );
  const total = row?.total ?? 0;
  const active = row?.active ?? 0;
  return { total, active, inactive: total - active };
}

export interface LowStockRow {
  productId: string;
  productName: string;
  variantLabel: string;
  sku: string;
  stock: number;
}

/** Tracked variants whose stock is at or below the threshold (untracked stock is never "low"). */
export async function lowStockVariants(threshold: number, limit = 25): Promise<LowStockRow[]> {
  const rows = await query<{ product_id: string; product_name: string; label: string; sku: string; stock_quantity: number }>(
    `SELECT p.id AS product_id, p.name AS product_name, v.label, v.sku, v.stock_quantity
       FROM product_variants v JOIN products p ON p.id = v.product_id
      WHERE v.stock_quantity IS NOT NULL AND v.stock_quantity <= $1 AND p.is_active
      ORDER BY v.stock_quantity, p.name LIMIT $2`,
    [threshold, limit],
  );
  return rows.map((r) => ({ productId: r.product_id, productName: r.product_name, variantLabel: r.label, sku: r.sku, stock: r.stock_quantity }));
}

/* --------------------------------- read --------------------------------- */

interface AdminProductRow {
  id: string; slug: string; name: string; tagline: string; category: string; description: string; brew_guide: string;
  ingredients: string; profile: string; accent: string; accent_soft: string; featured: boolean; seo_title: string;
  meta_description: string; hsn_code: string | null; gst_rate_bp: number | null; is_active: boolean; sort_order: number;
  created_at: Date; updated_at: Date;
}

interface AdminVariantRow {
  id: string; sku: string; label: string; weight: string; pack: string; price_paise: number; sale_price_paise: number | null;
  stock_quantity: number | null; is_available: boolean; images: unknown; sort_order: number;
}

function adminImages(raw: unknown): ProductImage[] {
  return Array.isArray(raw)
    ? raw.flatMap((i): ProductImage[] =>
        i && typeof i === "object" && typeof (i as ProductImage).src === "string"
          ? [{ src: (i as ProductImage).src, alt: String((i as ProductImage).alt ?? ""), kind: (i as ProductImage).kind === "back" || (i as ProductImage).kind === "fssai" ? (i as ProductImage).kind : "front" }]
          : [],
      )
    : [];
}

export async function getProductAdmin(id: string): Promise<AdminProduct | null> {
  const p = await queryOne<AdminProductRow>("SELECT * FROM products WHERE id = $1", [id]);
  if (!p) return null;
  const vs = await query<AdminVariantRow>("SELECT * FROM product_variants WHERE product_id = $1 ORDER BY sort_order, label", [id]);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    description: p.description,
    brewGuide: p.brew_guide,
    ingredients: p.ingredients,
    profile: p.profile,
    accent: p.accent,
    accentSoft: p.accent_soft,
    featured: p.featured,
    seoTitle: p.seo_title,
    metaDescription: p.meta_description,
    hsnCode: p.hsn_code,
    gstRateBp: p.gst_rate_bp,
    active: p.is_active,
    sortOrder: p.sort_order,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    variants: vs.map((v) => ({
      id: v.id,
      sku: v.sku,
      label: v.label,
      weight: v.weight,
      pack: v.pack,
      pricePaise: v.price_paise,
      salePricePaise: v.sale_price_paise,
      stock: v.stock_quantity,
      available: v.is_available,
      images: adminImages(v.images),
      sortOrder: v.sort_order,
    })),
  };
}

/* -------------------------------- write --------------------------------- */

async function uniqueId(db: Queryable, table: "products" | "product_variants", base: string): Promise<string> {
  let candidate = base;
  for (let n = 2; await db.queryOne(`SELECT 1 FROM ${table} WHERE id = $1`, [candidate]); n++) {
    candidate = `${base}-${n}`;
  }
  return candidate;
}

async function insertVariant(db: Queryable, productId: string, v: VariantInput, sortOrder: number): Promise<void> {
  const base = `${productId}-${slugify(v.weight)}-${slugify(v.pack)}`.replace(/-+/g, "-").slice(0, 90);
  const id = await uniqueId(db, "product_variants", base);
  await db.query(
    `INSERT INTO product_variants
       (id, product_id, sku, label, weight, pack, price_paise, sale_price_paise, stock_quantity, is_available, images, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12)`,
    [id, productId, v.sku, v.label, v.weight, v.pack, rupeesToPaise(v.price), v.salePrice == null ? null : rupeesToPaise(v.salePrice), v.stock, v.available, JSON.stringify(v.images), sortOrder],
  );
}

async function updateVariant(db: Queryable, v: VariantInput & { id: string }, sortOrder: number): Promise<void> {
  await db.query(
    `UPDATE product_variants SET sku=$2, label=$3, weight=$4, pack=$5, price_paise=$6, sale_price_paise=$7,
            stock_quantity=$8, is_available=$9, images=$10::jsonb, sort_order=$11, updated_at=now()
      WHERE id=$1`,
    [v.id, v.sku, v.label, v.weight, v.pack, rupeesToPaise(v.price), v.salePrice == null ? null : rupeesToPaise(v.salePrice), v.stock, v.available, JSON.stringify(v.images), sortOrder],
  );
}

const gstBp = (pct: number | null) => (pct == null ? null : Math.round(pct * 100));

export async function createProduct(input: ProductInput): Promise<{ id: string; slug: string }> {
  const slug = input.slug ?? slugify(input.name);
  if (!slug) throw new ConflictError("Could not build a URL slug from this name.");

  return tx(async (db) => {
    if (await db.queryOne("SELECT 1 FROM products WHERE slug = $1", [slug])) {
      throw new ConflictError(`A product with the URL "/products/${slug}" already exists.`);
    }
    const id = await uniqueId(db, "products", slug);
    await db.query(
      `INSERT INTO products
         (id, slug, name, tagline, category, description, brew_guide, ingredients, profile, accent, accent_soft,
          featured, seo_title, meta_description, hsn_code, gst_rate_bp, is_active, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [id, slug, input.name, input.tagline, input.category, input.description, input.brewGuide, input.ingredients, input.profile,
        input.accent, input.accentSoft, input.featured, input.seoTitle, input.metaDescription, input.hsnCode, gstBp(input.gstRatePercent),
        input.active, input.sortOrder],
    );
    for (const [i, v] of input.variants.entries()) await insertVariant(db, id, v, (i + 1) * 10);
    return { id, slug };
  });
}

/** Returns false when the product does not exist. The slug (URL) is never changed. */
export async function updateProduct(id: string, input: ProductInput): Promise<boolean> {
  return tx(async (db) => {
    const exists = await db.queryOne("SELECT id FROM products WHERE id = $1 FOR UPDATE", [id]);
    if (!exists) return false;

    await db.query(
      `UPDATE products SET name=$2, tagline=$3, category=$4, description=$5, brew_guide=$6, ingredients=$7, profile=$8,
              accent=$9, accent_soft=$10, featured=$11, seo_title=$12, meta_description=$13, hsn_code=$14, gst_rate_bp=$15,
              is_active=$16, sort_order=$17, updated_at=now()
        WHERE id=$1`,
      [id, input.name, input.tagline, input.category, input.description, input.brewGuide, input.ingredients, input.profile,
        input.accent, input.accentSoft, input.featured, input.seoTitle, input.metaDescription, input.hsnCode, gstBp(input.gstRatePercent),
        input.active, input.sortOrder],
    );

    const current = new Set((await db.query<{ id: string }>("SELECT id FROM product_variants WHERE product_id = $1", [id])).map((r) => r.id));
    const keep = new Set(input.variants.flatMap((v) => (v.id && current.has(v.id) ? [v.id] : [])));

    // Remove variants dropped in the editor FIRST, so a replacement variant may reuse a freed SKU.
    // Order history keeps its own snapshot (order_items.variant_id is set to NULL).
    const removed = [...current].filter((vid) => !keep.has(vid));
    if (removed.length) await db.query("DELETE FROM product_variants WHERE id = ANY($1::text[])", [removed]);

    for (const [i, v] of input.variants.entries()) {
      const sortOrder = (i + 1) * 10;
      if (v.id && keep.has(v.id)) await updateVariant(db, { ...v, id: v.id }, sortOrder);
      else await insertVariant(db, id, v, sortOrder);
    }
    return true;
  });
}

/**
 * Permanently remove a product and its variants. Past orders are untouched:
 * order_items keep their own copy of the name, SKU, price and tax.
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const row = await queryOne("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
  return row !== null;
}
