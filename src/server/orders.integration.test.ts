/**
 * Integration tests for checkout, payment verification, webhooks, stock and refunds.
 *
 * Needs a DISPOSABLE PostgreSQL database (its public schema is wiped!):
 *   TEST_DATABASE_URL=postgres://user:pw@localhost:5432/tmug_test \
 *     node --conditions=react-server --import tsx --test src/server/orders.integration.test.ts
 *
 * Razorpay is replaced by a tiny local stub that implements only the three endpoints
 * the app calls. That verifies OUR logic (signature checks, amount/order matching,
 * idempotency, stock, refunds) — it says nothing about the real Razorpay service.
 * Skipped automatically when TEST_DATABASE_URL is not set.
 */
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { checkoutSignature, webhookSignature } from "@/lib/razorpay-signature";

const TEST_DB = process.env.TEST_DATABASE_URL;
const skip = !TEST_DB;

// Throw-away secrets that exist only for this test run.
const KEY_ID = "rzp_test_integration";
const KEY_SECRET = "integration_key_secret";
const WEBHOOK_SECRET = "integration_webhook_secret";

interface StubPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  created_at: number;
  error_description?: string;
}
const stub = { orders: new Map<string, { amount: number }>(), payments: new Map<string, StubPayment>(), seq: 0 };
let server: http.Server;

function startStub(): Promise<string> {
  server = http.createServer((req, res) => {
    const send = (code: number, body: unknown) => {
      res.writeHead(code, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };
    const auth = req.headers.authorization ?? "";
    if (auth !== `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64")}`) return send(401, { error: { description: "bad auth" } });
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const url = req.url ?? "";
      if (req.method === "POST" && url === "/orders") {
        const b = JSON.parse(body);
        const id = `order_stub_${++stub.seq}`;
        stub.orders.set(id, { amount: b.amount });
        return send(200, { id, entity: "order", amount: b.amount, amount_paid: 0, currency: b.currency, receipt: b.receipt, status: "created" });
      }
      const pay = /^\/payments\/([^/]+)(\/capture)?$/.exec(url);
      if (pay) {
        const p = stub.payments.get(pay[1]);
        if (!p) return send(404, { error: { description: "payment not found" } });
        if (req.method === "POST" && pay[2]) {
          if (p.status !== "authorized") return send(400, { error: { description: "not authorized" } });
          p.status = "captured";
        }
        return send(200, p);
      }
      send(404, { error: { description: "unknown route" } });
    });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(`http://127.0.0.1:${(server.address() as AddressInfo).port}`)));
}

let db: typeof import("./db");
let checkout: typeof import("./checkout");
let payments: typeof import("./payments");
let actions: typeof import("./order-actions");
let reads: typeof import("./orders-read");
let settings: typeof import("./settings");

before(async () => {
  if (skip) return;
  assert.match(new URL(TEST_DB!).pathname, /_test$/, "TEST_DATABASE_URL must point at a database whose name ends in _test");
  process.env.DATABASE_URL = TEST_DB;
  process.env.RAZORPAY_KEY_ID = KEY_ID;
  process.env.RAZORPAY_KEY_SECRET = KEY_SECRET;
  process.env.RAZORPAY_WEBHOOK_SECRET = WEBHOOK_SECRET;
  process.env.RAZORPAY_API_BASE_URL = await startStub();

  db = await import("./db");
  await db.closePool();
  const pg = await import("pg");
  const admin = new pg.Client({ connectionString: TEST_DB });
  await admin.connect();
  await admin.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  await admin.end();

  checkout = await import("./checkout");
  payments = await import("./payments");
  actions = await import("./order-actions");
  reads = await import("./orders-read");
  settings = await import("./settings");
  await db.ensureSchema();
});

after(async () => {
  if (skip) return;
  await db.closePool();
  server.close();
});

const customer = { name: "Asha Verma", email: "asha@example.com", phone: "+919876543210" };
const address = { name: "Asha Verma", phone: "+919876543210", line1: "12 MG Road", line2: "", city: "Pune", state: "Maharashtra", pincode: "411001" };

async function place(lines: { variantId: string; qty: number }[], extra: Record<string, unknown> = {}) {
  return checkout.createOrder({
    lines,
    couponCode: null,
    customer,
    shipping: address,
    billingSameAsShipping: true,
    note: "",
    ...extra,
  } as Parameters<typeof checkout.createOrder>[0]);
}

