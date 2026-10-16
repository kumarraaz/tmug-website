import "server-only";
import { fyLabel, fyMonthRange, type DateRange } from "@/lib/dates";
import type { FulfilmentStatus, PaymentStatus, RawAddress, RawItem, RawOrder, RawPayment, ReportInput } from "@/lib/report";
import { query } from "./db";
import { getSettings } from "./settings";

/** Loads the raw records for one financial-year month. All figures come straight from the database. */

interface OrderRow {
  id: string; order_number: string; created_at: Date; customer_name: string; customer_email: string; customer_phone: string;
  shipping_name: string; shipping_line1: string; shipping_line2: string; shipping_city: string; shipping_state: string; shipping_pincode: string;
  billing_name: string; billing_line1: string; billing_line2: string; billing_city: string; billing_state: string; billing_pincode: string;
  payment_status: PaymentStatus; fulfilment_status: FulfilmentStatus; payment_method: string | null;
  subtotal_paise: number; discount_paise: number; shipping_paise: number; tax_paise: number; total_paise: number; refunded_paise: number;
  gst_enabled: boolean; prices_include_gst: boolean; invoice_number: string | null; invoice_date: string | null;
}

interface ItemRow {
  order_id: string; product_name: string; variant_label: string; sku: string; category: string; hsn_code: string | null; qty: number;
  unit_price_paise: number; gross_paise: number; discount_paise: number; gst_applied: boolean; gst_rate_bp: number | null;
  taxable_paise: number; cgst_paise: number; sgst_paise: number; igst_paise: number; tax_paise: number; total_paise: number;
}

interface PaymentRow {
  order_id: string; gateway: string; gateway_payment_id: string | null; method: string | null; status: string;
  amount_paise: number; refunded_paise: number; paid_at: Date | null; created_at: Date;
}

export const MIN_REPORT_FY = 2020;

export function periodFor(fyStartYear: number, month: number): DateRange & { periodLabel: string; fy: string } {
  const range = fyMonthRange(fyStartYear, month);
  return { ...range, periodLabel: range.label, fy: fyLabel(fyStartYear) };
}

export async function loadReportInput(fyStartYear: number, month: number, now = new Date()): Promise<ReportInput> {
  const range = periodFor(fyStartYear, month);
  const settings = await getSettings();

  const orderRows = await query<OrderRow>(
    "SELECT * FROM orders WHERE created_at >= $1 AND created_at < $2 ORDER BY created_at, order_number",
    [range.start, range.endExclusive],
  );
  const ids = orderRows.map((o) => o.id);

  const [itemRows, paymentRows] =
    ids.length === 0
      ? [[] as ItemRow[], [] as PaymentRow[]]
      : await Promise.all([
          query<ItemRow>("SELECT * FROM order_items WHERE order_id = ANY($1::uuid[]) ORDER BY order_id, position", [ids]),
          query<PaymentRow>("SELECT * FROM payments WHERE order_id = ANY($1::uuid[]) ORDER BY created_at", [ids]),
        ]);

  const itemsByOrder = new Map<string, RawItem[]>();
  for (const i of itemRows) {
    const list = itemsByOrder.get(i.order_id) ?? [];
    list.push({
      productName: i.product_name, variantLabel: i.variant_label, sku: i.sku, category: i.category, hsnCode: i.hsn_code, qty: i.qty,
      unitPricePaise: i.unit_price_paise, grossPaise: i.gross_paise, discountPaise: i.discount_paise, gstApplied: i.gst_applied, gstRateBp: i.gst_rate_bp,
      taxablePaise: i.taxable_paise, cgstPaise: i.cgst_paise, sgstPaise: i.sgst_paise, igstPaise: i.igst_paise, taxPaise: i.tax_paise, totalPaise: i.total_paise,
    });
    itemsByOrder.set(i.order_id, list);
  }
  const paymentsByOrder = new Map<string, RawPayment[]>();
  for (const p of paymentRows) {
    const list = paymentsByOrder.get(p.order_id) ?? [];
    list.push({
      gatewayPaymentId: p.gateway_payment_id, gateway: p.gateway, method: p.method, status: p.status, amountPaise: p.amount_paise,
      refundedPaise: p.refunded_paise, paidAt: p.paid_at, createdAt: p.created_at,
    });
    paymentsByOrder.set(p.order_id, list);
  }

  const orders: RawOrder[] = orderRows.map((o) => {
    const billing: RawAddress = { name: o.billing_name, line1: o.billing_line1, line2: o.billing_line2, city: o.billing_city, state: o.billing_state, pincode: o.billing_pincode };
    const shipping: RawAddress = { name: o.shipping_name, line1: o.shipping_line1, line2: o.shipping_line2, city: o.shipping_city, state: o.shipping_state, pincode: o.shipping_pincode };
    return {
      orderNumber: o.order_number, createdAt: o.created_at, customerName: o.customer_name, customerEmail: o.customer_email, customerPhone: o.customer_phone,
      billing, shipping, paymentStatus: o.payment_status, fulfilmentStatus: o.fulfilment_status, paymentMethod: o.payment_method,
      subtotalPaise: o.subtotal_paise, discountPaise: o.discount_paise, shippingPaise: o.shipping_paise, taxPaise: o.tax_paise, totalPaise: o.total_paise,
      refundedPaise: o.refunded_paise, gstEnabled: o.gst_enabled, pricesIncludeGst: o.prices_include_gst, invoiceNumber: o.invoice_number, invoiceDate: o.invoice_date,
      items: itemsByOrder.get(o.id) ?? [], payments: paymentsByOrder.get(o.id) ?? [],
    };
  });

  return {
    periodLabel: range.periodLabel,
    fyLabel: fyLabel(fyStartYear),
    fromStr: range.fromStr,
    toStr: range.toStr,
    generatedAt: now,
    store: {
      storeName: settings.storeName,
      legalName: settings.legalName,
      gstin: settings.gst.gstin,
      businessState: settings.gst.businessState,
      address: settings.address,
    },
    orders,
  };
}

/** Earliest and latest financial years that could hold data (for the picker). */
export async function reportYearBounds(): Promise<{ first: number | null }> {
  const row = await query<{ first: Date | null }>("SELECT MIN(created_at) AS first FROM orders");
  const first = row[0]?.first;
  if (!first) return { first: null };
  const ist = new Date(first.getTime() + 330 * 60 * 1000);
  const month = ist.getUTCMonth() + 1;
  return { first: month >= 4 ? ist.getUTCFullYear() : ist.getUTCFullYear() - 1 };
}
