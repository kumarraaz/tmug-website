import "server-only";
import type { Queryable } from "./db";

/** Building blocks shared by checkout, payment verification, webhooks and admin order actions. */

export type FulfilmentStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "partially_refunded" | "refunded";

export const FULFILMENT_STATUSES: FulfilmentStatus[] = ["new", "processing", "shipped", "delivered", "cancelled"];
export const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "partially_refunded", "refunded"];

export const FULFILMENT_LABEL: Record<FulfilmentStatus, string> = {
  new: "New",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  partially_refunded: "Partially refunded",
  refunded: "Refunded",
};

/** Payment statuses that mean "money was received for this order" (counted as sales). */
export const SALE_PAYMENT_STATUSES: PaymentStatus[] = ["paid", "partially_refunded", "refunded"];

/** Append an entry to an order's audit trail. */
export async function logEvent(db: Queryable, orderId: string, type: string, message: string, actor = "system"): Promise<void> {
  await db.query("INSERT INTO order_events (order_id, type, message, actor) VALUES ($1, $2, $3, $4)", [
    orderId,
    type,
    message.slice(0, 500),
    actor,
  ]);
}

/**
 * Recalculate an order's (and its payments') refund totals and payment status from
 * the refund records — the single source of truth. Call inside a transaction.
 */
export async function recomputeRefunds(db: Queryable, orderId: string): Promise<{ refundedPaise: number; paymentStatus: PaymentStatus } | null> {
  const order = await db.queryOne<{ total_paise: number; payment_status: PaymentStatus }>(
    "SELECT total_paise, payment_status FROM orders WHERE id = $1 FOR UPDATE",
    [orderId],
  );
  if (!order) return null;

  const row = await db.queryOne<{ total: number }>(
    "SELECT COALESCE(SUM(amount_paise), 0)::bigint AS total FROM refunds WHERE order_id = $1 AND status = 'processed'",
    [orderId],
  );
  const refundedPaise = Math.min(row?.total ?? 0, order.total_paise);

  let paymentStatus = order.payment_status;
  if (paymentStatus !== "pending") {
    paymentStatus = refundedPaise >= order.total_paise ? "refunded" : refundedPaise > 0 ? "partially_refunded" : "paid";
  }

  await db.query("UPDATE orders SET refunded_paise = $2, payment_status = $3, updated_at = now() WHERE id = $1", [
    orderId,
    refundedPaise,
    paymentStatus,
  ]);

  await db.query(
    `UPDATE payments p SET
        refunded_paise = LEAST(p.amount_paise, s.total),
        status = CASE WHEN s.total >= p.amount_paise THEN 'refunded'
                      WHEN s.total > 0 THEN 'partially_refunded'
                      ELSE 'captured' END,
        updated_at = now()
       FROM (
         SELECT p2.id, COALESCE((SELECT SUM(r.amount_paise) FROM refunds r WHERE r.payment_id = p2.id AND r.status = 'processed'), 0)::bigint AS total
           FROM payments p2 WHERE p2.order_id = $1
       ) s
      WHERE p.id = s.id AND p.status IN ('captured', 'partially_refunded', 'refunded')`,
    [orderId],
  );

  return { refundedPaise, paymentStatus };
}

interface StockItem {
  variant_id: string;
  qty: number;
  product_name: string;
  variant_label: string;
}

async function stockItems(db: Queryable, orderId: string): Promise<StockItem[]> {
  // Lock rows in a fixed order so two orders touching the same variants can never deadlock.
  return db.query<StockItem>(
    "SELECT variant_id, qty, product_name, variant_label FROM order_items WHERE order_id = $1 AND variant_id IS NOT NULL ORDER BY variant_id",
    [orderId],
  );
}

/**
 * Take the ordered quantities out of tracked stock. Untracked variants (stock NULL)
 * are skipped. Returns human-readable warnings when stock was insufficient (the
 * payment has already been captured, so we record it rather than refuse).
 */
export async function deductStock(db: Queryable, orderId: string): Promise<string[]> {
  const warnings: string[] = [];
  for (const item of await stockItems(db, orderId)) {
    const v = await db.queryOne<{ stock_quantity: number | null }>(
      "SELECT stock_quantity FROM product_variants WHERE id = $1 FOR UPDATE",
      [item.variant_id],
    );
    if (!v || v.stock_quantity === null) continue;
    if (v.stock_quantity < item.qty) {
      warnings.push(`Stock was short for ${item.product_name} (${item.variant_label}): had ${v.stock_quantity}, ordered ${item.qty}.`);
    }
    await db.query("UPDATE product_variants SET stock_quantity = GREATEST(stock_quantity - $2, 0), updated_at = now() WHERE id = $1", [
      item.variant_id,
      item.qty,
    ]);
  }
  return warnings;
}

/** Put the ordered quantities back into tracked stock (used when an order is cancelled). */
export async function restoreStock(db: Queryable, orderId: string): Promise<void> {
  for (const item of await stockItems(db, orderId)) {
    await db.query(
      "UPDATE product_variants SET stock_quantity = stock_quantity + $2, updated_at = now() WHERE id = $1 AND stock_quantity IS NOT NULL",
      [item.variant_id, item.qty],
    );
  }
}
