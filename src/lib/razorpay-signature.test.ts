import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { checkoutSignature, verifyCheckoutSignature, verifyWebhookSignature, webhookSignature } from "./razorpay-signature";

// Throw-away values for tests only — not real credentials.
const KEY_SECRET = "test_key_secret_for_unit_tests";
const WEBHOOK_SECRET = "test_webhook_secret_for_unit_tests";

test("checkout signature matches the documented HMAC_SHA256(order_id|payment_id, secret)", () => {
  const expected = createHmac("sha256", KEY_SECRET).update("order_ABC123|pay_XYZ789").digest("hex");
  assert.equal(checkoutSignature("order_ABC123", "pay_XYZ789", KEY_SECRET), expected);
  assert.equal(verifyCheckoutSignature("order_ABC123", "pay_XYZ789", expected, KEY_SECRET), true);
});

test("checkout verification rejects any tampering", () => {
  const good = checkoutSignature("order_ABC123", "pay_XYZ789", KEY_SECRET);
  assert.equal(verifyCheckoutSignature("order_OTHER", "pay_XYZ789", good, KEY_SECRET), false, "different order");
  assert.equal(verifyCheckoutSignature("order_ABC123", "pay_OTHER", good, KEY_SECRET), false, "different payment");
  assert.equal(verifyCheckoutSignature("order_ABC123", "pay_XYZ789", good, "wrong_secret"), false, "wrong secret");
  assert.equal(verifyCheckoutSignature("order_ABC123", "pay_XYZ789", good.replace(/.$/, good.endsWith("0") ? "1" : "0"), KEY_SECRET), false, "flipped last digit");
  for (const bad of ["", "not-hex", good.slice(0, -2), good + "00", "ZZ".repeat(32)]) {
    assert.equal(verifyCheckoutSignature("order_ABC123", "pay_XYZ789", bad, KEY_SECRET), false, `bad signature ${bad}`);
  }
  assert.equal(verifyCheckoutSignature("", "pay_XYZ789", good, KEY_SECRET), false);
  assert.equal(verifyCheckoutSignature("order_ABC123", "pay_XYZ789", good, ""), false);
});

test("webhook signature is computed over the exact raw body", () => {
  const body = '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_1","amount":9900}}}}';
  const sig = webhookSignature(body, WEBHOOK_SECRET);
  assert.equal(sig, createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex"));
  assert.equal(verifyWebhookSignature(body, sig, WEBHOOK_SECRET), true);
  assert.equal(verifyWebhookSignature(Buffer.from(body), sig, WEBHOOK_SECRET), true);
});

test("webhook verification rejects modified bodies, wrong secrets and missing signatures", () => {
  const body = '{"event":"payment.captured","amount":9900}';
  const sig = webhookSignature(body, WEBHOOK_SECRET);
  assert.equal(verifyWebhookSignature(body.replace("9900", "1"), sig, WEBHOOK_SECRET), false, "amount changed");
  assert.equal(verifyWebhookSignature(body + " ", sig, WEBHOOK_SECRET), false, "whitespace changed");
  assert.equal(verifyWebhookSignature(body, sig, "other_secret"), false);
  assert.equal(verifyWebhookSignature(body, null, WEBHOOK_SECRET), false);
  assert.equal(verifyWebhookSignature(body, undefined, WEBHOOK_SECRET), false);
  assert.equal(verifyWebhookSignature(body, "", WEBHOOK_SECRET), false);
  assert.equal(verifyWebhookSignature(body, sig, ""), false);
});
