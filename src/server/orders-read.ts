import "server-only";
import type { DateRange } from "@/lib/dates";
import { isDatabaseConfigured, query, queryOne } from "./db";
import type { FulfilmentStatus, PaymentStatus } from "./order-core";

/** Read models for the order confirmation page and the admin Orders / Payments screens. */

const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");

/* ------------------------- public confirmation page ------------------------ */

export interface PublicOrderView {
  orderNumber: string;
  createdAt: Date;
  /** Minutes since the order was placed, measured when the page is built. */
  ageMinutes: number;
  customerName: string;
  emailMasked: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  gstEnabled: boolean;
  pricesIncludeGst: boolean;
  couponCode: string | null;
  items: { name: string; label: string; qty: number; unitPricePaise: number; totalPaise: number; image: string }[];
}

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "";
  return `${user.slice(0, 2)}${"•".repeat(Math.max(1, Math.min(6, user.length - 2)))}@${domain}`;
}

export async function getPublicOrder(token: string): Promise<PublicOrderView | null> {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  if (!isDatabaseConfigured()) return null; // no database → no orders → a plain 404, not a 500
  const o = await queryOne<{
    id: string; order_number: string; created_at: Date; customer_name: string; customer_email: string;
    shipping_city: string; shipping_state: string; shipping_pincode: string; payment_status: PaymentStatus; fulfilment_status: FulfilmentStatus;
    subtotal_paise: number; discount_paise: number; shipping_paise: number; tax_paise: number; total_paise: number;
    gst_enabled: boolean; prices_include_gst: boolean; coupon_code: string | null;
  }>("SELECT * FROM orders WHERE public_token = $1", [token]);
  if (!o) return null;
  const items = await query<{ product_name: string; variant_label: string; qty: number; unit_price_paise: number; gross_paise: number; discount_paise: number; image: string }>(
    "SELECT product_name, variant_label, qty, unit_price_paise, gross_paise, discount_paise, image FROM order_items WHERE order_id = $1 ORDER BY position",
    [o.id],
  );
  return {
    orderNumber: o.order_number,
    createdAt: o.created_at,
    ageMinutes: (Date.now() - o.created_at.getTime()) / 60000,
    customerName: o.customer_name,
    emailMasked: maskEmail(o.customer_email),
    shippingCity: o.shipping_city,
    shippingState: o.shipping_state,
    shippingPincode: o.shipping_pincode,
    paymentStatus: o.payment_status,
    fulfilmentStatus: o.fulfilment_status,
    subtotalPaise: o.subtotal_paise,
    discountPaise: o.discount_paise,
    shippingPaise: o.shipping_paise,
    taxPaise: o.tax_paise,
    totalPaise: o.total_paise,
    gstEnabled: o.gst_enabled,
    pricesIncludeGst: o.prices_include_gst,
    couponCode: o.coupon_code,
    items: items.map((i) => ({
      name: i.product_name,
      label: i.variant_label,
      qty: i.qty,
      unitPricePaise: i.unit_price_paise,
      totalPaise: i.gross_paise,
      image: i.image,
    })),
  };
}

/* --------------------------------- admin --------------------------------- */

export interface OrderListFilters {
  search?: string;
  payment?: PaymentStatus | "all";
  fulfilment?: FulfilmentStatus | "all";
  range?: DateRange | null;
  page: number;
  pageSize: number;
}

export interface OrderListRow {
  id: string;
  orderNumber: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemCount: number;
  totalPaise: number;
  refundedPaise: number;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  paymentMethod: string | null;
  invoiceNumber: string | null;
  /** Cancelled after payment but not (fully) refunded yet. */
  needsRefund: boolean;
}

