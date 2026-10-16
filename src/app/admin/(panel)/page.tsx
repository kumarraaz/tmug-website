import Link from "next/link";
import { formatPaise } from "@/lib/money";
import { requireAdminPage } from "@/server/auth";
import { getDashboard } from "@/server/dashboard";
import { isDatabaseConfigured, databaseStatus } from "@/server/db";
import { getGatewayStatus } from "@/server/razorpay";
import { Badge, Card, DatabaseError, DatabaseNotConfigured, Notice, PageHeader, StatTile } from "../_components/ui";
import { RangeFilter, rangeFromParams } from "../_components/range";

export const dynamic = "force-dynamic";

const NOTE_TONE: Record<string, string> = {
  good: "text-[#2f5d35]",
  warn: "text-[#8a5a12]",
  bad: "text-berry",
  info: "text-[#1f5f80]",
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdminPage();
  const sp = await searchParams;
  const { range, preset } = rangeFromParams(sp, { allowAll: false });

  const gateway = getGatewayStatus();

  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Live business numbers from your orders and products." />
        <DatabaseNotConfigured />
      </>
    );
  }

  const db = await databaseStatus();
  if (!db.connected || !range) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <DatabaseError message={db.error ?? "Unknown error"} />
      </>
    );
  }

  const d = await getDashboard(range);
  const maxMonth = Math.max(1, ...d.monthlyRevenue.map((m) => m.salesPaise));
  const maxMethod = Math.max(1, ...d.paymentMethods.map((m) => m.amountPaise));

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`Showing orders placed ${d.range.label}. Sales count orders where payment was received.`} />

      <div className="mb-5 space-y-3">
        <RangeFilter basePath="/admin" preset={preset} range={range} />
        {!gateway.configured && (
          <Notice tone="warn" title="Online payments are not configured">
            <p>
              Customers cannot pay online until the Razorpay keys are set. Orders appear here only after a payment is verified.{" "}
              <Link href="/admin/settings" className="font-bold underline">
                See what is missing →
              </Link>
            </p>
          </Notice>
        )}
      </div>

      {d.testOrders > 0 && (
        <div className="mb-5">
          <Notice tone="info" title="Test orders are not counted">
            <p>
              {d.testOrders} order{d.testOrders === 1 ? "" : "s"} in this period {d.testOrders === 1 ? "was" : "were"} placed while Razorpay was on test keys (no real money). {d.testOrders === 1 ? "It is" : "They are"} listed under{" "}
              <Link href="/admin/orders" className="font-bold underline">Orders</Link> but left out of every number on this page and out of the CA report.
            </p>
          </Notice>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Total sales" value={formatPaise(d.totalSalesPaise)} hint={`${d.salesOrders} order${d.salesOrders === 1 ? "" : "s"} with payment received · incl. shipping & GST`} tone="good" />
        <StatTile label="Net revenue" value={formatPaise(d.netRevenuePaise)} hint="Sales minus refunds" />
        <StatTile label="Discounts given" value={formatPaise(d.discountsPaise)} hint="Coupons on paid orders" tone="warn" />
        <StatTile label="Refunds" value={formatPaise(d.refundsPaise)} hint="Recorded on these orders" tone={d.refundsPaise > 0 ? "bad" : "default"} />
        <StatTile label="GST included in sales" value={d.gstEnabled || d.gstPaise > 0 ? formatPaise(d.gstPaise) : "—"} hint={d.gstEnabled ? "From order tax records" : "GST is not enabled in Settings"} />
        <StatTile label="Total orders" value={d.totalOrders} hint="All statuses" />
        <StatTile label="Total products" value={d.products.total} hint={`${d.products.active} active · ${d.products.inactive} inactive`} />
        <StatTile
          label="Low-stock items"
          value={d.products.trackedVariants === 0 ? "—" : d.products.lowStockCount}
          hint={d.products.trackedVariants === 0 ? "Stock not tracked yet" : `At or below ${d.lowStockThreshold} units`}
          tone={d.products.lowStockCount > 0 ? "warn" : "default"}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card title="Orders by status" subtitle="Each order is counted in one box only, checked in this order: cancelled, refunded, paid, awaiting payment.">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Paid", d.orderCounts.paid, "good", "payment received"],
              ["Awaiting payment", d.orderCounts.pending, "warn", "not paid yet"],
              ["Cancelled", d.orderCounts.cancelled, "bad", "any payment state"],
              ["Refunded", d.orderCounts.refunded, "info", "full or partial"],
            ].map(([label, value, tone, note]) => (
              <div key={label as string} className="rounded-xl bg-warm-ivory p-3 text-center">
                <dt className="text-[11px] font-extrabold uppercase tracking-wide text-charcoal/60">{label}</dt>
                <dd className="mt-1 font-display text-2xl font-black text-deep-plum">{value}</dd>
                <p className={`mt-1 text-[11px] font-bold leading-snug ${NOTE_TONE[tone as string]}`}>{note as string}</p>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-charcoal/60">
            An order that was paid and later cancelled or refunded is shown under Cancelled / Refunded here, but its payment still counts in Total sales; refunds are taken off in Net revenue. Awaiting payment includes checkouts a customer may have abandoned.{" "}
            <Link href="/admin/orders?payment=pending" className="font-bold underline">Review unpaid orders</Link>
          </p>
        </Card>

        <Card title="Payment methods" subtitle="Captured payments on orders in this period.">
          {d.paymentMethods.length === 0 ? (
            <p className="text-sm text-charcoal/60">No payments received in this period.</p>
          ) : (
            <ul className="space-y-3">
              {d.paymentMethods.map((m) => (
                <li key={m.method}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-bold capitalize">{m.method}</span>
                    <span className="text-charcoal/70">
                      {formatPaise(m.amountPaise)} · {m.count} payment{m.count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-charcoal/10">
                    <div className="h-full rounded-full bg-cherry-blossom" style={{ width: `${Math.max(3, (m.amountPaise / maxMethod) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-4" title="Monthly revenue" subtitle="Last 12 months (IST). Bars show sales; refunds are listed underneath.">
        <div className="flex h-44 items-end gap-1.5 sm:gap-2" role="img" aria-label="Monthly revenue bar chart">
          {d.monthlyRevenue.map((m) => (
            <div key={`${m.year}-${m.month}`} className="flex h-full min-w-0 flex-1 flex-col justify-end" title={`${m.label}: ${formatPaise(m.salesPaise)} from ${m.orders} order${m.orders === 1 ? "" : "s"}`}>
              <div className="w-full rounded-t-md bg-cherry-blossom" style={{ height: `${m.salesPaise === 0 ? 2 : Math.max(4, (m.salesPaise / maxMonth) * 100)}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-1.5 sm:gap-2">
          {d.monthlyRevenue.map((m) => (
            <div key={`${m.year}-${m.month}`} className="min-w-0 flex-1 text-center">
              <p className="truncate text-[10px] font-bold text-charcoal/70">{m.label}</p>
              <p className="truncate text-[10px] text-charcoal/50">{m.salesPaise === 0 ? "–" : formatPaise(m.salesPaise).replace(".00", "")}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4" title="Low-stock products" subtitle={d.products.trackedVariants === 0 ? "Stock is not tracked yet. Enter a stock quantity on a product variant to start tracking it." : `Variants with ${d.lowStockThreshold} or fewer units left (threshold is in Settings).`}>
        {d.products.lowStock.length === 0 ? (
          <p className="text-sm text-charcoal/60">{d.products.trackedVariants === 0 ? "No variants have stock tracking enabled." : "Nothing is running low."}</p>
        ) : (
          <ul className="divide-y divide-charcoal/10 text-sm">
            {d.products.lowStock.map((p) => (
              <li key={`${p.productId}-${p.sku}`} className="flex items-center justify-between gap-3 py-2">
                <Link href={`/admin/products/${p.productId}`} className="font-bold hover:underline">
                  {p.productName} <span className="font-normal text-charcoal/60">({p.variantLabel})</span>
                </Link>
                <Badge tone={p.stock === 0 ? "bad" : "warn"}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
