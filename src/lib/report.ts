/**
 * Monthly bookkeeping report (the data behind the "Download Excel for CA" workbook).
 *
 * PURE: takes raw order / payment / refund records and returns sheet tables. All
 * amounts are integer paise; GST rates are basis points. Nothing is estimated —
 * where the database holds no value (rate, GSTIN, invoice number…) the report
 * shows a blank, never a guess.
 *
 * Basis (stated inside the workbook too):
 *  - Orders are selected by ORDER DATE (IST).
 *  - A "sale" is an order for which payment was received (paid, or later refunded).
 *    Unpaid / cancelled-unpaid orders are listed but never counted as sales.
 *  - Refunds are those recorded against the selected orders up to generation time.
 */

import { formatDateTimeIst } from "./dates";
import { placeOfSupplyLabel } from "./india";

export type PaymentStatus = "pending" | "paid" | "partially_refunded" | "refunded";
export type FulfilmentStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled";

export interface RawAddress {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface RawItem {
  productName: string;
  variantLabel: string;
  sku: string;
  category: string;
  hsnCode: string | null;
  qty: number;
  unitPricePaise: number;
  grossPaise: number;
  discountPaise: number;
  gstApplied: boolean;
  gstRateBp: number | null;
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  taxPaise: number;
  /** goods value for the line: net of discount (plus tax when prices exclude GST) */
  totalPaise: number;
}

export interface RawPayment {
  gatewayPaymentId: string | null;
  gateway: string;
  method: string | null;
  status: string;
  amountPaise: number;
  refundedPaise: number;
  paidAt: Date | null;
  createdAt: Date;
}

export interface RawOrder {
  orderNumber: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billing: RawAddress;
  shipping: RawAddress;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  paymentMethod: string | null;
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  refundedPaise: number;
  gstEnabled: boolean;
  pricesIncludeGst: boolean;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  items: RawItem[];
  payments: RawPayment[];
}

export interface ReportStore {
  storeName: string;
  legalName: string;
  gstin: string;
  businessState: string;
  address: string;
}

export interface ReportInput {
  /** Human label, e.g. "October 2026" */
  periodLabel: string;
  fyLabel: string;
  fromStr: string;
  toStr: string;
  generatedAt: Date;
  store: ReportStore;
  orders: RawOrder[];
  /** Orders in the period that were placed with Razorpay TEST keys (no real money). They are left out of every figure. */
  testOrdersExcluded?: number;
}

/* ----------------------------- sheet structure ----------------------------- */

export type CellType = "text" | "money" | "int" | "percent" | "date" | "datetime";
export type Cell = string | number | Date | null;

export interface Column {
  header: string;
  type: CellType;
  width: number;
  /** Show a SUBTOTAL in the totals row (money / int columns). */
  sum?: boolean;
}

export interface Row {
  kind?: "data" | "section" | "total" | "note";
  cells: Cell[];
}

export interface ReportSheet {
  name: string;
  /** Lines shown above the table (first line is the title). */
  heading: string[];
  columns: Column[];
  rows: Row[];
  /** Filterable data table (autofilter + SUBTOTAL totals row) vs. a fixed layout. */
  filterable: boolean;
  /** Columns frozen on the left. */
  freezeColumns: number;
}

export interface ReconciliationCheck {
  label: string;
  expectedPaise: number;
  actualPaise: number;
  ok: boolean;
}

export interface ReportSummary {
  ordersPlaced: number;
  salesOrders: number;
  awaitingPaymentOrders: number;
  cancelledUnpaidOrders: number;
  fullyRefundedOrders: number;
  partiallyRefundedOrders: number;
  cancelledAfterPaymentOrders: number;
  grossSalesPaise: number;
  discountsPaise: number;
  netGoodsPaise: number;
  refundsPaise: number;
  netSalesPaise: number;
  shippingPaise: number;
  finalTotalsPaise: number;
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  gstPaise: number;
  paidAmountPaise: number;
  unpaidAmountPaise: number;
  netCollectedPaise: number;
  gstAppliedAnywhere: boolean;
  anyPricesInclusive: boolean;
  anyPricesExclusive: boolean;
}

export interface Report {
  input: ReportInput;
  summary: ReportSummary;
  checks: ReconciliationCheck[];
  sheets: {
    summary: ReportSheet;
    orders: ReportSheet;
    products: ReportSheet;
    payments: ReportSheet;
    tax: ReportSheet;
  };
}

/* -------------------------------- helpers -------------------------------- */

const isSale = (o: RawOrder) => o.paymentStatus === "paid" || o.paymentStatus === "partially_refunded" || o.paymentStatus === "refunded";
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const joinAddress = (a: RawAddress) => [a.line1, a.line2, a.city].filter(Boolean).join(", ");

const PAYMENT_STATUS_TEXT: Record<PaymentStatus, string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  partially_refunded: "Partially refunded",
  refunded: "Refunded",
};
const FULFILMENT_TEXT: Record<FulfilmentStatus, string> = {
  new: "New",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const GATEWAY_PAYMENT_TEXT: Record<string, string> = {
  created: "Created (not paid)",
  authorized: "Authorized",
  captured: "Captured",
  failed: "Failed",
  partially_refunded: "Partially refunded",
  refunded: "Refunded",
};
const RECEIVED_STATUSES = new Set(["captured", "partially_refunded", "refunded"]);

export const DISCLAIMER =
  "Bookkeeping support report generated from store records. It is NOT a GST return and has not been filed with, or verified by, any government authority.";

/* --------------------------------- builder --------------------------------- */

export function buildReport(input: ReportInput): Report {
  const orders = input.orders;
  const sales = orders.filter(isSale);
  const salesItems = sales.flatMap((o) => o.items);

  const awaiting = orders.filter((o) => o.paymentStatus === "pending" && o.fulfilmentStatus !== "cancelled");
  const cancelledUnpaid = orders.filter((o) => o.paymentStatus === "pending" && o.fulfilmentStatus === "cancelled");

  const grossSalesPaise = sum(salesItems.map((i) => i.grossPaise));
  const discountsPaise = sum(salesItems.map((i) => i.discountPaise));
  const refundsPaise = sum(sales.map((o) => o.refundedPaise));
  const shippingPaise = sum(sales.map((o) => o.shippingPaise));
  const finalTotalsPaise = sum(sales.map((o) => o.totalPaise));
  const paidAmountPaise = sum(sales.flatMap((o) => o.payments.filter((p) => RECEIVED_STATUSES.has(p.status)).map((p) => p.amountPaise)));

  const summary: ReportSummary = {
    ordersPlaced: orders.length,
    salesOrders: sales.length,
    awaitingPaymentOrders: awaiting.length,
    cancelledUnpaidOrders: cancelledUnpaid.length,
    fullyRefundedOrders: sales.filter((o) => o.paymentStatus === "refunded").length,
    partiallyRefundedOrders: sales.filter((o) => o.paymentStatus === "partially_refunded").length,
    cancelledAfterPaymentOrders: sales.filter((o) => o.fulfilmentStatus === "cancelled").length,
    grossSalesPaise,
    discountsPaise,
    netGoodsPaise: grossSalesPaise - discountsPaise,
    refundsPaise,
    netSalesPaise: grossSalesPaise - discountsPaise - refundsPaise,
    shippingPaise,
    finalTotalsPaise,
    taxablePaise: sum(salesItems.map((i) => i.taxablePaise)),
    cgstPaise: sum(salesItems.map((i) => i.cgstPaise)),
    sgstPaise: sum(salesItems.map((i) => i.sgstPaise)),
    igstPaise: sum(salesItems.map((i) => i.igstPaise)),
    gstPaise: sum(salesItems.map((i) => i.taxPaise)),
    paidAmountPaise,
    unpaidAmountPaise: sum(awaiting.map((o) => o.totalPaise)),
    netCollectedPaise: paidAmountPaise - refundsPaise,
    gstAppliedAnywhere: salesItems.some((i) => i.gstApplied),
    anyPricesInclusive: sales.some((o) => o.gstEnabled && o.pricesIncludeGst),
    anyPricesExclusive: sales.some((o) => o.gstEnabled && !o.pricesIncludeGst),
  };

  const orderSheet = buildOrdersSheet(orders);
  const productSheet = buildProductsSheet(sales);
  const paymentSheet = buildPaymentsSheet(orders);
  const taxSheet = buildTaxSheet(salesItems);

  // Column totals computed from the same rows that are written to each sheet.
  const orderLineGross = sum(sales.flatMap((o) => o.items.map((i) => i.grossPaise)));
  const orderFirstLineTotals = sum(sales.map((o) => o.totalPaise));
  const paymentsReceived = sum(orders.flatMap((o) => o.payments.filter((p) => RECEIVED_STATUSES.has(p.status)).map((p) => p.amountPaise)));
  const paymentsRefunded = sum(orders.flatMap((o) => o.payments.filter((p) => RECEIVED_STATUSES.has(p.status)).map((p) => p.refundedPaise)));
  const productGross = productSheet.totals.gross;
  const productNet = productSheet.totals.net;

  const check = (label: string, expectedPaise: number, actualPaise: number): ReconciliationCheck => ({ label, expectedPaise, actualPaise, ok: expectedPaise === actualPaise });
  const checks: ReconciliationCheck[] = [
    check("Order Details: sum of line amounts (paid orders) = Gross sales", summary.grossSalesPaise, orderLineGross),
    check("Order Details: sum of order grand totals (paid orders) = Final order totals", summary.finalTotalsPaise, orderFirstLineTotals),
    check("Final order totals = Net goods value + Shipping (+ GST when prices exclude GST)", summary.netGoodsPaise + summary.shippingPaise + sum(sales.filter((o) => o.gstEnabled && !o.pricesIncludeGst).map((o) => o.taxPaise)), summary.finalTotalsPaise),
    check("Payment Reconciliation: amount received = Paid amount", summary.paidAmountPaise, paymentsReceived),
    check("Paid amount = Final order totals (every paid order has a matching payment)", summary.finalTotalsPaise, summary.paidAmountPaise),
    check("Payment Reconciliation: refunds = Returns and refunds", summary.refundsPaise, paymentsRefunded),
    check("Product Sales: gross sales = Gross sales", summary.grossSalesPaise, productGross),
    check("Product Sales: net sales = Net sales", summary.netSalesPaise, productNet),
    check("Tax Summary: taxable value = Taxable sales", summary.taxablePaise, taxSheet.totals.taxable),
    check("Tax Summary: total GST = GST total", summary.gstPaise, taxSheet.totals.tax),
  ];

  return {
    input,
    summary,
    checks,
    sheets: {
      summary: buildSummarySheet(input, summary, checks),
      orders: orderSheet,
      products: productSheet.sheet,
      payments: paymentSheet,
      tax: taxSheet.sheet,
    },
  };
}

/* ------------------------------ Sheet 1: summary ------------------------------ */

function buildSummarySheet(input: ReportInput, s: ReportSummary, checks: ReconciliationCheck[]): ReportSheet {
  const gstGeneral = s.gstAppliedAnywhere
    ? s.anyPricesInclusive && s.anyPricesExclusive
      ? "Prices were GST-inclusive on some orders and GST-exclusive on others."
      : s.anyPricesExclusive
        ? "Prices EXCLUDE GST: GST was added on top of the listed price."
        : "Prices INCLUDE GST: GST is contained within the amounts charged."
    : "GST was not applied on any order in this period (GST disabled in store settings, or no GST rate configured on the products sold).";

  const money = (label: string, paise: number, basis: string, kind: Row["kind"] = "data"): Row => ({ kind, cells: [label, paise, null, basis] });
  const count = (label: string, n: number, basis: string): Row => ({ cells: [label, null, n, basis] });
  const section = (label: string): Row => ({ kind: "section", cells: [label, null, null, null] });
  const rows: Row[] = [
    section("Orders"),
    count("Total orders placed in the period (all statuses)", s.ordersPlaced, "Orders with an order date inside the reporting period."),
    count("  Paid orders (counted as sales)", s.salesOrders, "Payment received and verified. Includes orders refunded later."),
    count("  Awaiting payment (not counted as sales)", s.awaitingPaymentOrders, "Order placed but payment not received."),
    count("  Cancelled before payment (not counted as sales)", s.cancelledUnpaidOrders, ""),
    count("  Of paid orders: fully refunded", s.fullyRefundedOrders, ""),
    count("  Of paid orders: partially refunded", s.partiallyRefundedOrders, ""),
    count("  Of paid orders: cancelled after payment", s.cancelledAfterPaymentOrders, "Money should have been refunded — see Returns and refunds."),

    section("Sales (paid orders only)"),
    money("Gross sales", s.grossSalesPaise, "Goods value at the selling price charged, before discounts."),
    money("Discounts", s.discountsPaise, "Coupon discounts applied at checkout. A product's sale price is its selling price, not a discount."),
    money("Net goods value after discounts", s.netGoodsPaise, "Gross sales − Discounts."),
    money("Returns and refunds", s.refundsPaise, "Refunds recorded against these orders (goods, shipping and tax together)."),
    money("Net sales", s.netSalesPaise, "Gross sales − Discounts − Returns and refunds.", "total"),
    money("Shipping charges", s.shippingPaise, "Charged to customers. GST on shipping is NOT calculated by this system."),
    money("Final order totals", s.finalTotalsPaise, "Sum of order grand totals (goods after discount + shipping" + (s.anyPricesExclusive ? " + GST" : "") + ")."),

    section("Tax (before refunds)"),
    money("Taxable sales", s.taxablePaise, "Taxable value of goods after discounts. Equals goods value when no GST was applied."),
    money("CGST", s.cgstPaise, "Intra-state supplies (delivery state = business state)."),
    money("SGST / UTGST", s.sgstPaise, "Intra-state supplies."),
    money("IGST", s.igstPaise, "Inter-state supplies."),
    money("Total GST", s.gstPaise, gstGeneral),

    section("Payments"),
    money("Paid amount (received)", s.paidAmountPaise, "Payments captured for paid orders."),
    money("Unpaid amount (awaiting payment)", s.unpaidAmountPaise, "Totals of orders still awaiting payment — NOT included in sales."),
    money("Refunded to customers", s.refundsPaise, ""),
    money("Net collected (paid − refunded)", s.netCollectedPaise, "", "total"),

    section("Reconciliation checks (all must show OK)"),
    ...checks.map((c): Row => ({
      kind: "data",
      cells: [c.label, c.actualPaise, null, c.ok ? "OK" : `MISMATCH — expected ${(c.expectedPaise / 100).toFixed(2)}`],
    })),
  ];

  const store = input.store;
  return {
    name: "Monthly Sales Summary",
    heading: [
      `${store.storeName} — Monthly Sales Summary (bookkeeping support report)`,
      `Reporting period: ${input.periodLabel}  (${input.fromStr} to ${input.toStr}, IST)  •  Financial year ${input.fyLabel}`,
      `Business: ${store.legalName || store.storeName}  •  GSTIN: ${store.gstin || "not configured"}  •  Business state: ${store.businessState || "not configured"}`,
      `Generated: ${formatDateTimeIst(input.generatedAt)} IST  •  Currency: INR (₹)`,
      "Basis: orders are selected by order date; sales are orders for which payment was received; refunds are those recorded up to the generation time." +
        (input.testOrdersExcluded
          ? ` ${input.testOrdersExcluded} test order${input.testOrdersExcluded === 1 ? "" : "s"} placed with Razorpay test keys (no real money) ${input.testOrdersExcluded === 1 ? "is" : "are"} not included.`
          : ""),
      DISCLAIMER,
    ],
    columns: [
      { header: "Metric", type: "text", width: 64 },
      { header: "Amount (₹)", type: "money", width: 18 },
      { header: "Count", type: "int", width: 10 },
      { header: "Basis / notes", type: "text", width: 90 },
    ],
    rows,
    filterable: false,
    freezeColumns: 0,
  };
}

/* ----------------------------- Sheet 2: order details ----------------------------- */

function buildOrdersSheet(orders: RawOrder[]): ReportSheet {
  const rows: Row[] = [];
  for (const o of orders) {
    const counted = isSale(o);
    const txnIds = o.payments.filter((p) => p.gatewayPaymentId && RECEIVED_STATUSES.has(p.status)).map((p) => p.gatewayPaymentId as string);
    o.items.forEach((i, idx) => {
      const first = idx === 0;
      rows.push({
        cells: [
          o.orderNumber,
          o.createdAt,
          o.customerName,
          o.customerEmail,
          o.customerPhone,
          o.billing.name,
          joinAddress(o.billing),
          o.billing.state,
          o.billing.pincode,
          o.shipping.name,
          joinAddress(o.shipping),
          o.shipping.state,
          o.shipping.pincode,
          placeOfSupplyLabel(o.shipping.state),
          i.productName,
          i.variantLabel,
          i.sku,
          i.hsnCode,
          i.qty,
          i.unitPricePaise,
          i.grossPaise,
          i.discountPaise,
          i.taxablePaise,
          i.gstApplied ? i.gstRateBp : null,
          i.cgstPaise,
          i.sgstPaise,
          i.igstPaise,
          i.taxPaise,
          first ? o.shippingPaise : null,
          first ? o.totalPaise : null,
          first ? o.refundedPaise : null,
          o.paymentMethod ?? (counted ? "Not recorded" : ""),
          txnIds.join(", ") || null,
          PAYMENT_STATUS_TEXT[o.paymentStatus],
          FULFILMENT_TEXT[o.fulfilmentStatus],
          o.invoiceNumber,
          o.invoiceDate,
          i.gstApplied ? "Yes" : "No",
          counted ? "Yes" : "No",
        ],
      });
    });
  }

  return {
    name: "Order Details",
    heading: [
      "Order Details — one row per product line",
      "Amounts in ₹. Unit price and line amount are as charged to the customer. Shipping, grand total and refund are shown on the FIRST line of each order only, so column totals are not double-counted.",
      "'Counted in sales' = Yes only for orders with payment received. Filter this column to reconcile with the Summary. " + DISCLAIMER,
    ],
    columns: [
      { header: "Order ID", type: "text", width: 15 },
      { header: "Order date (IST)", type: "datetime", width: 18 },
      { header: "Customer name", type: "text", width: 22 },
      { header: "Email", type: "text", width: 28 },
      { header: "Phone", type: "text", width: 16 },
      { header: "Billing name", type: "text", width: 22 },
      { header: "Billing address", type: "text", width: 38 },
      { header: "Billing state", type: "text", width: 18 },
      { header: "Billing PIN", type: "text", width: 10 },
      { header: "Shipping name", type: "text", width: 22 },
      { header: "Shipping address", type: "text", width: 38 },
      { header: "Shipping state", type: "text", width: 18 },
      { header: "Shipping PIN", type: "text", width: 10 },
      { header: "Place of supply", type: "text", width: 22 },
      { header: "Product", type: "text", width: 30 },
      { header: "Variant", type: "text", width: 14 },
      { header: "SKU", type: "text", width: 30 },
      { header: "HSN", type: "text", width: 10 },
      { header: "Qty", type: "int", width: 7, sum: true },
      { header: "Unit price (₹)", type: "money", width: 14 },
      { header: "Line amount (₹)", type: "money", width: 15, sum: true },
      { header: "Discount (₹)", type: "money", width: 13, sum: true },
      { header: "Taxable amount (₹)", type: "money", width: 17, sum: true },
      { header: "GST rate", type: "percent", width: 9 },
      { header: "CGST (₹)", type: "money", width: 12, sum: true },
      { header: "SGST (₹)", type: "money", width: 12, sum: true },
      { header: "IGST (₹)", type: "money", width: 12, sum: true },
      { header: "Total GST (₹)", type: "money", width: 13, sum: true },
      { header: "Shipping (₹)", type: "money", width: 13, sum: true },
      { header: "Grand total (₹)", type: "money", width: 15, sum: true },
      { header: "Refund amount (₹)", type: "money", width: 16, sum: true },
      { header: "Payment method", type: "text", width: 16 },
      { header: "Transaction / reference ID", type: "text", width: 26 },
      { header: "Payment status", type: "text", width: 18 },
      { header: "Order status", type: "text", width: 13 },
      { header: "Invoice no.", type: "text", width: 16 },
      { header: "Invoice date", type: "text", width: 12 },
      { header: "GST applied", type: "text", width: 11 },
      { header: "Counted in sales", type: "text", width: 15 },
    ],
    rows,
    filterable: true,
    freezeColumns: 1,
  };
}

/* ----------------------------- Sheet 3: product sales ----------------------------- */

function buildProductsSheet(sales: RawOrder[]): { sheet: ReportSheet; totals: { gross: number; net: number } } {
  interface Agg { product: string; variant: string; sku: string; category: string; units: number; gross: number; discount: number; refund: number }
  const bySku = new Map<string, Agg>();
  let allocated = 0;

  for (const o of sales) {
    const fullyRefunded = o.refundedPaise >= o.totalPaise && o.totalPaise > 0;
    for (const i of o.items) {
      const key = i.sku;
      const a = bySku.get(key) ?? { product: i.productName, variant: i.variantLabel, sku: i.sku, category: i.category, units: 0, gross: 0, discount: 0, refund: 0 };
      a.units += i.qty;
      a.gross += i.grossPaise;
      a.discount += i.discountPaise;
      if (fullyRefunded) {
        const goods = i.grossPaise - i.discountPaise;
        a.refund += goods;
        allocated += goods;
      }
      bySku.set(key, a);
    }
  }

  const aggs = [...bySku.values()].sort((a, b) => b.gross - b.discount - (a.gross - a.discount) || a.product.localeCompare(b.product));
  const totalRefunds = sum(sales.map((o) => o.refundedPaise));
  const unallocated = totalRefunds - allocated;

  const rows: Row[] = aggs.map((a) => ({ cells: [a.product, a.variant, a.sku, a.category, a.units, a.gross, a.discount, a.refund, a.gross - a.discount - a.refund] }));
  if (unallocated !== 0) {
    rows.push({
      kind: "note",
      cells: ["Refunds not allocated to a product (partial refunds, shipping / tax portions)", null, null, null, null, 0, 0, unallocated, -unallocated],
    });
  }

  const gross = sum(aggs.map((a) => a.gross));
  const net = sum(aggs.map((a) => a.gross - a.discount - a.refund)) - unallocated;

  return {
    totals: { gross, net },
    sheet: {
      name: "Product Sales",
      heading: [
        "Product Sales — paid orders only",
        "Refunds are allocated to products only when an order was refunded in full; any other refund appears in the 'not allocated' row so totals still reconcile with the Summary.",
      ],
      columns: [
        { header: "Product", type: "text", width: 32 },
        { header: "Variant", type: "text", width: 14 },
        { header: "SKU", type: "text", width: 32 },
        { header: "Category", type: "text", width: 18 },
        { header: "Units sold", type: "int", width: 11, sum: true },
        { header: "Gross sales (₹)", type: "money", width: 16, sum: true },
        { header: "Discounts (₹)", type: "money", width: 14, sum: true },
        { header: "Refunds / returns (₹)", type: "money", width: 20, sum: true },
        { header: "Net sales (₹)", type: "money", width: 15, sum: true },
      ],
      rows,
      filterable: true,
      freezeColumns: 1,
    },
  };
}

/* -------------------------- Sheet 4: payment reconciliation -------------------------- */

function buildPaymentsSheet(orders: RawOrder[]): ReportSheet {
  const entries = orders.flatMap((o) => o.payments.map((p) => ({ o, p })));
  entries.sort((a, b) => (a.p.paidAt ?? a.p.createdAt).getTime() - (b.p.paidAt ?? b.p.createdAt).getTime());

  const rows: Row[] = entries.map(({ o, p }) => {
    const received = RECEIVED_STATUSES.has(p.status) ? p.amountPaise : 0;
    const refunded = RECEIVED_STATUSES.has(p.status) ? p.refundedPaise : 0;
    return {
      cells: [
        o.orderNumber,
        p.paidAt ?? p.createdAt,
        p.method ?? (received ? "Not recorded" : ""),
        p.gatewayPaymentId,
        o.totalPaise,
        received,
        GATEWAY_PAYMENT_TEXT[p.status] ?? p.status,
        refunded,
        received - refunded,
        p.gateway,
      ],
    };
  });

  return {
    name: "Payment Reconciliation",
    heading: [
      "Payment Reconciliation — payments for orders placed in the period",
      "Amount received counts captured payments only (failed or incomplete attempts show 0). A payment made just after midnight can carry a date in the following month.",
    ],
    columns: [
      { header: "Order ID", type: "text", width: 15 },
      { header: "Payment date (IST)", type: "datetime", width: 19 },
      { header: "Payment method", type: "text", width: 16 },
      { header: "Transaction / reference ID", type: "text", width: 28 },
      { header: "Order total (₹)", type: "money", width: 15 },
      { header: "Amount received (₹)", type: "money", width: 19, sum: true },
      { header: "Payment status", type: "text", width: 20 },
      { header: "Refund amount (₹)", type: "money", width: 17, sum: true },
      { header: "Net collected (₹)", type: "money", width: 17, sum: true },
      { header: "Gateway", type: "text", width: 11 },
    ],
    rows,
    filterable: true,
    freezeColumns: 1,
  };
}

/* ------------------------------- Sheet 5: tax summary ------------------------------- */

function buildTaxSheet(items: RawItem[]): { sheet: ReportSheet; totals: { taxable: number; tax: number } } {
  interface Agg { rateBp: number | null; taxable: number; cgst: number; sgst: number; igst: number; tax: number; lines: number }
  const byRate = new Map<string, Agg>();
  for (const i of items) {
    const rateBp = i.gstApplied ? i.gstRateBp : null;
    const key = rateBp === null ? "none" : String(rateBp);
    const a = byRate.get(key) ?? { rateBp, taxable: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, lines: 0 };
    a.taxable += i.taxablePaise;
    a.cgst += i.cgstPaise;
    a.sgst += i.sgstPaise;
    a.igst += i.igstPaise;
    a.tax += i.taxPaise;
    a.lines += 1;
    byRate.set(key, a);
  }
  const aggs = [...byRate.values()].sort((a, b) => (a.rateBp ?? -1) - (b.rateBp ?? -1));

  const rows: Row[] = aggs.map((a) => ({
    cells: [a.rateBp === null ? "GST not applied / rate not recorded" : null, a.rateBp, a.taxable, a.cgst, a.sgst, a.igst, a.tax, a.taxable + a.tax, a.lines],
  }));

  return {
    totals: { taxable: sum(aggs.map((a) => a.taxable)), tax: sum(aggs.map((a) => a.tax)) },
    sheet: {
      name: "Tax Summary",
      heading: [
        "Tax Summary — paid orders only, before refunds",
        "Grouped by the GST rate recorded on each order line when the order was placed. 'Invoice value' = taxable value + GST. Shipping charges are excluded (GST on shipping is not calculated by this system). Credit notes for refunds are not reflected here.",
        DISCLAIMER,
      ],
      columns: [
        { header: "Note", type: "text", width: 36 },
        { header: "GST rate", type: "percent", width: 10 },
        { header: "Taxable value (₹)", type: "money", width: 18, sum: true },
        { header: "CGST (₹)", type: "money", width: 14, sum: true },
        { header: "SGST / UTGST (₹)", type: "money", width: 17, sum: true },
        { header: "IGST (₹)", type: "money", width: 14, sum: true },
        { header: "Total tax (₹)", type: "money", width: 15, sum: true },
        { header: "Invoice value (₹)", type: "money", width: 17, sum: true },
        { header: "Order lines", type: "int", width: 12, sum: true },
      ],
      rows,
      filterable: true,
      freezeColumns: 0,
    },
  };
}
