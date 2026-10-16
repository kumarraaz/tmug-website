import "server-only";
import { randomBytes } from "node:crypto";
import { siteConfig } from "@/config/site";
import { effectivePricePaise, isInStock } from "@/lib/catalog-rules";
import type { CheckoutInput, QuoteInput } from "@/lib/checkout-schema";
import { rupeesToPaise } from "@/lib/money";
import { TaxConfigError, discountForPercent, priceOrder, type PricingResult } from "@/lib/tax";
import { query, tx } from "./db";
import { BusinessRuleError, CheckoutBlockedError, PriceChangedError, type CheckoutIssue } from "./errors";
import { logEvent } from "./order-core";
import { GatewayError, PaymentsNotConfiguredError, createGatewayOrder, credentials, isPaymentConfigured } from "./razorpay";
import { getSettings, taxSettingsOf, type StoreSettings } from "./settings";

/**
 * Checkout: re-prices the cart ON THE SERVER from the database. Prices, names,
 * tax rates and availability sent by the browser are never trusted — the browser
 * only supplies variant ids and quantities.
 */

const MAX_QTY_PER_LINE = 50;
/** Razorpay's minimum order amount is ₹1. */
const MIN_ORDER_PAISE = 100;

interface VariantRow {
  id: string;
  product_id: string;
  sku: string;
  label: string;
  price_paise: number;
  sale_price_paise: number | null;
  stock_quantity: number | null;
  is_available: boolean;
  images: unknown;
  product_name: string;
  category: string;
  hsn_code: string | null;
  gst_rate_bp: number | null;
  is_active: boolean;
}

export interface QuoteItem {
  variantId: string;
  productId: string;
  productName: string;
  variantLabel: string;
  sku: string;
  category: string;
  hsnCode: string | null;
  gstRateBp: number | null;
  image: string;
  qty: number;
  unitPricePaise: number;
  listPricePaise: number;
}

export interface Quote {
  settings: StoreSettings;
  items: QuoteItem[];
  pricing: PricingResult | null;
  coupon: { code: string; percent: number } | null;
  issues: CheckoutIssue[];
}

function firstImage(images: unknown): string {
  if (Array.isArray(images)) {
    const front = images.find((i) => i && typeof i === "object" && (i as { kind?: string }).kind === "front") ?? images[0];
    if (front && typeof front === "object" && typeof (front as { src?: unknown }).src === "string") return (front as { src: string }).src;
  }
  return "";
}

export function shippingFor(settings: StoreSettings, goodsAfterDiscountPaise: number): number {
  const flat = rupeesToPaise(settings.shipping.flatFee);
  if (flat === 0) return 0;
  if (settings.shipping.freeAbove != null && goodsAfterDiscountPaise >= rupeesToPaise(settings.shipping.freeAbove)) return 0;
  return flat;
}