export async function listOrders(f: OrderListFilters): Promise<{ rows: OrderListRow[]; total: number }> {
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, value: unknown) => {
    params.push(value);
    where.push(sql.replace("?", `$${params.length}`));
  };

  const search = f.search?.trim();
  if (search) {
    params.push(`%${escapeLike(search)}%`);
    const n = params.length;
    where.push(
      `(o.order_number ILIKE $${n} OR o.customer_name ILIKE $${n} OR o.customer_email ILIKE $${n} OR o.customer_phone ILIKE $${n}
        OR o.invoice_number ILIKE $${n} OR EXISTS (SELECT 1 FROM payments p WHERE p.order_id = o.id AND p.gateway_payment_id ILIKE $${n}))`,
    );
  }
  if (f.payment && f.payment !== "all") add("o.payment_status = ?", f.payment);
  if (f.fulfilment && f.fulfilment !== "all") add("o.fulfilment_status = ?", f.fulfilment);
  if (f.range) {
    add("o.created_at >= ?", f.range.start);
    add("o.created_at < ?", f.range.endExclusive);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const count = await queryOne<{ n: number }>(`SELECT COUNT(*)::int AS n FROM orders o ${whereSql}`, params);
  const limit = Math.max(1, Math.min(100, f.pageSize));
  const offset = Math.max(0, (f.page - 1) * limit);

  const rows = await query<{
    id: string; order_number: string; created_at: Date; customer_name: string; customer_email: string; customer_phone: string;
    item_count: number; total_paise: number; refunded_paise: number; payment_status: PaymentStatus; fulfilment_status: FulfilmentStatus;
    payment_method: string | null; invoice_number: string | null;
  }>(
    `SELECT o.id, o.order_number, o.created_at, o.customer_name, o.customer_email, o.customer_phone,
            COALESCE((SELECT SUM(qty) FROM order_items i WHERE i.order_id = o.id), 0)::int AS item_count,
            o.total_paise, o.refunded_paise, o.payment_status, o.fulfilment_status, o.payment_method, o.invoice_number
       FROM orders o ${whereSql}
      ORDER BY o.created_at DESC, o.order_number DESC
      LIMIT ${limit} OFFSET ${offset}`,
    params,
  );

  return {
    total: count?.n ?? 0,
    rows: rows.map((r) => ({
      id: r.id,
      orderNumber: r.order_number,
      createdAt: r.created_at,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      itemCount: r.item_count,
      totalPaise: r.total_paise,
      refundedPaise: r.refunded_paise,
      paymentStatus: r.payment_status,
      fulfilmentStatus: r.fulfilment_status,
      paymentMethod: r.payment_method,
      invoiceNumber: r.invoice_number,
      needsRefund: r.fulfilment_status === "cancelled" && (r.payment_status === "paid" || r.payment_status === "partially_refunded") && r.refunded_paise < r.total_paise,
    })),
  };
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  publicToken: string;
  createdAt: Date;
  customer: { name: string; email: string; phone: string };
  shipping: { name: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string };
  billing: { name: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string };
  customerNote: string;
  couponCode: string | null;
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  gstEnabled: boolean;
  pricesIncludeGst: boolean;
  sellerGstin: string | null;
  sellerState: string | null;
  fulfilmentStatus: FulfilmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  paidAt: Date | null;
  refundedPaise: number;
  cancelledAt: Date | null;
  cancelReason: string | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  trackingReference: string | null;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  adminNote: string;
  gatewayOrderId: string | null;
  items: {
    id: string; productId: string | null; name: string; label: string; sku: string; hsnCode: string | null; image: string; qty: number;
    unitPricePaise: number; grossPaise: number; discountPaise: number; gstApplied: boolean; gstRateBp: number | null;
    taxablePaise: number; cgstPaise: number; sgstPaise: number; igstPaise: number; taxPaise: number; totalPaise: number;
  }[];
  payments: {
    id: string; gatewayPaymentId: string | null; method: string | null; status: string; amountPaise: number; refundedPaise: number;
    paidAt: Date | null; verifiedVia: string | null; failureReason: string | null; createdAt: Date;
  }[];
  refunds: { id: string; amountPaise: number; reason: string; status: string; reference: string | null; source: string; refundedAt: Date }[];
  events: { id: number; at: Date; type: string; message: string; actor: string }[];
}