/** Make the stub gateway report a payment for an order. */
function stubPay(gatewayOrderId: string, amount: number, status = "captured", id?: string): StubPayment {
  const p: StubPayment = {
    id: id ?? `pay_stub_${++stub.seq}`,
    order_id: gatewayOrderId,
    amount,
    currency: "INR",
    status,
    method: "upi",
    created_at: Math.floor(Date.now() / 1000),
  };
  stub.payments.set(p.id, p);
  return p;
}

async function orderRow(id: string) {
  return db.queryOne<{ payment_status: string; fulfilment_status: string; stock_deducted: boolean; refunded_paise: number; payment_method: string | null }>(
    "SELECT payment_status, fulfilment_status, stock_deducted, refunded_paise, payment_method FROM orders WHERE id = $1",
    [id],
  );
}

const stockOf = async (variantId: string) =>
  (await db.queryOne<{ stock_quantity: number | null }>("SELECT stock_quantity FROM product_variants WHERE id = $1", [variantId]))?.stock_quantity;

const V_PEA_50 = "butterfly-pea-50g-jar"; // ₹99
const V_GOLD_250 = "gold-tea-250g-pouch"; // ₹399

test("quote re-prices from the database and ignores anything the browser might claim", { skip }, async () => {
  const q = await checkout.buildQuote({ lines: [{ variantId: V_PEA_50, qty: 2 }, { variantId: V_GOLD_250, qty: 1 }], couponCode: "tmug10" });
  assert.equal(q.issues.length, 0);
  assert.equal(q.pricing!.subtotalPaise, 2 * 9900 + 39900);
  assert.equal(q.pricing!.discountPaise, 5970); // 10% of ₹597
  assert.equal(q.pricing!.totalPaise, 59700 - 5970);
  assert.equal(q.coupon?.code, "TMUG10");
});

test("quote reports unknown items, bad coupons and merges duplicate lines", { skip }, async () => {
  const q = await checkout.buildQuote({ lines: [{ variantId: "nope", qty: 1 }, { variantId: V_PEA_50, qty: 1 }, { variantId: V_PEA_50, qty: 2 }], couponCode: "BOGUS" });
  assert.deepEqual(q.issues.map((i) => i.code).sort(), ["coupon", "unknown_product"]);
  assert.equal(q.items.length, 1);
  assert.equal(q.items[0].qty, 3);
});

test("createOrder stores an awaiting-payment order with price / tax snapshots", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 2 }], { couponCode: "TMUG10" });
  assert.match(o.orderNumber, /^TMUG-\d{6}$/);
  assert.equal(o.keyId, KEY_ID);
  assert.equal(o.totalPaise, 17820);
  const row = await orderRow(o.orderId);
  assert.equal(row?.payment_status, "pending");
  assert.equal(row?.fulfilment_status, "new");
  const items = await db.query<{ unit_price_paise: number; sku: string; product_name: string; discount_paise: number; gst_applied: boolean }>(
    "SELECT unit_price_paise, sku, product_name, discount_paise, gst_applied FROM order_items WHERE order_id = $1",
    [o.orderId],
  );
  assert.equal(items.length, 1);
  assert.equal(items[0].unit_price_paise, 9900);
  assert.equal(items[0].sku, "TMUG-BUTTERFLY-PEA-50G-JAR");
  assert.equal(items[0].discount_paise, 1980);
  assert.equal(items[0].gst_applied, false, "no GST is invented when GST is not enabled");
});

test("a price change after quoting is refused and the fresh quote is returned", { skip }, async () => {
  await assert.rejects(() => place([{ variantId: V_PEA_50, qty: 1 }], { expectedTotalPaise: 100 }), (err: Error) => err.name === "PriceChangedError");
});