export async function buildQuote(input: Pick<QuoteInput, "lines" | "couponCode" | "state">): Promise<Quote> {
  const settings = await getSettings();

  const requested = new Map<string, number>();
  for (const l of input.lines) {
    requested.set(l.variantId, Math.min(MAX_QTY_PER_LINE, (requested.get(l.variantId) ?? 0) + l.qty));
  }

  const rows = await query<VariantRow>(
    `SELECT v.id, v.product_id, v.sku, v.label, v.price_paise, v.sale_price_paise, v.stock_quantity, v.is_available, v.images,
            p.name AS product_name, p.category, p.hsn_code, p.gst_rate_bp, p.is_active
       FROM product_variants v JOIN products p ON p.id = v.product_id
      WHERE v.id = ANY($1::text[])`,
    [[...requested.keys()]],
  );
  const byId = new Map(rows.map((r) => [r.id, r]));

  const issues: CheckoutIssue[] = [];
  const items: QuoteItem[] = [];
  for (const [variantId, qty] of requested) {
    const r = byId.get(variantId);
    if (!r || !r.is_active) {
      issues.push({ variantId, code: "unknown_product", message: "An item in your cart is no longer available." });
      continue;
    }
    const name = `${r.product_name} (${r.label})`;
    if (!isInStock(r)) {
      issues.push({ variantId, code: "unavailable", message: `${name} is out of stock.` });
      continue;
    }
    if (r.stock_quantity !== null && qty > r.stock_quantity) {
      issues.push({ variantId, code: "stock", message: `Only ${r.stock_quantity} of ${name} left in stock.` });
      continue;
    }
    items.push({
      variantId,
      productId: r.product_id,
      productName: r.product_name,
      variantLabel: r.label,
      sku: r.sku,
      category: r.category,
      hsnCode: r.hsn_code,
      gstRateBp: r.gst_rate_bp,
      image: firstImage(r.images),
      qty,
      unitPricePaise: effectivePricePaise(r.price_paise, r.sale_price_paise),
      listPricePaise: r.price_paise,
    });
  }

  // The one coupon the storefront supports lives in siteConfig.promo (same rule as the cart UI).
  let coupon: Quote["coupon"] = null;
  const code = input.couponCode?.trim();
  if (code) {
    const promo = siteConfig.promo;
    if (promo.enabled && code.toUpperCase() === promo.code.toUpperCase()) coupon = { code: promo.code, percent: promo.discountPercent };
    else issues.push({ code: "coupon", message: `"${code}" is not a valid coupon code.` });
  }

  let pricing: PricingResult | null = null;
  if (items.length > 0) {
    const subtotal = items.reduce((n, i) => n + i.unitPricePaise * i.qty, 0);
    const discount = discountForPercent(subtotal, coupon?.percent ?? 0);
    try {
      pricing = priceOrder({
        lines: items.map((i) => ({ qty: i.qty, unitPricePaise: i.unitPricePaise, gstRateBp: i.gstRateBp })),
        discountPercent: coupon?.percent ?? 0,
        shippingPaise: shippingFor(settings, subtotal - discount),
        tax: taxSettingsOf(settings),
        // Totals do not depend on the split, so before the address is known use the business state.
        placeOfSupplyState: input.state || settings.gst.businessState || null,
      });
    } catch (err) {
      if (err instanceof TaxConfigError) {
        throw new BusinessRuleError("The store's tax settings are incomplete. Please contact us to place this order.");
      }
      throw err;
    }
  }

  return { settings, items, pricing, coupon, issues };
}

/** What the browser is allowed to see about a quote. */
export function toClientQuote(q: Quote) {
  const p = q.pricing;
  return {
    lines: q.items.map((i) => ({
      variantId: i.variantId,
      productName: i.productName,
      variantLabel: i.variantLabel,
      image: i.image,
      qty: i.qty,
      unitPricePaise: i.unitPricePaise,
    })),
    subtotalPaise: p?.subtotalPaise ?? 0,
    discountPaise: p?.discountPaise ?? 0,
    shippingPaise: p?.shippingPaise ?? 0,
    taxPaise: p?.taxPaise ?? 0,
    totalPaise: p?.totalPaise ?? 0,
    gstEnabled: q.settings.gst.enabled,
    pricesIncludeGst: q.settings.gst.pricesIncludeGst,
    couponCode: q.coupon?.code ?? null,
    couponPercent: q.coupon?.percent ?? null,
    issues: q.issues,
  };
}

export interface CreatedOrder {
  orderId: string;
  orderNumber: string;
  publicToken: string;
  totalPaise: number;
  gatewayOrderId: string;
  keyId: string;
}

/**
 * Create the order (status: awaiting payment) and its gateway order. The order is
 * NOT paid until the payment is verified server-side (checkout callback signature +
 * gateway lookup, or the signed webhook).
 */
