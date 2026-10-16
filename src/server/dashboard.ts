import "server-only";
import { istParts, monthRange, type DateRange } from "@/lib/dates";
import { query, queryOne } from "./db";
import { lowStockVariants, productCounts, type LowStockRow } from "./products-admin";
import { getSettings } from "./settings";

/**
 * Dashboard numbers. Every figure is an aggregate over real database rows — nothing is
 * hard-coded or sampled. "Sales" = orders for which payment was received (paid, or later
 * refunded); the period is the ORDER date (IST), the same basis as the CA report.
 * Orders taken with Razorpay TEST keys (orders.test_mode) involve no real money and are never counted.
 */

const SALE = "('paid','partially_refunded','refunded')";

export interface DashboardData {
  range: DateRange;
  gstEnabled: boolean;
  lowStockThreshold: number;
  totalSalesPaise: number;
  salesOrders: number;
  discountsPaise: number;
  refundsPaise: number;
  netRevenuePaise: number;
  gstPaise: number;
  totalOrders: number;
  /** Test-key orders in the period: listed in Orders, but not counted anywhere on this page. */
  testOrders: number;
  orderCounts: { paid: number; pending: number; cancelled: number; refunded: number };
  paymentMethods: { method: string; count: number; amountPaise: number }[];
  monthlyRevenue: { label: string; year: number; month: number; orders: number; salesPaise: number; refundsPaise: number; netPaise: number }[];
  products: { total: number; active: number; inactive: number; lowStockCount: number; lowStock: LowStockRow[]; trackedVariants: number };
}

const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getDashboard(range: DateRange, now = new Date()): Promise<DashboardData> {
  const settings = await getSettings();
  const bounds = [range.start, range.endExclusive];

  const sales = await queryOne<{ orders: number; total: number; discount: number; refunded: number; tax: number }>(
    `SELECT COUNT(*)::int AS orders,
            COALESCE(SUM(total_paise), 0)::bigint AS total,
            COALESCE(SUM(discount_paise), 0)::bigint AS discount,
            COALESCE(SUM(refunded_paise), 0)::bigint AS refunded,
            COALESCE(SUM(tax_paise), 0)::bigint AS tax
       FROM orders WHERE NOT test_mode AND payment_status IN ${SALE} AND created_at >= $1 AND created_at < $2`,
    bounds,
  );

  // Mutually exclusive buckets (priority: cancelled > refunded > paid > pending) so they add up to the total.
  const counts = await queryOne<{ total: number; cancelled: number; refunded: number; paid: number; pending: number; test: number }>(
    `SELECT COUNT(*) FILTER (WHERE NOT test_mode)::int AS total,
            COUNT(*) FILTER (WHERE test_mode)::int AS test,
            COUNT(*) FILTER (WHERE NOT test_mode AND fulfilment_status = 'cancelled')::int AS cancelled,
            COUNT(*) FILTER (WHERE NOT test_mode AND fulfilment_status <> 'cancelled' AND payment_status IN ('refunded','partially_refunded'))::int AS refunded,
            COUNT(*) FILTER (WHERE NOT test_mode AND fulfilment_status <> 'cancelled' AND payment_status = 'paid')::int AS paid,
            COUNT(*) FILTER (WHERE NOT test_mode AND fulfilment_status <> 'cancelled' AND payment_status = 'pending')::int AS pending
       FROM orders WHERE created_at >= $1 AND created_at < $2`,
    bounds,
  );

  const methods = await query<{ method: string; n: number; amount: number }>(
    `SELECT COALESCE(p.method, 'unknown') AS method, COUNT(*)::int AS n, COALESCE(SUM(p.amount_paise), 0)::bigint AS amount
       FROM payments p JOIN orders o ON o.id = p.order_id
      WHERE NOT o.test_mode AND p.status IN ('captured','partially_refunded','refunded') AND o.created_at >= $1 AND o.created_at < $2
      GROUP BY 1 ORDER BY amount DESC`,
    bounds,
  );

  // Last 12 IST calendar months (current month included).
  const nowIst = istParts(now);
  const months: { year: number; month: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const idx = nowIst.year * 12 + (nowIst.month - 1) - i;
    months.push({ year: Math.floor(idx / 12), month: (idx % 12) + 1 });
  }
  const firstStart = monthRange(months[0].year, months[0].month).start;
  const monthly = await query<{ ym: string; orders: number; sales: number; refunds: number }>(
    `SELECT to_char(date_trunc('month', created_at AT TIME ZONE 'Asia/Kolkata'), 'YYYY-MM') AS ym,
            COUNT(*)::int AS orders, COALESCE(SUM(total_paise), 0)::bigint AS sales, COALESCE(SUM(refunded_paise), 0)::bigint AS refunds
       FROM orders WHERE NOT test_mode AND payment_status IN ${SALE} AND created_at >= $1 GROUP BY 1`,
    [firstStart],
  );
  const byYm = new Map(monthly.map((m) => [m.ym, m]));

  const counts_ = await productCounts();
  const lowStock = await lowStockVariants(settings.lowStockThreshold, 10);
  const lowCount = await queryOne<{ n: number; tracked: number }>(
    `SELECT COUNT(*) FILTER (WHERE v.stock_quantity IS NOT NULL AND v.stock_quantity <= $1)::int AS n,
            COUNT(*) FILTER (WHERE v.stock_quantity IS NOT NULL)::int AS tracked
       FROM product_variants v JOIN products p ON p.id = v.product_id WHERE p.is_active`,
    [settings.lowStockThreshold],
  );

  const total = sales?.total ?? 0;
  const refunds = sales?.refunded ?? 0;
  return {
    range,
    gstEnabled: settings.gst.enabled,
    lowStockThreshold: settings.lowStockThreshold,
    totalSalesPaise: total,
    salesOrders: sales?.orders ?? 0,
    discountsPaise: sales?.discount ?? 0,
    refundsPaise: refunds,
    netRevenuePaise: total - refunds,
    gstPaise: sales?.tax ?? 0,
    totalOrders: counts?.total ?? 0,
    testOrders: counts?.test ?? 0,
    orderCounts: { paid: counts?.paid ?? 0, pending: counts?.pending ?? 0, cancelled: counts?.cancelled ?? 0, refunded: counts?.refunded ?? 0 },
    paymentMethods: methods.map((m) => ({ method: m.method, count: m.n, amountPaise: m.amount })),
    monthlyRevenue: months.map(({ year, month }) => {
      const row = byYm.get(`${year}-${String(month).padStart(2, "0")}`);
      const sales_ = row?.sales ?? 0;
      const refunds_ = row?.refunds ?? 0;
      return { label: `${SHORT[month - 1]} ${String(year).slice(2)}`, year, month, orders: row?.orders ?? 0, salesPaise: sales_, refundsPaise: refunds_, netPaise: sales_ - refunds_ };
    }),
    products: {
      total: counts_.total,
      active: counts_.active,
      inactive: counts_.inactive,
      lowStockCount: lowCount?.n ?? 0,
      lowStock,
      trackedVariants: lowCount?.tracked ?? 0,
    },
  };
}
