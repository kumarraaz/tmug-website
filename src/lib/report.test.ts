import test from "node:test";
import assert from "node:assert/strict";
import { buildReport, type FulfilmentStatus, type PaymentStatus, type RawItem, type RawOrder, type RawPayment, type ReportInput } from "./report";
import { priceOrder, type TaxSettings } from "./tax";
import { sheetToCsv, csvEscapeText } from "./report-csv";

const INCL: TaxSettings = { gstEnabled: true, pricesIncludeGst: true, sellerState: "Maharashtra" };
const OFF: TaxSettings = { gstEnabled: false, pricesIncludeGst: true, sellerState: null };
const EXCL: TaxSettings = { gstEnabled: true, pricesIncludeGst: false, sellerState: "Maharashtra" };

let seq = 0;
interface MkOrder {
  lines: { sku: string; name: string; unit: number; qty: number; rate: number | null }[];
  tax?: TaxSettings;
  state?: string;
  discountPercent?: number;
  shipping?: number;
  payment?: PaymentStatus;
  fulfilment?: FulfilmentStatus;
  refunded?: number;
  withPaymentRow?: boolean;
  createdAt?: Date;
}

/** Build a RawOrder exactly like checkout does: priced by priceOrder, then snapshotted. */
function mk(o: MkOrder): RawOrder {
  const tax = o.tax ?? OFF;
  const state = o.state ?? "Maharashtra";
  const priced = priceOrder({
    lines: o.lines.map((l) => ({ qty: l.qty, unitPricePaise: l.unit, gstRateBp: l.rate })),
    discountPercent: o.discountPercent ?? 0,
    shippingPaise: o.shipping ?? 0,
    tax,
    placeOfSupplyState: state,
  });
  const items: RawItem[] = priced.lines.map((l, i) => ({
    productName: o.lines[i].name,
    variantLabel: "50g Jar",
    sku: o.lines[i].sku,
    category: "herbal-flower",
    hsnCode: l.gstApplied ? "0902" : null,
    qty: l.qty,
    unitPricePaise: l.unitPricePaise,
    grossPaise: l.grossPaise,
    discountPaise: l.discountPaise,
    gstApplied: l.gstApplied,
    gstRateBp: l.gstRateBp,
    taxablePaise: l.taxablePaise,
    cgstPaise: l.cgstPaise,
    sgstPaise: l.sgstPaise,
    igstPaise: l.igstPaise,
    taxPaise: l.taxPaise,
    totalPaise: l.totalPaise,
  }));
  const paymentStatus = o.payment ?? "paid";
  const isSale = paymentStatus !== "pending";
  const n = ++seq;
  const payments: RawPayment[] =
    isSale && o.withPaymentRow !== false
      ? [{ gatewayPaymentId: `pay_${n}`, gateway: "razorpay", method: "upi", status: paymentStatus === "paid" ? "captured" : paymentStatus, amountPaise: priced.totalPaise, refundedPaise: o.refunded ?? 0, paidAt: new Date("2026-10-05T08:00:00Z"), createdAt: new Date("2026-10-05T07:59:00Z") }]
      : [];
  const addr = { name: "Asha Verma", line1: "12 MG Road", line2: "", city: "Pune", state, pincode: "411001" };
  return {
    orderNumber: `TMUG-${String(n).padStart(6, "0")}`,
    createdAt: o.createdAt ?? new Date("2026-10-05T07:55:00Z"),
    customerName: "Asha Verma",
    customerEmail: "asha@example.com",
    customerPhone: "+919876543210",
    billing: addr,
    shipping: addr,
    paymentStatus,
    fulfilmentStatus: o.fulfilment ?? "new",
    paymentMethod: isSale ? "upi" : null,
    subtotalPaise: priced.subtotalPaise,
    discountPaise: priced.discountPaise,
    shippingPaise: priced.shippingPaise,
    taxPaise: priced.taxPaise,
    totalPaise: priced.totalPaise,
    refundedPaise: o.refunded ?? 0,
    gstEnabled: tax.gstEnabled,
    pricesIncludeGst: tax.pricesIncludeGst,
    invoiceNumber: null,
    invoiceDate: null,
    items,
    payments,
  };
}