test("checkout is blocked for unavailable / inactive / out-of-stock items", { skip }, async () => {
  await db.query("UPDATE product_variants SET is_available = false WHERE id = $1", [V_GOLD_250]);
  await assert.rejects(() => place([{ variantId: V_GOLD_250, qty: 1 }]), (err: Error) => err.name === "CheckoutBlockedError");
  await db.query("UPDATE product_variants SET is_available = true WHERE id = $1", [V_GOLD_250]);

  await db.query("UPDATE product_variants SET stock_quantity = 2 WHERE id = $1", [V_GOLD_250]);
  await assert.rejects(() => place([{ variantId: V_GOLD_250, qty: 3 }]), /Only 2/);
  await db.query("UPDATE product_variants SET stock_quantity = NULL WHERE id = $1", [V_GOLD_250]);

  await db.query("UPDATE products SET is_active = false WHERE id = 'gold-tea'");
  await assert.rejects(() => place([{ variantId: V_GOLD_250, qty: 1 }]), (err: Error) => err.name === "CheckoutBlockedError");
  await db.query("UPDATE products SET is_active = true WHERE id = 'gold-tea'");
});

test("a forged / wrong signature never marks an order paid", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const pay = stubPay(o.gatewayOrderId, o.totalPaise);
  await assert.rejects(
    () => payments.verifyCheckoutPayment({ publicToken: o.publicToken, gatewayOrderId: o.gatewayOrderId, paymentId: pay.id, signature: "0".repeat(64) }),
    /could not verify/i,
  );
  // right signature, but for a different payment id
  await assert.rejects(
    () => payments.verifyCheckoutPayment({ publicToken: o.publicToken, gatewayOrderId: o.gatewayOrderId, paymentId: pay.id, signature: checkoutSignature(o.gatewayOrderId, "pay_other", KEY_SECRET) }),
    /could not verify/i,
  );
  assert.equal((await orderRow(o.orderId))?.payment_status, "pending");
  const events = await db.query<{ type: string }>("SELECT type FROM order_events WHERE order_id = $1", [o.orderId]);
  assert.ok(events.some((e) => e.type === "payment_rejected"), "rejections are audited");
});

test("a valid signature for a payment of the WRONG amount or order is refused", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const cheap = stubPay(o.gatewayOrderId, 100); // customer paid ₹1 for a ₹99 order
  await assert.rejects(
    () => payments.verifyCheckoutPayment({ publicToken: o.publicToken, gatewayOrderId: o.gatewayOrderId, paymentId: cheap.id, signature: checkoutSignature(o.gatewayOrderId, cheap.id, KEY_SECRET) }),
    /could not verify/i,
  );
  const other = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const wrongOrder = stubPay(other.gatewayOrderId, other.totalPaise); // payment belongs to a different order
  await assert.rejects(
    () => payments.verifyCheckoutPayment({ publicToken: o.publicToken, gatewayOrderId: o.gatewayOrderId, paymentId: wrongOrder.id, signature: checkoutSignature(o.gatewayOrderId, wrongOrder.id, KEY_SECRET) }),
    /could not verify/i,
  );
  assert.equal((await orderRow(o.orderId))?.payment_status, "pending");
  assert.equal((await orderRow(other.orderId))?.payment_status, "pending");
});

test("a payment that the gateway has not captured leaves the order pending", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const created = stubPay(o.gatewayOrderId, o.totalPaise, "created");
  const r = await payments.verifyCheckoutPayment({ publicToken: o.publicToken, gatewayOrderId: o.gatewayOrderId, paymentId: created.id, signature: checkoutSignature(o.gatewayOrderId, created.id, KEY_SECRET) });
  assert.equal(r.status, "pending");
  assert.equal((await orderRow(o.orderId))?.payment_status, "pending");
});

test("verified payment marks the order paid exactly once and deducts tracked stock once", { skip }, async () => {
  await db.query("UPDATE product_variants SET stock_quantity = 10 WHERE id = $1", [V_PEA_50]);
  const o = await place([{ variantId: V_PEA_50, qty: 3 }]);
  const pay = stubPay(o.gatewayOrderId, o.totalPaise);
  const input = { publicToken: o.publicToken, gatewayOrderId: o.gatewayOrderId, paymentId: pay.id, signature: checkoutSignature(o.gatewayOrderId, pay.id, KEY_SECRET) };

  const first = await payments.verifyCheckoutPayment(input);
  assert.equal(first.status, "paid");
  assert.equal(first.stockChanged, true);
  const second = await payments.verifyCheckoutPayment(input); // replay
  assert.equal(second.status, "paid");
  assert.equal(second.stockChanged, false);

  const row = await orderRow(o.orderId);
  assert.equal(row?.payment_status, "paid");
  assert.equal(row?.payment_method, "upi");
  assert.equal(row?.stock_deducted, true);
  assert.equal(await stockOf(V_PEA_50), 7, "stock reduced once, not twice");
  const rows = await db.query("SELECT 1 FROM payments WHERE order_id = $1", [o.orderId]);
  assert.equal(rows.length, 1, "one payment row despite the replay");

  // the webhook for the same payment is a no-op
  const body = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: pay } } });
  const hook = await payments.processRazorpayWebhook(body, webhookSignature(body, WEBHOOK_SECRET), "evt_same_payment");
  assert.equal(hook.status, 200);
  assert.equal(await stockOf(V_PEA_50), 7);
  await db.query("UPDATE product_variants SET stock_quantity = NULL WHERE id = $1", [V_PEA_50]);
});

