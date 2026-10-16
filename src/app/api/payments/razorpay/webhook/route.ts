import { revalidateCatalog } from "@/server/catalog";
import { json } from "@/server/http";
import { processRazorpayWebhook } from "@/server/payments";

/**
 * Razorpay webhook. The signature is computed over the EXACT raw body, so the body is read
 * as text and never re-serialised. Events are de-duplicated by event id.
 *
 * Configure in Razorpay Dashboard → Settings → Webhooks:
 *   URL:    https://<your-domain>/api/payments/razorpay/webhook
 *   Secret: the same value as RAZORPAY_WEBHOOK_SECRET
 *   Events: payment.authorized, payment.captured, payment.failed, order.paid,
 *           refund.created, refund.processed, refund.failed
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const outcome = await processRazorpayWebhook(raw, req.headers.get("x-razorpay-signature"), req.headers.get("x-razorpay-event-id"));
  if (outcome.stockChanged) revalidateCatalog();
  return json(outcome.body, outcome.status);
}