const baseInput = (orders: RawOrder[]): ReportInput => ({
  periodLabel: "October 2026",
  fyLabel: "2026-27",
  fromStr: "2026-10-01",
  toStr: "2026-10-31",
  generatedAt: new Date("2026-11-02T05:00:00Z"),
  store: { storeName: "TMUG", legalName: "", gstin: "", businessState: "", address: "" },
  orders,
});

const PEA = { sku: "TMUG-PEA-50G", name: "Butterfly Pea", unit: 9900, qty: 1, rate: 500 };
const GOLD = { sku: "TMUG-GOLD-250G", name: "Gold Tea", unit: 39900, qty: 2, rate: 500 };

test("empty month: zeros, no crash, all checks OK", () => {
  const r = buildReport(baseInput([]));
  assert.equal(r.summary.ordersPlaced, 0);
  assert.equal(r.summary.netSalesPaise, 0);
  assert.ok(r.checks.every((c) => c.ok));
  assert.equal(r.sheets.orders.rows.length, 0);
});

test("only paid orders count as sales; unpaid and cancelled-unpaid are listed but excluded", () => {
  const paid = mk({ lines: [PEA], payment: "paid" });
  const awaiting = mk({ lines: [GOLD], payment: "pending" });
  const cancelled = mk({ lines: [GOLD], payment: "pending", fulfilment: "cancelled" });
  const r = buildReport(baseInput([paid, awaiting, cancelled]));
  const s = r.summary;
  assert.equal(s.ordersPlaced, 3);
  assert.equal(s.salesOrders, 1);
  assert.equal(s.awaitingPaymentOrders, 1);
  assert.equal(s.cancelledUnpaidOrders, 1);
  assert.equal(s.grossSalesPaise, 9900);
  assert.equal(s.unpaidAmountPaise, 79800);
  assert.equal(s.paidAmountPaise, 9900);
  // Order Details lists every order's lines, flagged with whether they count as sales
  const countedIdx = r.sheets.orders.columns.findIndex((c) => c.header === "Counted in sales");
  assert.deepEqual(r.sheets.orders.rows.map((row) => row.cells[countedIdx]), ["Yes", "No", "No"]);
  assert.ok(r.checks.every((c) => c.ok), JSON.stringify(r.checks.filter((c) => !c.ok)));
});

test("discounts, shipping and GST (inclusive) roll up and reconcile", () => {
  const a = mk({ lines: [PEA, GOLD], tax: INCL, discountPercent: 10, shipping: 5000, state: "Maharashtra" });
  const b = mk({ lines: [GOLD], tax: INCL, state: "Karnataka", shipping: 0 });
  const r = buildReport(baseInput([a, b]));
  const s = r.summary;
  assert.equal(s.grossSalesPaise, 9900 + 79800 + 79800);
  assert.equal(s.discountsPaise, 8970); // 10% of 89700
  assert.equal(s.shippingPaise, 5000);
  assert.equal(s.finalTotalsPaise, a.totalPaise + b.totalPaise);
  assert.equal(s.finalTotalsPaise, s.netGoodsPaise + s.shippingPaise, "inclusive GST: total = goods after discount + shipping");
  assert.equal(s.cgstPaise + s.sgstPaise + s.igstPaise, s.gstPaise);
  assert.ok(s.igstPaise > 0 && s.cgstPaise > 0, "both intra- and inter-state supplies are present");
  assert.equal(s.taxablePaise + s.gstPaise, s.netGoodsPaise, "taxable + GST = goods value after discount (inclusive prices)");
  assert.ok(r.checks.every((c) => c.ok), JSON.stringify(r.checks.filter((c) => !c.ok)));
});