test("'authorized' payments are captured before the order is marked paid", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const pay = stubPay(o.gatewayOrderId, o.totalPaise, "authorized");
  const r = await payments.verifyCheckoutPayment({ publicToken: o.publicToken, gatewayOrderId: o.gatewayOrderId, paymentId: pay.id, signature: checkoutSignature(o.gatewayOrderId, pay.id, KEY_SECRET) });
  assert.equal(r.status, "paid");
  assert.equal(stub.payments.get(pay.id)?.status, "captured");
});

test("webhook: bad signature is rejected, good one marks paid, duplicate event ids are ignored", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const pay = stubPay(o.gatewayOrderId, o.totalPaise);
  const body = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: pay } } });

  assert.equal((await payments.processRazorpayWebhook(body, "00".repeat(32), "evt_a")).status, 400);
  assert.equal((await payments.processRazorpayWebhook(body, null, "evt_a")).status, 400);
  assert.equal((await orderRow(o.orderId))?.payment_status, "pending");

  const sig = webhookSignature(body, WEBHOOK_SECRET);
  const ok = await payments.processRazorpayWebhook(body, sig, "evt_b");
  assert.equal(ok.status, 200);
  assert.equal((await orderRow(o.orderId))?.payment_status, "paid");

  const dup = await payments.processRazorpayWebhook(body, sig, "evt_b");
  assert.equal(dup.status, 200);
  assert.equal((dup.body as { duplicate?: boolean }).duplicate, true);
});

test("webhook: a tampered amount in a correctly SIGNED event is still rejected against the order", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const pay = stubPay(o.gatewayOrderId, 100);
  const body = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: pay } } });
  const r = await payments.processRazorpayWebhook(body, webhookSignature(body, WEBHOOK_SECRET), "evt_amount");
  assert.equal(r.status, 200);
  assert.equal((r.body as { ok?: boolean }).ok, false);
  assert.equal((await orderRow(o.orderId))?.payment_status, "pending");
});

test("webhook: failed attempts are recorded but do not cancel or pay the order; unknown orders are ignored", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const failed = stubPay(o.gatewayOrderId, o.totalPaise, "failed");
  failed.error_description = "Card declined";
  const body = JSON.stringify({ event: "payment.failed", payload: { payment: { entity: failed } } });
  assert.equal((await payments.processRazorpayWebhook(body, webhookSignature(body, WEBHOOK_SECRET), "evt_fail")).status, 200);
  const p = await db.queryOne<{ status: string; failure_reason: string }>("SELECT status, failure_reason FROM payments WHERE gateway_payment_id = $1", [failed.id]);
  assert.equal(p?.status, "failed");
  assert.equal(p?.failure_reason, "Card declined");
  assert.equal((await orderRow(o.orderId))?.payment_status, "pending");

  const stray = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: { ...failed, id: "pay_x", status: "captured", order_id: "order_not_ours" } } } });
  const r = await payments.processRazorpayWebhook(stray, webhookSignature(stray, WEBHOOK_SECRET), "evt_stray");
  assert.equal(r.status, 200);
  assert.match(String((r.body as { note?: string }).note), /no matching order/);
});

