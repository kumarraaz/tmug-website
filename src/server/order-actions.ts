import "server-only";
import { startOfIstDay } from "@/lib/dates";
import { tx, type Queryable } from "./db";
import { BusinessRuleError, NotFoundError } from "./errors";
import {
  FULFILMENT_LABEL,
  logEvent,
  recomputeRefunds,
  restoreStock,
  type FulfilmentStatus,
  type PaymentStatus,
} from "./order-core";

/**
 * Admin actions on existing orders. Financial history is never deleted: orders
 * are only moved forward, cancelled, annotated, or refunded (refunds are separate records).
 */

interface LockedOrder {
  id: string;
  order_number: string;
  total_paise: number;
  refunded_paise: number;
  payment_status: PaymentStatus;
  fulfilment_status: FulfilmentStatus;
  stock_deducted: boolean;
  shipped_at: Date | null;
}

async function lockOrder(db: Queryable, id: string): Promise<LockedOrder> {
  const order = await db.queryOne<LockedOrder>(
    `SELECT id, order_number, total_paise, refunded_paise, payment_status, fulfilment_status, stock_deducted, shipped_at
       FROM orders WHERE id = $1 FOR UPDATE`,
    [id],
  );
  if (!order) throw new NotFoundError("Order not found.");
  return order;
}

const FLOW: FulfilmentStatus[] = ["new", "processing", "shipped", "delivered"];

/** Move an order forward (new → processing → shipped → delivered). Use cancelOrder() to cancel. */
export async function updateFulfilmentStatus(
  orderId: string,
  next: Exclude<FulfilmentStatus, "cancelled">,
  trackingReference: string | null | undefined,
  actor = "admin",
): Promise<void> {
  return tx(async (db) => {
    const order = await lockOrder(db, orderId);

    if (order.fulfilment_status === "cancelled") throw new BusinessRuleError("A cancelled order cannot be reopened.");
    const from = FLOW.indexOf(order.fulfilment_status);
    const to = FLOW.indexOf(next);
    if (to < from) throw new BusinessRuleError("An order's status cannot move backwards.");
    if (to > FLOW.indexOf("processing") && order.payment_status === "pending") {
      throw new BusinessRuleError("Payment has not been received for this order yet, so it cannot be shipped or delivered.");
    }
    if (to > FLOW.indexOf("processing") && order.payment_status === "refunded") {
      throw new BusinessRuleError("This order has been fully refunded.");
    }

    const tracking = trackingReference === undefined ? undefined : trackingReference?.trim() || null;
    if (to === from && tracking === undefined) return;

    await db.query(
      `UPDATE orders SET fulfilment_status = $2,
              shipped_at = CASE WHEN $2 IN ('shipped', 'delivered') THEN COALESCE(shipped_at, now()) ELSE shipped_at END,
              delivered_at = CASE WHEN $2 = 'delivered' THEN COALESCE(delivered_at, now()) ELSE delivered_at END,
              tracking_reference = CASE WHEN $3::boolean THEN $4 ELSE tracking_reference END,
              updated_at = now()
        WHERE id = $1`,
      [orderId, next, tracking !== undefined, tracking ?? null],
    );
    if (to !== from) await logEvent(db, orderId, "status", `Order status changed from ${FULFILMENT_LABEL[order.fulfilment_status]} to ${FULFILMENT_LABEL[next]}.`, actor);
    if (tracking !== undefined) await logEvent(db, orderId, "tracking", tracking ? `Tracking reference set to "${tracking}".` : "Tracking reference cleared.", actor);
  });
}

export interface CancelResult {
  stockChanged: boolean;
  /** Money was received and has not been fully refunded — the admin should record a refund. */
  refundRequired: boolean;
}

export async function cancelOrder(orderId: string, reason: string, actor = "admin"): Promise<CancelResult> {
  return tx(async (db) => {
    const order = await lockOrder(db, orderId);
    if (order.fulfilment_status === "cancelled") throw new BusinessRuleError("This order is already cancelled.");
    if (order.fulfilment_status === "delivered") {
      throw new BusinessRuleError("A delivered order cannot be cancelled. Record a refund instead if the customer returned it.");
    }

    await db.query(
      "UPDATE orders SET fulfilment_status = 'cancelled', cancelled_at = now(), cancel_reason = $2, updated_at = now() WHERE id = $1",
      [orderId, reason.trim() || null],
    );

    let stockChanged = false;
    if (order.stock_deducted) {
      await restoreStock(db, orderId);
      await db.query("UPDATE orders SET stock_deducted = false WHERE id = $1", [orderId]);
      stockChanged = true;
    }

    const moneyHeld = (order.payment_status === "paid" || order.payment_status === "partially_refunded") && order.refunded_paise < order.total_paise;
    await logEvent(db, orderId, "cancelled", `Order cancelled${reason.trim() ? `: ${reason.trim()}` : ""}.${moneyHeld ? " Payment was received — record a refund." : ""}`, actor);
    return { stockChanged, refundRequired: moneyHeld };
  });
}

