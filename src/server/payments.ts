import "server-only";
import { createHash } from "node:crypto";
import { verifyCheckoutSignature, verifyWebhookSignature } from "@/lib/razorpay-signature";
import { query, queryOne, tx } from "./db";
import { BusinessRuleError, NotFoundError } from "./errors";
import { deductStock, logEvent, recomputeRefunds } from "./order-core";
import {
  PaymentsNotConfiguredError,
  captureGatewayPayment,
  credentials,
  fetchGatewayPayment,
  webhookSecret,
  type GatewayPayment,
  type GatewayRefund,
} from "./razorpay";

/**
 * Payment verification. An order becomes PAID only here, and only when:
 *   - the checkout callback carries a valid HMAC signature for OUR stored gateway
 *     order id AND the gateway itself confirms the payment (server-to-server), or
 *   - a correctly signed webhook says so,
 * and in every case the payment's order id, amount and currency match the order.
 * Reaching a "success" page proves nothing and changes nothing.
 */

interface OrderRow {
  id: string;
  order_number: string;
  total_paise: number;
  payment_status: string;
  fulfilment_status: string;
  gateway_order_id: string | null;
  stock_deducted: boolean;
}

const ORDER_COLUMNS = "id, order_number, total_paise, payment_status, fulfilment_status, gateway_order_id, stock_deducted";

function assertPaymentMatchesOrder(order: Pick<OrderRow, "total_paise" | "gateway_order_id">, payment: GatewayPayment): void {
  if (!order.gateway_order_id || payment.order_id !== order.gateway_order_id) {
    throw new BusinessRuleError("This payment does not belong to this order.");
  }
  if (payment.amount !== order.total_paise || payment.currency !== "INR") {
    throw new BusinessRuleError("The payment amount does not match the order total.");
  }
}

/** If the gateway only "authorized" the payment (manual-capture accounts), capture it now. */
async function ensureCaptured(order: OrderRow, payment: GatewayPayment): Promise<GatewayPayment> {
  assertPaymentMatchesOrder(order, payment);
  if (payment.status !== "authorized") return payment;
  try {
    return await captureGatewayPayment(payment.id, order.total_paise);
  } catch {
    // Already captured by an automatic-capture setting, or a concurrent request: trust a fresh read.
    return fetchGatewayPayment(payment.id);
  }
}

export interface ApplyResult {
  /** true when this call moved the order from awaiting-payment to paid */
  changed: boolean;
  stockChanged: boolean;
}

/** Mark an order paid from a CAPTURED gateway payment. Idempotent and safe to call from both paths. */
export async function applyCapturedPayment(orderId: string, payment: GatewayPayment, via: "checkout" | "webhook"): Promise<ApplyResult> {
  if (payment.status !== "captured" && payment.status !== "refunded") {
    throw new BusinessRuleError("The payment has not been captured.");
  }
  return tx(async (db) => {
    const order = await db.queryOne<OrderRow>(`SELECT ${ORDER_COLUMNS} FROM orders WHERE id = $1 FOR UPDATE`, [orderId]);
    if (!order) throw new NotFoundError("Order not found.");
    assertPaymentMatchesOrder(order, payment);

    const paidAt = new Date((payment.created_at || Math.floor(Date.now() / 1000)) * 1000);
    await db.query(
      `INSERT INTO payments (order_id, gateway, gateway_order_id, gateway_payment_id, method, status, amount_paise, currency, paid_at, verified_at, verified_via)
       VALUES ($1, 'razorpay', $2, $3, $4, 'captured', $5, 'INR', $6, now(), $7)
       ON CONFLICT (gateway_payment_id) DO UPDATE SET
         method = COALESCE(EXCLUDED.method, payments.method),
         paid_at = COALESCE(payments.paid_at, EXCLUDED.paid_at),
         verified_at = COALESCE(payments.verified_at, now()),
         verified_via = COALESCE(payments.verified_via, EXCLUDED.verified_via),
         failure_reason = NULL,
         status = CASE WHEN payments.status IN ('refunded', 'partially_refunded') THEN payments.status ELSE 'captured' END,
         updated_at = now()`,
      [order.id, order.gateway_order_id, payment.id, payment.method ?? null, payment.amount, paidAt, via],
    );

    if (order.payment_status !== "pending") return { changed: false, stockChanged: false };

    await db.query("UPDATE orders SET payment_status = 'paid', paid_at = $2, payment_method = $3, updated_at = now() WHERE id = $1", [
      order.id,
      paidAt,
      payment.method ?? null,
    ]);
    await logEvent(db, order.id, "payment_captured", `Payment of ₹${(payment.amount / 100).toFixed(2)} verified (${payment.method ?? "method unknown"}, ${payment.id}) via ${via}.`);

    let stockChanged = false;
    if (order.fulfilment_status === "cancelled") {
      await logEvent(db, order.id, "attention", "Payment was received for an order that had already been cancelled. A refund is required.");
    } else if (!order.stock_deducted) {
      const warnings = await deductStock(db, order.id);
      await db.query("UPDATE orders SET stock_deducted = true WHERE id = $1", [order.id]);
      for (const w of warnings) await logEvent(db, order.id, "attention", w);
      stockChanged = true;
    }
    return { changed: true, stockChanged };
  });
}