test("admin: cannot ship an unpaid order; shipping a paid one works; status cannot go backwards", { skip }, async () => {
  const unpaid = await place([{ variantId: V_PEA_50, qty: 1 }]);
  await assert.rejects(() => actions.updateFulfilmentStatus(unpaid.orderId, "shipped", null), /Payment has not been received/);

  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const pay = stubPay(o.gatewayOrderId, o.totalPaise);
  await payments.verifyCheckoutPayment({ publicToken: o.publicToken, gatewayOrderId: o.gatewayOrderId, paymentId: pay.id, signature: checkoutSignature(o.gatewayOrderId, pay.id, KEY_SECRET) });
  await actions.updateFulfilmentStatus(o.orderId, "processing", undefined);
  await actions.updateFulfilmentStatus(o.orderId, "shipped", "DTDC 12345");
  assert.equal((await orderRow(o.orderId))?.fulfilment_status, "shipped");
  await assert.rejects(() => actions.updateFulfilmentStatus(o.orderId, "processing", undefined), /backwards/);
  await actions.updateFulfilmentStatus(o.orderId, "delivered", undefined);
  await assert.rejects(() => actions.cancelOrder(o.orderId, "too late"), /delivered/);
});

test("admin: cancelling a paid order restores stock and flags that a refund is due; refunds are validated and reconciled", { skip }, async () => {
  await db.query("UPDATE product_variants SET stock_quantity = 20 WHERE id = $1", [V_GOLD_250]);
  const o = await place([{ variantId: V_GOLD_250, qty: 2 }]); // ₹798
  const pay = stubPay(o.gatewayOrderId, o.totalPaise);
  await payments.verifyCheckoutPayment({ publicToken: o.publicToken, gatewayOrderId: o.gatewayOrderId, paymentId: pay.id, signature: checkoutSignature(o.gatewayOrderId, pay.id, KEY_SECRET) });
  assert.equal(await stockOf(V_GOLD_250), 18);

  const cancelled = await actions.cancelOrder(o.orderId, "Customer changed mind");
  assert.equal(cancelled.refundRequired, true);
  assert.equal(cancelled.stockChanged, true);
  assert.equal(await stockOf(V_GOLD_250), 20);
  await assert.rejects(() => actions.cancelOrder(o.orderId, "again"), /already cancelled/);

  await assert.rejects(() => actions.recordRefund(o.orderId, { amountPaise: o.totalPaise + 1, reason: "too much" }), /exceeds the refundable/);
  await actions.recordRefund(o.orderId, { amountPaise: 30000, reason: "Partial", reference: "rfnd_manual_1" });
  assert.equal((await orderRow(o.orderId))?.payment_status, "partially_refunded");
  assert.equal((await orderRow(o.orderId))?.refunded_paise, 30000);

  // Razorpay dashboard refund of the remainder arrives via webhook and settles the order
  const rest = o.totalPaise - 30000;
  const body = JSON.stringify({ event: "refund.processed", payload: { refund: { entity: { id: "rfnd_hook_1", payment_id: pay.id, amount: rest, status: "processed", created_at: Math.floor(Date.now() / 1000) } } } });
  assert.equal((await payments.processRazorpayWebhook(body, webhookSignature(body, WEBHOOK_SECRET), "evt_refund")).status, 200);
  const row = await orderRow(o.orderId);
  assert.equal(row?.payment_status, "refunded");
  assert.equal(row?.refunded_paise, o.totalPaise);
  const p = await db.queryOne<{ status: string; refunded_paise: number }>("SELECT status, refunded_paise FROM payments WHERE gateway_payment_id = $1", [pay.id]);
  assert.deepEqual([p?.status, p?.refunded_paise], ["refunded", o.totalPaise]);
  await assert.rejects(() => actions.recordRefund(o.orderId, { amountPaise: 100, reason: "extra" }), /Only an order that has been paid|exceeds/);
  await db.query("UPDATE product_variants SET stock_quantity = NULL WHERE id = $1", [V_GOLD_250]);
});

test("admin: invoice numbers are recorded as entered and must be unique", { skip }, async () => {
  const a = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const b = await place([{ variantId: V_PEA_50, qty: 1 }]);
  await actions.updateOrderMeta(a.orderId, { invoiceNumber: "INV/26-27/0001", invoiceDate: "2026-10-16", adminNote: "gift wrap" });
  await assert.rejects(() => actions.updateOrderMeta(b.orderId, { invoiceNumber: "INV/26-27/0001" }), (err: { code?: string }) => err.code === "23505");
  const detail = await reads.getOrderDetail(a.orderId);
  assert.equal(detail?.invoiceNumber, "INV/26-27/0001");
  assert.equal(detail?.invoiceDate, "2026-10-16");
  assert.equal(detail?.adminNote, "gift wrap");
});

