import type { PoolClient } from "pg";
import { PRODUCTS } from "@/data/products";

/**
 * Ordered, append-only list of schema / data migrations. Each one runs exactly
 * once (recorded in schema_migrations) inside a transaction. NEVER edit an
 * applied migration — add a new one.
 *
 * Money is stored as integer paise. Financial rows (orders, order_items,
 * payments, refunds, order_events) reference each other with ON DELETE
 * RESTRICT so history can never be removed by deleting a product or customer.
 */
export interface Migration {
  id: string;
  run: (client: PoolClient) => Promise<void>;
}

const SCHEMA_V1 = `
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TABLE categories (
  slug        text PRIMARY KEY,
  name        text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id                text PRIMARY KEY,
  slug              text NOT NULL UNIQUE,
  name              text NOT NULL,
  tagline           text NOT NULL DEFAULT '',
  category          text NOT NULL REFERENCES categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
  description       text NOT NULL DEFAULT '',
  brew_guide        text NOT NULL DEFAULT '',
  ingredients       text NOT NULL DEFAULT '',
  profile           text NOT NULL DEFAULT '',
  accent            text NOT NULL DEFAULT '#D8A62A',
  accent_soft       text NOT NULL DEFAULT '#FBEFD2',
  featured          boolean NOT NULL DEFAULT false,
  seo_title         text NOT NULL DEFAULT '',
  meta_description  text NOT NULL DEFAULT '',
  hsn_code          text,
  gst_rate_bp       integer CHECK (gst_rate_bp IS NULL OR (gst_rate_bp >= 0 AND gst_rate_bp <= 10000)),
  is_active         boolean NOT NULL DEFAULT true,
  sort_order        integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_active_sort_idx ON products (is_active, sort_order);

CREATE TABLE product_variants (
  id                text PRIMARY KEY,
  product_id        text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku               text NOT NULL UNIQUE,
  label             text NOT NULL,
  weight            text NOT NULL,
  pack              text NOT NULL,
  price_paise       integer NOT NULL CHECK (price_paise >= 0),
  sale_price_paise  integer CHECK (sale_price_paise IS NULL OR sale_price_paise >= 0),
  stock_quantity    integer CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
  is_available      boolean NOT NULL DEFAULT true,
  images            jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order        integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sale_not_above_price CHECK (sale_price_paise IS NULL OR sale_price_paise <= price_paise)
);
CREATE INDEX product_variants_product_idx ON product_variants (product_id, sort_order);

CREATE TABLE orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        text NOT NULL UNIQUE DEFAULT ('TMUG-' || lpad(nextval('order_number_seq')::text, 6, '0')),
  public_token        text NOT NULL UNIQUE,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  customer_name       text NOT NULL,
  customer_email      text NOT NULL,
  customer_phone      text NOT NULL,

  shipping_name       text NOT NULL,
  shipping_phone      text NOT NULL,
  shipping_line1      text NOT NULL,
  shipping_line2      text NOT NULL DEFAULT '',
  shipping_city       text NOT NULL,
  shipping_state      text NOT NULL,
  shipping_pincode    text NOT NULL,
  billing_name        text NOT NULL,
  billing_phone       text NOT NULL DEFAULT '',
  billing_line1       text NOT NULL,
  billing_line2       text NOT NULL DEFAULT '',
  billing_city        text NOT NULL,
  billing_state       text NOT NULL,
  billing_pincode     text NOT NULL,
  customer_note       text NOT NULL DEFAULT '',

  coupon_code         text,
  currency            text NOT NULL DEFAULT 'INR',
  subtotal_paise      integer NOT NULL CHECK (subtotal_paise >= 0),
  discount_paise      integer NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
  shipping_paise      integer NOT NULL DEFAULT 0 CHECK (shipping_paise >= 0),
  tax_paise           integer NOT NULL DEFAULT 0 CHECK (tax_paise >= 0),
  total_paise         integer NOT NULL CHECK (total_paise >= 0),
  gst_enabled         boolean NOT NULL DEFAULT false,
  prices_include_gst  boolean NOT NULL DEFAULT true,
  seller_gstin        text,
  seller_state        text,

  fulfilment_status   text NOT NULL DEFAULT 'new'
                      CHECK (fulfilment_status IN ('new','processing','shipped','delivered','cancelled')),
  payment_status      text NOT NULL DEFAULT 'pending'
                      CHECK (payment_status IN ('pending','paid','partially_refunded','refunded')),
  payment_method      text,
  paid_at             timestamptz,
  refunded_paise      integer NOT NULL DEFAULT 0,
  cancelled_at        timestamptz,
  cancel_reason       text,
  shipped_at          timestamptz,
  delivered_at        timestamptz,
  tracking_reference  text,
  invoice_number      text UNIQUE,
  invoice_date        date,
  admin_note          text NOT NULL DEFAULT '',
  stock_deducted      boolean NOT NULL DEFAULT false,
  gateway             text,
  gateway_order_id    text UNIQUE,

  CONSTRAINT refund_within_total CHECK (refunded_paise >= 0 AND refunded_paise <= total_paise)
);
CREATE INDEX orders_created_idx ON orders (created_at DESC);
CREATE INDEX orders_status_idx ON orders (payment_status, fulfilment_status);
CREATE INDEX orders_email_idx ON orders (lower(customer_email));

CREATE TABLE order_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  position          integer NOT NULL DEFAULT 0,
  product_id        text REFERENCES products(id) ON DELETE SET NULL,
  variant_id        text REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name      text NOT NULL,
  variant_label     text NOT NULL,
  sku               text NOT NULL,
  category          text NOT NULL DEFAULT '',
  hsn_code          text,
  image             text NOT NULL DEFAULT '',
  qty               integer NOT NULL CHECK (qty > 0),
  unit_price_paise  integer NOT NULL CHECK (unit_price_paise >= 0),
  list_price_paise  integer NOT NULL CHECK (list_price_paise >= 0),
  gross_paise       integer NOT NULL,
  discount_paise    integer NOT NULL DEFAULT 0,
  gst_applied       boolean NOT NULL DEFAULT false,
  gst_rate_bp       integer,
  taxable_paise     integer NOT NULL,
  cgst_paise        integer NOT NULL DEFAULT 0,
  sgst_paise        integer NOT NULL DEFAULT 0,
  igst_paise        integer NOT NULL DEFAULT 0,
  tax_paise         integer NOT NULL DEFAULT 0,
  total_paise       integer NOT NULL
);
CREATE INDEX order_items_order_idx ON order_items (order_id, position);
CREATE INDEX order_items_variant_idx ON order_items (variant_id);

CREATE TABLE payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  gateway             text NOT NULL,
  gateway_order_id    text,
  gateway_payment_id  text UNIQUE,
  method              text,
  status              text NOT NULL
                      CHECK (status IN ('created','authorized','captured','failed','partially_refunded','refunded')),
  amount_paise        integer NOT NULL CHECK (amount_paise >= 0),
  currency            text NOT NULL DEFAULT 'INR',
  refunded_paise      integer NOT NULL DEFAULT 0,
  paid_at             timestamptz,
  verified_at         timestamptz,
  verified_via        text,
  failure_reason      text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX payments_order_idx ON payments (order_id);
CREATE INDEX payments_paid_at_idx ON payments (paid_at);

CREATE TABLE refunds (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  payment_id    uuid REFERENCES payments(id) ON DELETE SET NULL,
  amount_paise  integer NOT NULL CHECK (amount_paise > 0),
  reason        text NOT NULL DEFAULT '',
  status        text NOT NULL DEFAULT 'processed' CHECK (status IN ('pending','processed','failed')),
  reference     text,
  source        text NOT NULL,
  refunded_at   timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX refunds_reference_uniq ON refunds (reference) WHERE reference IS NOT NULL;
CREATE INDEX refunds_order_idx ON refunds (order_id);
CREATE INDEX refunds_refunded_at_idx ON refunds (refunded_at);

CREATE TABLE order_events (
  id        bigserial PRIMARY KEY,
  order_id  uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  at        timestamptz NOT NULL DEFAULT now(),
  type      text NOT NULL,
  message   text NOT NULL,
  actor     text NOT NULL DEFAULT 'system'
);
CREATE INDEX order_events_order_idx ON order_events (order_id, at);

CREATE TABLE webhook_events (
  id            text PRIMARY KEY,
  provider      text NOT NULL,
  event_type    text NOT NULL,
  received_at   timestamptz NOT NULL DEFAULT now(),
  processed_at  timestamptz,
  error         text
);

CREATE TABLE store_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
`;