export interface OrderMetaInput {
  invoiceNumber?: string | null;
  /** "YYYY-MM-DD" */
  invoiceDate?: string | null;
  adminNote?: string;
}

/** Invoice number / date are entered by the admin (taken from their invoicing records) — never generated here. */
export async function updateOrderMeta(orderId: string, input: OrderMetaInput, actor = "admin"): Promise<void> {
  return tx(async (db) => {
    await lockOrder(db, orderId);
    const sets: string[] = [];
    const params: unknown[] = [orderId];
    const set = (column: string, value: unknown) => {
      params.push(value);
      sets.push(`${column} = $${params.length}`);
    };
    if (input.invoiceNumber !== undefined) set("invoice_number", input.invoiceNumber?.trim() || null);
    if (input.invoiceDate !== undefined) set("invoice_date", input.invoiceDate || null);
    if (input.adminNote !== undefined) set("admin_note", input.adminNote.trim());
    if (sets.length === 0) return;
    await db.query(`UPDATE orders SET ${sets.join(", ")}, updated_at = now() WHERE id = $1`, params);
    if (input.invoiceNumber !== undefined) {
      await logEvent(db, orderId, "invoice", input.invoiceNumber?.trim() ? `Invoice number recorded: ${input.invoiceNumber.trim()}.` : "Invoice number cleared.", actor);
    }
  });
}

export interface RefundInput {
  amountPaise: number;
  reason: string;
  /** Gateway refund id or bank / UPI reference, if any. */
  reference?: string | null;
  /** "YYYY-MM-DD" (IST) the refund was actually made; defaults to now. */
  refundedOn?: string | null;
}

/**
 * Record a refund that was paid out to the customer (via the payment gateway dashboard,
 * UPI or bank transfer). This does NOT move money — it keeps the books in sync.
 * Refunds made from the Razorpay dashboard are also recorded automatically by the webhook.
 */
export async function recordRefund(orderId: string, input: RefundInput, actor = "admin"): Promise<void> {
  return tx(async (db) => {
    const order = await lockOrder(db, orderId);
    if (order.payment_status !== "paid" && order.payment_status !== "partially_refunded") {
      throw new BusinessRuleError("Only an order that has been paid can be refunded.");
    }
    const refundable = order.total_paise - order.refunded_paise;
    if (input.amountPaise <= 0) throw new BusinessRuleError("Enter a refund amount greater than zero.");
    if (input.amountPaise > refundable) {
      throw new BusinessRuleError(`The refund exceeds the refundable balance of ₹${(refundable / 100).toFixed(2)}.`);
    }

    let refundedAt = new Date();
    if (input.refundedOn) {
      const [y, m, d] = input.refundedOn.split("-").map(Number);
      const at = new Date(startOfIstDay(y, m, d).getTime() + 12 * 60 * 60 * 1000); // noon IST on that day
      if (at.getTime() > Date.now()) throw new BusinessRuleError("The refund date cannot be in the future.");
      refundedAt = at;
    }

    const payment = await db.queryOne<{ id: string }>(
      "SELECT id FROM payments WHERE order_id = $1 AND status IN ('captured', 'partially_refunded') ORDER BY paid_at NULLS LAST LIMIT 1",
      [orderId],
    );
    await db.query(
      `INSERT INTO refunds (order_id, payment_id, amount_paise, reason, status, reference, source, refunded_at)
       VALUES ($1, $2, $3, $4, 'processed', $5, 'admin', $6)`,
      [orderId, payment?.id ?? null, input.amountPaise, input.reason.trim(), input.reference?.trim() || null, refundedAt],
    );
    await recomputeRefunds(db, orderId);
    await logEvent(db, orderId, "refund", `Refund of ₹${(input.amountPaise / 100).toFixed(2)} recorded${input.reason.trim() ? `: ${input.reason.trim()}` : ""}.`, actor);
  });
}