test("a payment that arrives for an already-cancelled order is recorded and flagged, never lost", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  await actions.cancelOrder(o.orderId, "abandoned");
  const pay = stubPay(o.gatewayOrderId, o.totalPaise);
  const body = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: pay } } });
  assert.equal((await payments.processRazorpayWebhook(body, webhookSignature(body, WEBHOOK_SECRET), "evt_late")).status, 200);
  const row = await orderRow(o.orderId);
  assert.equal(row?.payment_status, "paid");
  assert.equal(row?.fulfilment_status, "cancelled");
  assert.equal(row?.stock_deducted, false);
  const events = await db.query<{ type: string }>("SELECT type FROM order_events WHERE order_id = $1", [o.orderId]);
  assert.ok(events.some((e) => e.type === "attention"));
  const list = await reads.listOrders({ page: 1, pageSize: 100 });
  assert.equal(list.rows.find((r) => r.id === o.orderId)?.needsRefund, true);
});

test("GST: enabled settings snapshot the rate, split CGST/SGST vs IGST, and keep totals", { skip }, async () => {
  const s = settings.defaultSettings();
  s.gst = { enabled: true, gstin: "27AAPFU0939F1ZV", businessState: "Maharashtra", pricesIncludeGst: true };
  await settings.saveSettings(settings.storeSettingsSchema.parse(s));
  await db.query("UPDATE products SET gst_rate_bp = 500, hsn_code = '0902' WHERE id = 'butterfly-pea'");

  const intra = await place([{ variantId: V_PEA_50, qty: 1 }]); // Pune → Maharashtra
  const inter = await place([{ variantId: V_PEA_50, qty: 1 }], { shipping: { ...address, state: "Karnataka", city: "Bengaluru", pincode: "560001" } });
  const one = async (id: string) =>
    db.queryOne<{ taxable_paise: number; cgst_paise: number; sgst_paise: number; igst_paise: number; tax_paise: number; gst_rate_bp: number; hsn_code: string }>(
      "SELECT taxable_paise, cgst_paise, sgst_paise, igst_paise, tax_paise, gst_rate_bp, hsn_code FROM order_items WHERE order_id = $1",
      [id],
    );
  const a = await one(intra.orderId);
  assert.deepEqual([a?.taxable_paise, a?.cgst_paise, a?.sgst_paise, a?.igst_paise, a?.gst_rate_bp, a?.hsn_code], [9429, 235, 236, 0, 500, "0902"]);
  const b = await one(inter.orderId);
  assert.deepEqual([b?.taxable_paise, b?.cgst_paise, b?.sgst_paise, b?.igst_paise], [9429, 0, 0, 471]);
  assert.equal(intra.totalPaise, 9900, "tax-inclusive prices: customer pays the listed price");

  // turn it back off so later tests / reruns see the default
  await settings.saveSettings(settings.storeSettingsSchema.parse(settings.defaultSettings()));
  await db.query("UPDATE products SET gst_rate_bp = NULL, hsn_code = NULL WHERE id = 'butterfly-pea'");
});

test("shipping: flat fee applies below the free-shipping threshold and not above it", { skip }, async () => {
  const s = settings.defaultSettings();
  s.shipping = { flatFee: 50, freeAbove: 500 };
  await settings.saveSettings(settings.storeSettingsSchema.parse(s));
  const small = await checkout.buildQuote({ lines: [{ variantId: V_PEA_50, qty: 1 }] });
  assert.equal(small.pricing!.shippingPaise, 5000);
  assert.equal(small.pricing!.totalPaise, 9900 + 5000);
  const big = await checkout.buildQuote({ lines: [{ variantId: V_GOLD_250, qty: 2 }] });
  assert.equal(big.pricing!.shippingPaise, 0);
  await settings.saveSettings(settings.storeSettingsSchema.parse(settings.defaultSettings()));
});

test("the public confirmation view exposes no private data beyond the order token holder's own", { skip }, async () => {
  const o = await place([{ variantId: V_PEA_50, qty: 1 }]);
  const view = await reads.getPublicOrder(o.publicToken);
  assert.equal(view?.orderNumber, o.orderNumber);
  assert.ok(view?.emailMasked.includes("•"), "email is masked");
  assert.ok(!JSON.stringify(view).includes("asha@example.com"));
  assert.ok(!JSON.stringify(view).includes("9876543210"));
  assert.equal(await reads.getPublicOrder("not-a-real-token-123456"), null);
});
