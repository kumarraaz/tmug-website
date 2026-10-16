import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Razorpay signature checks (pure functions, no I/O).
 *
 * 1. Checkout callback:  HMAC_SHA256(`${order_id}|${payment_id}`, KEY_SECRET)
 *    `order_id` must be the one WE stored when creating the gateway order —
 *    never the value echoed back by the browser.
 * 2. Webhook:            HMAC_SHA256(<raw request body>, WEBHOOK_SECRET)
 *    computed over the exact bytes received (do not re-serialise the JSON).
 *
 * Comparisons are constant-time.
 */

function hmacHex(message: string | Buffer, secret: string): string {
  return createHmac("sha256", secret).update(message).digest("hex");
}

function safeHexEqual(expectedHex: string, providedHex: string): boolean {
  if (!/^[0-9a-fA-F]+$/.test(providedHex) || providedHex.length !== expectedHex.length) return false;
  return timingSafeEqual(Buffer.from(expectedHex, "hex"), Buffer.from(providedHex, "hex"));
}

export function checkoutSignature(orderId: string, paymentId: string, keySecret: string): string {
  return hmacHex(`${orderId}|${paymentId}`, keySecret);
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string, keySecret: string): boolean {
  if (!orderId || !paymentId || !signature || !keySecret) return false;
  return safeHexEqual(checkoutSignature(orderId, paymentId, keySecret), signature);
}

export function webhookSignature(rawBody: string | Buffer, webhookSecret: string): string {
  return hmacHex(rawBody, webhookSecret);
}

export function verifyWebhookSignature(rawBody: string | Buffer, signature: string | null | undefined, webhookSecret: string): boolean {
  if (!signature || !webhookSecret) return false;
  return safeHexEqual(webhookSignature(rawBody, webhookSecret), signature.trim());
}