/** Columns of `orders`, as returned by `SELECT *`. */
interface OrderDbRow {
  id: string; order_number: string; public_token: string; created_at: Date;
  customer_name: string; customer_email: string; customer_phone: string;
  shipping_name: string; shipping_phone: string; shipping_line1: string; shipping_line2: string; shipping_city: string; shipping_state: string; shipping_pincode: string;
  billing_name: string; billing_phone: string; billing_line1: string; billing_line2: string; billing_city: string; billing_state: string; billing_pincode: string;
  customer_note: string; coupon_code: string | null;
  subtotal_paise: number; discount_paise: number; shipping_paise: number; tax_paise: number; total_paise: number;
  gst_enabled: boolean; prices_include_gst: boolean; seller_gstin: string | null; seller_state: string | null;
  fulfilment_status: FulfilmentStatus; payment_status: PaymentStatus; payment_method: string | null;
  paid_at: Date | null; refunded_paise: number; cancelled_at: Date | null; cancel_reason: string | null;
  shipped_at: Date | null; delivered_at: Date | null; tracking_reference: string | null;
  invoice_number: string | null; invoice_date: string | null; admin_note: string; gateway_order_id: string | null;
}
interface OrderItemDbRow {
  id: string; product_id: string | null; product_name: string; variant_label: string; sku: string; hsn_code: string | null; image: string; qty: number;
  unit_price_paise: number; gross_paise: number; discount_paise: number; gst_applied: boolean; gst_rate_bp: number | null;
  taxable_paise: number; cgst_paise: number; sgst_paise: number; igst_paise: number; tax_paise: number; total_paise: number;
}
interface PaymentDbRow {
  id: string; gateway_payment_id: string | null; method: string | null; status: string; amount_paise: number; refunded_paise: number;
  paid_at: Date | null; verified_via: string | null; failure_reason: string | null; created_at: Date;
}
interface RefundDbRow { id: string; amount_paise: number; reason: string; status: string; reference: string | null; source: string; refunded_at: Date }
interface EventDbRow { id: number; at: Date; type: string; message: string; actor: string }

export async function getOrderDetail(id: string): Promise<OrderDetail | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const o = await queryOne<OrderDbRow>("SELECT * FROM orders WHERE id = $1", [id]);
  if (!o) return null;
  const [items, payments, refunds, events] = await Promise.all([
    query<OrderItemDbRow>("SELECT * FROM order_items WHERE order_id = $1 ORDER BY position", [id]),
    query<PaymentDbRow>("SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at", [id]),
    query<RefundDbRow>("SELECT * FROM refunds WHERE order_id = $1 ORDER BY refunded_at", [id]),
    query<EventDbRow>("SELECT * FROM order_events WHERE order_id = $1 ORDER BY at, id", [id]),
  ]);

  return {
    id: o.id,
    orderNumber: o.order_number,
    publicToken: o.public_token,
    createdAt: o.created_at,
    customer: { name: o.customer_name, email: o.customer_email, phone: o.customer_phone },
    shipping: { name: o.shipping_name, phone: o.shipping_phone, line1: o.shipping_line1, line2: o.shipping_line2, city: o.shipping_city, state: o.shipping_state, pincode: o.shipping_pincode },
    billing: { name: o.billing_name, phone: o.billing_phone, line1: o.billing_line1, line2: o.billing_line2, city: o.billing_city, state: o.billing_state, pincode: o.billing_pincode },
    customerNote: o.customer_note,
    couponCode: o.coupon_code,
    subtotalPaise: o.subtotal_paise,
    discountPaise: o.discount_paise,
    shippingPaise: o.shipping_paise,
    taxPaise: o.tax_paise,
    totalPaise: o.total_paise,
    gstEnabled: o.gst_enabled,
    pricesIncludeGst: o.prices_include_gst,
    sellerGstin: o.seller_gstin,
    sellerState: o.seller_state,
    fulfilmentStatus: o.fulfilment_status,
    paymentStatus: o.payment_status,
    paymentMethod: o.payment_method,
    paidAt: o.paid_at,
    refundedPaise: o.refunded_paise,
    cancelledAt: o.cancelled_at,
    cancelReason: o.cancel_reason,
    shippedAt: o.shipped_at,
    deliveredAt: o.delivered_at,
    trackingReference: o.tracking_reference,
    invoiceNumber: o.invoice_number,
    invoiceDate: o.invoice_date,
    adminNote: o.admin_note,
    gatewayOrderId: o.gateway_order_id,
    items: items.map((i) => ({
      id: i.id, productId: i.product_id, name: i.product_name, label: i.variant_label, sku: i.sku, hsnCode: i.hsn_code, image: i.image, qty: i.qty,
      unitPricePaise: i.unit_price_paise, grossPaise: i.gross_paise, discountPaise: i.discount_paise, gstApplied: i.gst_applied, gstRateBp: i.gst_rate_bp,
      taxablePaise: i.taxable_paise, cgstPaise: i.cgst_paise, sgstPaise: i.sgst_paise, igstPaise: i.igst_paise, taxPaise: i.tax_paise, totalPaise: i.total_paise,
    })),
    payments: payments.map((p) => ({
      id: p.id, gatewayPaymentId: p.gateway_payment_id, method: p.method, status: p.status, amountPaise: p.amount_paise, refundedPaise: p.refunded_paise,
      paidAt: p.paid_at, verifiedVia: p.verified_via, failureReason: p.failure_reason, createdAt: p.created_at,
    })),
    refunds: refunds.map((r) => ({ id: r.id, amountPaise: r.amount_paise, reason: r.reason, status: r.status, reference: r.reference, source: r.source, refundedAt: r.refunded_at })),
    events: events.map((e) => ({ id: Number(e.id), at: e.at, type: e.type, message: e.message, actor: e.actor })),
  };
}