export async function createOrder(input: CheckoutInput): Promise<CreatedOrder> {
  if (!isPaymentConfigured()) throw new PaymentsNotConfiguredError();

  const quote = await buildQuote({ lines: input.lines, couponCode: input.couponCode, state: input.shipping.state });
  if (quote.issues.length > 0 || !quote.pricing) {
    throw new CheckoutBlockedError(quote.issues.length ? quote.issues : [{ code: "unknown_product", message: "Your cart is empty." }]);
  }
  const pricing = quote.pricing;
  if (input.expectedTotalPaise !== undefined && input.expectedTotalPaise !== pricing.totalPaise) {
    throw new PriceChangedError(toClientQuote(quote));
  }
  if (pricing.totalPaise < MIN_ORDER_PAISE) throw new BusinessRuleError("The order total must be at least ₹1.");

  const { settings } = quote;
  const billing = input.billingSameAsShipping || !input.billing ? input.shipping : input.billing;
  const publicToken = randomBytes(18).toString("base64url");

  const created = await tx(async (db) => {
    const order = await db.queryOne<{ id: string; order_number: string }>(
      `INSERT INTO orders (
         public_token, customer_name, customer_email, customer_phone,
         shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_pincode,
         billing_name, billing_phone, billing_line1, billing_line2, billing_city, billing_state, billing_pincode,
         customer_note, coupon_code, subtotal_paise, discount_paise, shipping_paise, tax_paise, total_paise,
         gst_enabled, prices_include_gst, seller_gstin, seller_state, gateway)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,'razorpay')
       RETURNING id, order_number`,
      [
        publicToken, input.customer.name, input.customer.email, input.customer.phone,
        input.shipping.name, input.shipping.phone, input.shipping.line1, input.shipping.line2, input.shipping.city, input.shipping.state, input.shipping.pincode,
        billing.name, billing.phone, billing.line1, billing.line2, billing.city, billing.state, billing.pincode,
        input.note, quote.coupon?.code ?? null, pricing.subtotalPaise, pricing.discountPaise, pricing.shippingPaise, pricing.taxPaise, pricing.totalPaise,
        settings.gst.enabled, settings.gst.pricesIncludeGst, settings.gst.gstin || null, settings.gst.businessState || null,
      ],
    );
    if (!order) throw new Error("Order insert returned no row");

    for (const [i, item] of quote.items.entries()) {
      const l = pricing.lines[i];
      await db.query(
        `INSERT INTO order_items (
           order_id, position, product_id, variant_id, product_name, variant_label, sku, category, hsn_code, image,
           qty, unit_price_paise, list_price_paise, gross_paise, discount_paise,
           gst_applied, gst_rate_bp, taxable_paise, cgst_paise, sgst_paise, igst_paise, tax_paise, total_paise)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
        [
          order.id, i, item.productId, item.variantId, item.productName, item.variantLabel, item.sku, item.category, item.hsnCode, item.image,
          item.qty, item.unitPricePaise, item.listPricePaise, l.grossPaise, l.discountPaise,
          l.gstApplied, l.gstRateBp, l.taxablePaise, l.cgstPaise, l.sgstPaise, l.igstPaise, l.taxPaise, l.totalPaise,
        ],
      );
    }
    await logEvent(db, order.id, "created", `Order placed online. Awaiting payment of ₹${(pricing.totalPaise / 100).toFixed(2)}.`, "customer");
    return order;
  });

  try {
    const gatewayOrder = await createGatewayOrder({
      amountPaise: pricing.totalPaise,
      receipt: created.order_number,
      notes: { order_number: created.order_number },
    });
    if (gatewayOrder.amount !== pricing.totalPaise || gatewayOrder.currency !== "INR" || !gatewayOrder.id) {
      throw new GatewayError("The payment gateway returned an order that does not match.", 502);
    }
    await query("UPDATE orders SET gateway_order_id = $2, updated_at = now() WHERE id = $1", [created.id, gatewayOrder.id]);

    const creds = credentials();
    if (!creds) throw new PaymentsNotConfiguredError();
    return {
      orderId: created.id,
      orderNumber: created.order_number,
      publicToken,
      totalPaise: pricing.totalPaise,
      gatewayOrderId: gatewayOrder.id,
      keyId: creds.keyId,
    };
  } catch (err) {
    // No dangling "awaiting payment" order when we never managed to open a payment.
    await tx(async (db) => {
      await db.query(
        `UPDATE orders SET fulfilment_status = 'cancelled', cancelled_at = now(),
                cancel_reason = 'Could not start payment (gateway error)', updated_at = now()
          WHERE id = $1 AND payment_status = 'pending' AND gateway_order_id IS NULL`,
        [created.id],
      );
      await logEvent(db, created.id, "gateway_error", "Could not create the payment gateway order; order cancelled automatically.");
    }).catch((e) => console.error("[checkout] failed to cancel order after gateway error:", e));
    throw err;
  }
}