/* ------------------------- checkout callback path ------------------------- */

export interface VerifyInput {
  publicToken: string;
  gatewayOrderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyResult {
  status: "paid" | "pending";
  orderNumber: string;
  stockChanged: boolean;
}

export async function verifyCheckoutPayment(input: VerifyInput): Promise<VerifyResult> {
  const creds = credentials();
  if (!creds) throw new PaymentsNotConfiguredError();

  const order = await queryOne<OrderRow>(`SELECT ${ORDER_COLUMNS} FROM orders WHERE public_token = $1`, [input.publicToken]);
  if (!order || !order.gateway_order_id) throw new NotFoundError("Order not found.");

  const reject = async (type: string, message: string): Promise<never> => {
    await tx((db) => logEvent(db, order.id, type, message)).catch(() => undefined);
    throw new BusinessRuleError(
      "We could not verify this payment. If money was deducted it will be reconciled automatically — please contact us with your order number.",
    );
  };

  if (input.gatewayOrderId !== order.gateway_order_id) {
    return reject("payment_rejected", "Checkout callback referenced a different gateway order than this order.");
  }
  // Signature is checked against the order id WE stored, not the one echoed by the browser.
  if (!verifyCheckoutSignature(order.gateway_order_id, input.paymentId, input.signature, creds.keySecret)) {
    return reject("payment_rejected", "Checkout callback signature did not verify.");
  }

  if (order.payment_status !== "pending") {
    return { status: "paid", orderNumber: order.order_number, stockChanged: false };
  }

  // The gateway is the source of truth for status, amount and order linkage.
  let payment = await fetchGatewayPayment(input.paymentId);
  try {
    payment = await ensureCaptured(order, payment);
  } catch (err) {
    if (err instanceof BusinessRuleError) {
      return reject("payment_rejected", `Gateway payment ${input.paymentId} did not match the order: ${err.message}`);
    }
    throw err;
  }

  if (payment.status !== "captured") {
    return { status: "pending", orderNumber: order.order_number, stockChanged: false };
  }
  const applied = await applyCapturedPayment(order.id, payment, "checkout");
  return { status: "paid", orderNumber: order.order_number, stockChanged: applied.stockChanged };
}

/* ------------------------------ webhook path ------------------------------ */

interface WebhookEnvelope {
  event?: string;
  payload?: {
    payment?: { entity?: GatewayPayment & { error_description?: string | null } };
    refund?: { entity?: GatewayRefund };
  };
}

export interface WebhookOutcome {
  status: number;
  body: Record<string, unknown>;
  stockChanged?: boolean;
}

async function recordFailedPayment(orderId: string, payment: GatewayPayment): Promise<void> {
  await tx(async (db) => {
    await db.query(
      `INSERT INTO payments (order_id, gateway, gateway_order_id, gateway_payment_id, method, status, amount_paise, currency, failure_reason)
       VALUES ($1, 'razorpay', $2, $3, $4, 'failed', $5, 'INR', $6)
       ON CONFLICT (gateway_payment_id) DO UPDATE SET
         status = CASE WHEN payments.status IN ('captured', 'refunded', 'partially_refunded') THEN payments.status ELSE 'failed' END,
         failure_reason = EXCLUDED.failure_reason, updated_at = now()`,
      [orderId, payment.order_id, payment.id, payment.method ?? null, payment.amount, (payment.error_description ?? payment.error_code ?? "Payment failed").slice(0, 300)],
    );
    await logEvent(db, orderId, "payment_failed", `Payment attempt ${payment.id} failed: ${payment.error_description ?? payment.error_code ?? "no reason given"}.`);
  });
}

async function applyGatewayRefund(refund: GatewayRefund): Promise<string> {
  return tx(async (db) => {
    const payment = await db.queryOne<{ id: string; order_id: string }>("SELECT id, order_id FROM payments WHERE gateway_payment_id = $1", [refund.payment_id]);
    if (!payment) return "ignored: no matching payment";
    await db.query(
      `INSERT INTO refunds (order_id, payment_id, amount_paise, reason, status, reference, source, refunded_at)
       VALUES ($1, $2, $3, 'Refund reported by payment gateway', $4, $5, 'webhook', to_timestamp($6))
       ON CONFLICT (reference) WHERE reference IS NOT NULL DO UPDATE SET status = EXCLUDED.status, amount_paise = EXCLUDED.amount_paise`,
      [payment.order_id, payment.id, refund.amount, refund.status, refund.id, refund.created_at || Math.floor(Date.now() / 1000)],
    );
    await recomputeRefunds(db, payment.order_id);
    await logEvent(db, payment.order_id, "refund", `Gateway refund ${refund.id} (${refund.status}) of ₹${(refund.amount / 100).toFixed(2)} recorded.`);
    return "refund recorded";
  });
}

export async function processRazorpayWebhook(rawBody: string, signature: string | null, eventIdHeader: string | null): Promise<WebhookOutcome> {
  const secret = webhookSecret();
  if (!secret) {
    return { status: 503, body: { error: "Webhook secret is not configured (RAZORPAY_WEBHOOK_SECRET)." } };
  }
  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return { status: 400, body: { error: "Invalid signature." } };
  }