/* ------------------------------ payments ledger ------------------------------ */

export interface PaymentListFilters {
  range?: DateRange | null;
  status?: string;
  method?: string;
  page: number;
  pageSize: number;
}

export interface PaymentRow {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  gatewayPaymentId: string | null;
  method: string | null;
  status: string;
  amountPaise: number;
  refundedPaise: number;
  paidAt: Date | null;
  createdAt: Date;
  verifiedVia: string | null;
}

export async function listPayments(f: PaymentListFilters): Promise<{
  rows: PaymentRow[];
  total: number;
  totals: { receivedPaise: number; refundedPaise: number };
}> {
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, value: unknown) => {
    params.push(value);
    where.push(sql.replace("?", `$${params.length}`));
  };
  if (f.range) {
    add("COALESCE(p.paid_at, p.created_at) >= ?", f.range.start);
    add("COALESCE(p.paid_at, p.created_at) < ?", f.range.endExclusive);
  }
  if (f.status && f.status !== "all") add("p.status = ?", f.status);
  if (f.method && f.method !== "all") add("p.method = ?", f.method);
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const agg = await queryOne<{ n: number; received: number; refunded: number }>(
    `SELECT COUNT(*)::int AS n,
            COALESCE(SUM(p.amount_paise) FILTER (WHERE p.status IN ('captured','partially_refunded','refunded')), 0)::bigint AS received,
            COALESCE(SUM(p.refunded_paise) FILTER (WHERE p.status IN ('captured','partially_refunded','refunded')), 0)::bigint AS refunded
       FROM payments p ${whereSql}`,
    params,
  );

  const limit = Math.max(1, Math.min(100, f.pageSize));
  const offset = Math.max(0, (f.page - 1) * limit);
  const rows = await query<{
    id: string; order_id: string; order_number: string; customer_name: string; gateway_payment_id: string | null; method: string | null;
    status: string; amount_paise: number; refunded_paise: number; paid_at: Date | null; created_at: Date; verified_via: string | null;
  }>(
    `SELECT p.id, p.order_id, o.order_number, o.customer_name, p.gateway_payment_id, p.method, p.status, p.amount_paise,
            p.refunded_paise, p.paid_at, p.created_at, p.verified_via
       FROM payments p JOIN orders o ON o.id = p.order_id ${whereSql}
      ORDER BY COALESCE(p.paid_at, p.created_at) DESC, p.id
      LIMIT ${limit} OFFSET ${offset}`,
    params,
  );

  return {
    total: agg?.n ?? 0,
    totals: { receivedPaise: agg?.received ?? 0, refundedPaise: agg?.refunded ?? 0 },
    rows: rows.map((r) => ({
      id: r.id,
      orderId: r.order_id,
      orderNumber: r.order_number,
      customerName: r.customer_name,
      gatewayPaymentId: r.gateway_payment_id,
      method: r.method,
      status: r.status,
      amountPaise: r.amount_paise,
      refundedPaise: r.refunded_paise,
      paidAt: r.paid_at,
      createdAt: r.created_at,
      verifiedVia: r.verified_via,
    })),
  };
}

export async function paymentMethods(): Promise<string[]> {
  const rows = await query<{ method: string }>("SELECT DISTINCT method FROM payments WHERE method IS NOT NULL ORDER BY method");
  return rows.map((r) => r.method);
}
