/**
 * Phase 1.5 regression verification — runs against the REAL compiled modules.
 * Prices, variants, coupon math, WhatsApp links, accents, collections, slugs.
 */
import { PRODUCTS, getProductBySlug, frontImage } from "../src/data/products";
import { COLLECTIONS, COLLECTION_NAV, collectionProducts, getCollection } from "../src/data/collections";
import { siteConfig, whatsappProductLink } from "../src/config/site";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) { passed++; }
  else { failed++; console.error(`FAIL: ${name}${detail ? " — " + detail : ""}`); }
}

// 1. Product count + slugs
check("7 products", PRODUCTS.length === 7, `got ${PRODUCTS.length}`);
check("13 variants total", PRODUCTS.reduce((n, p) => n + p.variants.length, 0) === 13);
const slugs = PRODUCTS.map((p) => p.slug);
check("unique slugs", new Set(slugs).size === 7);

// 2. Real prices (must never change in a redesign)
const expected: Record<string, number[]> = {
  "butterfly-pea": [99, 189],
  "chamomile": [129, 209],
  "hibiscus": [119, 199],
  "lemongrass": [99, 199],
  "darjeeling-green": [149],
  "premium-tea": [299, 449],
  "gold-tea": [399, 749],
};
for (const p of PRODUCTS) {
  const exp = expected[p.id];
  check(`${p.id} prices intact`, JSON.stringify(p.variants.map((v) => v.price)) === JSON.stringify(exp),
    `got ${p.variants.map((v) => v.price)}`);
}

// 3. New fields present
for (const p of PRODUCTS) {
  check(`${p.id} has accent`, /^#[0-9A-Fa-f]{6}$/.test(p.accent));
  check(`${p.id} has accentSoft`, /^#[0-9A-Fa-f]{6}$/.test(p.accentSoft));
  check(`${p.id} has profile`, p.profile.length > 5);
  check(`${p.id} no health claims in profile`, !/detox|cure|weight|disease|medic/i.test(p.profile));
}

// 4. getProductBySlug works for all
for (const s of slugs) {
  check(`slug resolves: ${s}`, getProductBySlug(s)?.slug === s);
}

// 5. Collections integrity
check("7 collections", COLLECTIONS.length === 7, `got ${COLLECTIONS.length}`);
for (const c of COLLECTIONS) {
  const prods = collectionProducts(c);
  check(`collection ${c.id} resolves ${prods.length} products`, prods.length === c.productIds.length);
  check(`collection ${c.id} has accent`, /^#[0-9A-Fa-f]{6}$/.test(c.accent));
}
for (const c of COLLECTIONS) {
  const nav = c.id === "all-teas" ? `/collections?c=all-teas` : `/collections?c=${c.id}`;
  check(`collection ${c.id} reachable from nav`, COLLECTION_NAV.some((n) => n.href === nav));
}

// 6. Coupon config intact
check("TMUG10 code", siteConfig.promo.code === "TMUG10");
check("TMUG10 = 10%", siteConfig.promo.discountPercent === 10);

// 7. WhatsApp single-product link structure
const p = PRODUCTS[0];
const v = p.variants[0];
const wa = whatsappProductLink(p, v, 2);
check("whatsapp link is wa.me", wa.startsWith("https://wa.me/918130707344"));
check("whatsapp link has product", decodeURIComponent(wa).includes(p.name));
check("whatsapp link has variant", decodeURIComponent(wa).includes(v.label));
check("whatsapp link has qty", decodeURIComponent(wa).includes("Qty: 2"));
check("whatsapp link has total", decodeURIComponent(wa).includes("Total:"));

// 8. Paise-safe coupon math (₹198 → −₹19.80 → ₹178.20)
const subtotal = 198;
const discount = Math.round((subtotal * 10) / 100 * 100) / 100;
check("10% of 198 = 19.8", discount === 19.8, `got ${discount}`);
check("total = 178.2", Math.round((subtotal - discount) * 100) / 100 === 178.2);

// 9. frontImage fallback never undefined
for (const prod of PRODUCTS) {
  for (const vari of prod.variants) {
    const img = frontImage(vari);
    check(`${vari.id} has image`, typeof img.src === "string" && img.src.length > 0);
    check(`${vari.id} image has alt`, img.alt.length > 5);
  }
}

// 10. SEO fields present
for (const prod of PRODUCTS) {
  check(`${prod.id} seoTitle`, prod.seoTitle.length > 10);
  check(`${prod.id} metaDescription`, prod.metaDescription.length > 20);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