test("tax-exclusive pricing: GST is added on top and the totals still reconcile", () => {
  const o = mk({ lines: [GOLD], tax: EXCL, shipping: 3000 });
  const r = buildReport(baseInput([o]));
  assert.equal(o.totalPaise, 79800 + 3990 + 3000, "₹798 goods + 5% GST (₹39.90) + ₹30 shipping");
  assert.equal(r.summary.finalTotalsPaise, o.totalPaise);
  assert.ok(r.checks.every((c) => c.ok), JSON.stringify(r.checks.filter((c) => !c.ok)));
});

test("refunds: full refund allocates to products, partial refund goes to the unallocated row; net sales reconcile", () => {
  const full = mk({ lines: [PEA, GOLD], tax: INCL, payment: "refunded", fulfilment: "cancelled", discountPercent: 10 });
  full.refundedPaise = full.totalPaise;
  full.payments[0].refundedPaise = full.totalPaise;
  const partial = mk({ lines: [GOLD], tax: INCL, payment: "partially_refunded", refunded: 10000 });
  const clean = mk({ lines: [PEA], tax: INCL });
  const r = buildReport(baseInput([full, partial, clean]));
  const s = r.summary;

  assert.equal(s.refundsPaise, full.totalPaise + 10000);
  assert.equal(s.fullyRefundedOrders, 1);
  assert.equal(s.partiallyRefundedOrders, 1);
  assert.equal(s.cancelledAfterPaymentOrders, 1);
  assert.equal(s.netSalesPaise, s.grossSalesPaise - s.discountsPaise - s.refundsPaise);
  assert.equal(s.netCollectedPaise, s.paidAmountPaise - s.refundsPaise);

  const rows = r.sheets.products.rows;
  const unalloc = rows.find((row) => row.kind === "note");
  assert.ok(unalloc, "partial refund appears as an unallocated row");
  assert.equal(unalloc!.cells[7], 10000);
  assert.ok(r.checks.every((c) => c.ok), JSON.stringify(r.checks.filter((c) => !c.ok)));
});

test("missing GST configuration is shown honestly: no rate, no tax, one 'not applied' bucket", () => {
  const r = buildReport(baseInput([mk({ lines: [PEA, GOLD], tax: OFF })]));
  const rows = r.sheets.tax.rows;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].cells[0], "GST not applied / rate not recorded");
  assert.equal(rows[0].cells[1], null, "no rate is invented");
  assert.equal(r.summary.gstPaise, 0);
  assert.equal(r.summary.gstAppliedAnywhere, false);
  const gstRateIdx = r.sheets.orders.columns.findIndex((c) => c.header === "GST rate");
  assert.ok(r.sheets.orders.rows.every((row) => row.cells[gstRateIdx] === null));
});

test("order-level amounts appear only on the first line of an order (no double counting)", () => {
  const o = mk({ lines: [PEA, GOLD], shipping: 5000 });
  const r = buildReport(baseInput([o]));
  const idx = (h: string) => r.sheets.orders.columns.findIndex((c) => c.header === h);
  const rows = r.sheets.orders.rows;
  assert.equal(rows.length, 2);
  assert.equal(rows[0].cells[idx("Grand total (₹)")], o.totalPaise);
  assert.equal(rows[1].cells[idx("Grand total (₹)")], null);
  assert.equal(rows[0].cells[idx("Shipping (₹)")], 5000);
  assert.equal(rows[1].cells[idx("Shipping (₹)")], null);
});

test("payment reconciliation lists failed attempts with zero received", () => {
  const o = mk({ lines: [PEA] });
  o.payments.unshift({ gatewayPaymentId: "pay_failed_1", gateway: "razorpay", method: "card", status: "failed", amountPaise: o.totalPaise, refundedPaise: 0, paidAt: null, createdAt: new Date("2026-10-05T07:50:00Z") });
  const r = buildReport(baseInput([o]));
  const rows = r.sheets.payments.rows;
  assert.equal(rows.length, 2);
  const idx = (h: string) => r.sheets.payments.columns.findIndex((c) => c.header === h);
  const failed = rows.find((row) => row.cells[idx("Transaction / reference ID")] === "pay_failed_1")!;
  assert.equal(failed.cells[idx("Amount received (₹)")], 0);
  assert.equal(failed.cells[idx("Payment status")], "Failed");
  assert.ok(r.checks.every((c) => c.ok));
});