  let envelope: WebhookEnvelope;
  try {
    envelope = JSON.parse(rawBody) as WebhookEnvelope;
  } catch {
    return { status: 400, body: { error: "Invalid JSON." } };
  }
  const eventType = envelope.event ?? "unknown";
  const eventId = eventIdHeader?.trim() || `sha256:${createHash("sha256").update(rawBody).digest("hex")}`;

  // Replay / retry protection: every event id is processed at most once.
  const seen = await queryOne<{ processed_at: Date | null }>(
    `INSERT INTO webhook_events (id, provider, event_type) VALUES ($1, 'razorpay', $2)
     ON CONFLICT (id) DO UPDATE SET event_type = webhook_events.event_type
     RETURNING processed_at`,
    [eventId, eventType],
  );
  if (seen?.processed_at) return { status: 200, body: { ok: true, duplicate: true } };

  try {
    let note = "ignored";
    let stockChanged = false;
    const payment = envelope.payload?.payment?.entity;
    const refund = envelope.payload?.refund?.entity;

    if (payment && ["payment.authorized", "payment.captured", "payment.failed", "order.paid"].includes(eventType)) {
      const order = payment.order_id ? await queryOne<OrderRow>(`SELECT ${ORDER_COLUMNS} FROM orders WHERE gateway_order_id = $1`, [payment.order_id]) : null;
      if (!order) {
        note = "ignored: no matching order";
      } else if (eventType === "payment.failed" || payment.status === "failed") {
        assertPaymentMatchesOrder(order, payment);
        await recordFailedPayment(order.id, payment);
        note = "failure recorded";
      } else {
        const settled = await ensureCaptured(order, payment);
        if (settled.status === "captured") {
          const applied = await applyCapturedPayment(order.id, settled, "webhook");
          stockChanged = applied.stockChanged;
          note = applied.changed ? "order marked paid" : "already paid";
        } else {
          note = `payment status is ${settled.status}`;
        }
      }
    } else if (refund && ["refund.created", "refund.processed", "refund.failed"].includes(eventType)) {
      note = await applyGatewayRefund(refund);
    }

    await query("UPDATE webhook_events SET processed_at = now(), error = NULL WHERE id = $1", [eventId]);
    return { status: 200, body: { ok: true, note }, stockChanged };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await query("UPDATE webhook_events SET error = $2 WHERE id = $1", [eventId, message.slice(0, 500)]).catch(() => undefined);
    console.error(`[webhook] failed to process ${eventType} (${eventId}):`, message);
    // 5xx → Razorpay retries later. A mismatching payment (BusinessRuleError) is a data problem, not transient: acknowledge it.
    if (err instanceof BusinessRuleError) {
      await query("UPDATE webhook_events SET processed_at = now() WHERE id = $1", [eventId]).catch(() => undefined);
      return { status: 200, body: { ok: false, rejected: message } };
    }
    return { status: 500, body: { error: "Processing failed; will be retried." } };
  }
}
