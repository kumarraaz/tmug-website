import Link from "next/link";
import { formatDateTimeIst } from "@/lib/dates";
import { formatPaise } from "@/lib/money";
import { requireAdminPage } from "@/server/auth";
import { isDatabaseConfigured } from "@/server/db";
import { FULFILMENT_LABEL, FULFILMENT_STATUSES, PAYMENT_LABEL, PAYMENT_STATUSES, type FulfilmentStatus, type PaymentStatus } from "@/server/order-core";
import { listOrders } from "@/server/orders-read";
import { FulfilmentBadge, PaymentBadge } from "../../_components/badges";
import { RangeFilter, rangeFromParams } from "../../_components/range";
import { Badge, DatabaseNotConfigured, EmptyState, PageHeader, Pagination, btnSecondary, inputClass, tableClass, tdClass, thClass } from "../../_components/ui";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdminPage();
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Orders" />
        <DatabaseNotConfigured />
      </>
    );
  }

  const sp = await searchParams;
  const { range, preset } = rangeFromParams(sp, { allowAll: true });
  const payment = PAYMENT_STATUSES.includes(sp.payment as PaymentStatus) ? (sp.payment as PaymentStatus) : "all";
  const fulfilment = FULFILMENT_STATUSES.includes(sp.fulfilment as FulfilmentStatus) ? (sp.fulfilment as FulfilmentStatus) : "all";
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const q = sp.q?.trim() ?? "";

  const { rows, total } = await listOrders({ search: q, payment, fulfilment, range, page, pageSize: PAGE_SIZE });

  const keep: Record<string, string | undefined> = { q, payment: payment === "all" ? undefined : payment, fulfilment: fulfilment === "all" ? undefined : fulfilment };
  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...keep, range: preset === "all" ? undefined : preset, from: sp.from, to: sp.to })) if (v) params.set(k, v);
    params.set("page", String(p));
    return `/admin/orders?${params.toString()}`;
  };

  return (
    <>
      <PageHeader title="Orders" subtitle="Every order placed on the store. Records are never deleted." />

      <div className="mb-4 space-y-3">
        <RangeFilter basePath="/admin/orders" preset={preset} range={range} allowAll preserve={keep} />
        <form method="get" className="flex flex-wrap items-end gap-2">
          {preset !== "all" && <input type="hidden" name="range" value={preset} />}
          {preset === "custom" && range && (
            <>
              <input type="hidden" name="from" value={range.fromStr} />
              <input type="hidden" name="to" value={range.toStr} />
            </>
          )}
          <input name="q" defaultValue={q} placeholder="Search order no., name, email, phone, invoice, payment ID" aria-label="Search orders" className={`${inputClass} max-w-md`} />
          <select name="payment" defaultValue={payment} aria-label="Payment status" className={`${inputClass} max-w-[12rem]`}>
            <option value="all">Any payment status</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PAYMENT_LABEL[s]}
              </option>
            ))}
          </select>
          <select name="fulfilment" defaultValue={fulfilment} aria-label="Order status" className={`${inputClass} max-w-[11rem]`}>
            <option value="all">Any order status</option>
            {FULFILMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {FULFILMENT_LABEL[s]}
              </option>
            ))}
          </select>
          <button type="submit" className={btnSecondary}>
            Search
          </button>
          {(q || payment !== "all" || fulfilment !== "all" || preset !== "all") && (
            <Link href="/admin/orders" className="text-xs font-bold text-charcoal/60 underline">
              Reset all
            </Link>
          )}
        </form>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No orders found">{total === 0 && !q && payment === "all" && fulfilment === "all" && preset === "all" ? "Orders will appear here as soon as customers check out." : "Try a different search or date range."}</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-white shadow-xs">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Order</th>
                <th className={thClass}>Date (IST)</th>
                <th className={thClass}>Customer</th>
                <th className={`${thClass} text-right`}>Items</th>
                <th className={`${thClass} text-right`}>Total</th>
                <th className={thClass}>Payment</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="hover:bg-warm-ivory/60">
                  <td className={tdClass}>
                    <Link href={`/admin/orders/${o.id}`} className="font-extrabold text-deep-plum hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-xs`}>{formatDateTimeIst(o.createdAt)}</td>
                  <td className={tdClass}>
                    <p className="font-bold">{o.customerName}</p>
                    <p className="text-xs text-charcoal/60">{o.customerEmail}</p>
                  </td>
                  <td className={`${tdClass} text-right`}>{o.itemCount}</td>
                  <td className={`${tdClass} whitespace-nowrap text-right font-bold`}>
                    {formatPaise(o.totalPaise)}
                    {o.refundedPaise > 0 && <p className="text-xs font-normal text-berry">−{formatPaise(o.refundedPaise)} refunded</p>}
                  </td>
                  <td className={tdClass}>
                    <PaymentBadge status={o.paymentStatus} />
                    {o.paymentMethod && <p className="mt-0.5 text-xs capitalize text-charcoal/55">{o.paymentMethod}</p>}
                  </td>
                  <td className={tdClass}>
                    <FulfilmentBadge status={o.fulfilmentStatus} />
                    {o.needsRefund && (
                      <p className="mt-0.5">
                        <Badge tone="bad">Refund due</Badge>
                      </p>
                    )}
                  </td>
                  <td className={`${tdClass} text-xs`}>{o.invoiceNumber ?? <span className="text-charcoal/40">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pageSize={PAGE_SIZE} total={total} hrefFor={hrefFor} />
    </>
  );
}