test("a paid order with no payment record is flagged by the reconciliation checks, not hidden", () => {
  const o = mk({ lines: [PEA], withPaymentRow: false });
  const r = buildReport(baseInput([o]));
  assert.ok(r.checks.some((c) => !c.ok), "mismatch must be visible");
});

test("randomised months always reconcile", () => {
  let seed = 424242;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const states = ["Maharashtra", "Karnataka", "Delhi"];
  for (let run = 0; run < 150; run++) {
    const orders: RawOrder[] = [];
    for (let k = 0; k < 1 + Math.floor(rnd() * 12); k++) {
      const lines = Array.from({ length: 1 + Math.floor(rnd() * 3) }, (_, j) => ({
        sku: `SKU-${j}`,
        name: `Product ${j}`,
        unit: 5000 + Math.floor(rnd() * 90000),
        qty: 1 + Math.floor(rnd() * 5),
        rate: [null, 0, 500, 1200, 1800][Math.floor(rnd() * 5)],
      }));
      const payment = (["pending", "paid", "paid", "partially_refunded", "refunded"] as PaymentStatus[])[Math.floor(rnd() * 5)];
      const o = mk({
        lines,
        tax: [OFF, INCL, EXCL][Math.floor(rnd() * 3)],
        state: states[Math.floor(rnd() * 3)],
        discountPercent: rnd() < 0.5 ? 10 : 0,
        shipping: rnd() < 0.3 ? 4900 : 0,
        payment,
        fulfilment: rnd() < 0.2 ? "cancelled" : "new",
      });
      if (payment === "refunded") {
        o.refundedPaise = o.totalPaise;
        o.payments[0].refundedPaise = o.totalPaise;
      } else if (payment === "partially_refunded") {
        o.refundedPaise = Math.max(1, Math.floor(o.totalPaise * rnd() * 0.8));
        o.payments[0].refundedPaise = o.refundedPaise;
      }
      orders.push(o);
    }
    const r = buildReport(baseInput(orders));
    const bad = r.checks.filter((c) => !c.ok);
    assert.equal(bad.length, 0, `run ${run}: ${JSON.stringify(bad)}`);
  }
});

test("CSV: header + rows, ₹ amounts as plain decimals, IST dates, and formula injection is neutralised", () => {
  const o = mk({ lines: [PEA], tax: INCL });
  o.customerName = '=HYPERLINK("http://evil","click")';
  o.billing.name = "+cmd|' /C calc'!A0";
  o.shipping.line1 = "Flat 4, \"Sunrise\" Apts, MG Road";
  const csv = sheetToCsv(buildReport(baseInput([o])).sheets.orders);
  assert.ok(csv.startsWith("﻿Order ID,"));
  assert.ok(csv.includes("'=HYPERLINK"), "leading = is neutralised");
  assert.ok(csv.includes("'+cmd"), "leading + is neutralised");
  assert.ok(csv.includes('"Flat 4, ""Sunrise"" Apts, MG Road, Pune"'), "commas and quotes are escaped");
  assert.ok(csv.includes("05 Oct 2026, 13:25"), "date shown in IST");
  assert.ok(csv.includes(",99.00,"), "money in rupees with 2 decimals");
  assert.ok(csv.includes("5.00%"), "GST rate as a percentage");
  assert.equal(csvEscapeText("@SUM(1)"), "'@SUM(1)");
  assert.equal(csvEscapeText("-1+1"), "'-1+1");
  assert.equal(csvEscapeText("plain"), "plain");
});