const SEED_CATEGORIES = [
  { slug: "herbal-flower", name: "Herbal & Flower Teas", sort: 10 },
  { slug: "green-tea", name: "Green Tea", sort: 20 },
  { slug: "chai", name: "Chai (CTC)", sort: 30 },
];

/**
 * One-time import of the catalogue that ships with the storefront
 * (src/data/products.ts). IDs, slugs, SKUs, prices and image paths are copied
 * verbatim, so existing product URLs, carts and images keep working.
 *
 * Stock is deliberately left NULL ("not tracked") — the shop's real stock
 * levels are unknown, and inventing them would be fabricating data. Because
 * this runs only once (recorded in schema_migrations), products an admin
 * later deletes are never re-created.
 */
async function seedCatalog(client: PoolClient): Promise<void> {
  for (const c of SEED_CATEGORIES) {
    await client.query(
      "INSERT INTO categories (slug, name, sort_order) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING",
      [c.slug, c.name, c.sort],
    );
  }

  for (const [i, p] of PRODUCTS.entries()) {
    // Safety net: a product with an unknown category gets its category row created.
    await client.query(
      "INSERT INTO categories (slug, name, sort_order) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING",
      [p.category, p.category, 100],
    );
    await client.query(
      `INSERT INTO products
         (id, slug, name, tagline, category, description, brew_guide, ingredients, profile,
          accent, accent_soft, featured, seo_title, meta_description, is_active, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,true,$15)
       ON CONFLICT (id) DO NOTHING`,
      [
        p.id, p.slug, p.name, p.tagline, p.category, p.description, p.brewGuide, p.ingredients, p.profile,
        p.accent, p.accentSoft, Boolean(p.featured), p.seoTitle, p.metaDescription, (i + 1) * 10,
      ],
    );
    for (const [j, v] of p.variants.entries()) {
      await client.query(
        `INSERT INTO product_variants
           (id, product_id, sku, label, weight, pack, price_paise, sale_price_paise,
            stock_quantity, is_available, images, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NULL,NULL,$8,$9::jsonb,$10)
         ON CONFLICT (id) DO NOTHING`,
        [v.id, p.id, v.sku, v.label, v.weight, v.pack, Math.round(v.price * 100), v.inStock, JSON.stringify(v.images), (j + 1) * 10],
      );
    }
  }
}

export const MIGRATIONS: Migration[] = [
  { id: "001_schema", run: async (client) => void (await client.query(SCHEMA_V1)) },
  { id: "002_seed_catalog", run: seedCatalog },
];
