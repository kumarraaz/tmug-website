import { headers } from "next/headers";
import Link from "next/link";
import { formatDateTimeIst } from "@/lib/dates";
import { formatPaise } from "@/lib/money";
import { requireAdminPage } from "@/server/auth";
import { isDatabaseConfigured } from "@/server/db";
import { listPayments, paymentMethods } from "@/server/orders-read";
import { getGatewayStatus } from "@/server/razorpay";
import { TestBadge } from "../../_components/badges";
import { GatewayStatusCard } from "../../_components/GatewayStatus";
import { RangeFilter, rangeFromParams } from "../../_components/range";
import { Badge, DatabaseNotConfigured, EmptyState, PageHeader, Pagination, StatTile, btnSecondary, inputClass, tableClass, tdClass, thClass } from "../../_components/ui";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 30;
const STATUSES = ["captured", "partially_refunded", "refunded", "authorized", "created", "failed"];

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdminPage();
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "your-domain";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const gateway = getGatewayStatus();
  const webhookUrl = `${proto}://${host}/api/payments/razorpay/webhook`;

  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Payments" />
        <div className="space-y-4">
          <DatabaseNotConfigured />
          <GatewayStatusCard status={gateway} webhookUrl={webhookUrl} />
        </div>
      </>
    );
  }

  const sp = await searchParams;
  const { range, preset } = rangeFromParams(sp, { allowAll: true });
  const status = STATUSES.includes(sp.status ?? "") ? (sp.status as string) : "all";
  const method = sp.method && sp.method !== "all" ? sp.method : "all";
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const [{ rows, total, totals }, methods] = await Promise.all([listPayments({ range, status, method, page, pageSize: PAGE_SIZE }), paymentMethods()]);

  const keep = { status: status === "all" ? undefined : status, method: method === "all" ? undefined : method };
  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...keep, range: preset === "all" ? undefined : preset, from: sp.from, to: sp.to })) if (v) params.set(k, v);
    params.set("page", String(p));
    return `/admin/payments?${params.toString()}`;
  };

  return (
    <>
      <PageHeader title="Payments" subtitle="Every payment attempt from the payment gateway. A payment is shown as Captured only after it was verified on the server." />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatTile label="Received" value={formatPaise(totals.receivedPaise)} hint={totals.testPayments > 0 ? `Real payments only · ${totals.testPayments} test payment${totals.testPayments === 1 ? "" : "s"} not counted` : "Captured payments in this view"} tone="good" />
        <StatTile label="Refunded" value={formatPaise(totals.refundedPaise)} hint="Against those payments" tone={totals.refundedPaise > 0 ? "bad" : "default"} />
        <StatTile label="Net collected" value={formatPaise(totals.receivedPaise - totals.refundedPaise)} hint={`${total} payment record${total === 1 ? "" : "s"}`} />
      </div>

      <div className="mb-4 space-y-3">
        <RangeFilter basePath="/admin/payments" preset={preset} range={range} allowAll preserve={keep} />
        <form method="get" className="flex flex-wrap items-end gap-2">
          {preset !== "all" && <input type="hidden" name="range" value={preset} />}
          {preset === "custom" && range && (
            <>
              <input type="hidden" name="from" value={range.fromStr} />
              <input type="hidden" name="to" value={range.toStr} />
            </>
          )}
          <select name="status" defaultValue={status} aria-label="Payment status" className={`${inputClass} max-w-[12rem]`}>
            <option value="all">Any status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
          <select name="method" defaultValue={method} aria-label="Payment method" className={`${inputClass} max-w-[12rem]`}>
            <option value="all">Any method</option>
            {methods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button type="submit" className={btnSecondary}>
            Filter
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No payments found">Payments appear here after customers start paying through the checkout.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-white shadow-xs">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Date (IST)</th>
                <th className={thClass}>Order</th>
                <th className={thClass}>Payment ID</th>
                <th className={thClass}>Method</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Amount</th>
                <th className={`${thClass} text-right`}>Refunded</th>
                <th className={thClass}>Verified via</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-warm-ivory/60">
                  <td className={`${tdClass} whitespace-nowrap text-xs`}>{formatDateTimeIst(p.paidAt ?? p.createdAt)}</td>
                  <td className={tdClass}>
                    <Link href={`/admin/orders/${p.orderId}`} className="font-extrabold text-deep-plum hover:underline">
                      {p.orderNumber}
                    </Link>
                    {p.testMode && (
                      <span className="ml-2 align-middle">
                        <TestBadge />
                      </span>
                    )}
                    <p className="text-xs text-charcoal/60">{p.customerName}</p>
                  </td>
                  <td className={`${tdClass} font-mono text-xs`}>{p.gatewayPaymentId ?? "—"}</td>
                  <td className={`${tdClass} capitalize`}>{p.method ?? "—"}</td>
                  <td className={tdClass}>
                    <Badge tone={p.status === "captured" ? "good" : p.status === "failed" ? "bad" : p.status === "created" || p.status === "authorized" ? "warn" : "info"}>{p.status.replace("_", " ")}</Badge>
                  </td>
                  <td className={`${tdClass} text-right font-bold`}>{formatPaise(p.amountPaise)}</td>
                  <td className={`${tdClass} text-right`}>{p.refundedPaise ? formatPaise(p.refundedPaise) : "—"}</td>
                  <td className={`${tdClass} text-xs capitalize`}>{p.verifiedVia ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} pageSize={PAGE_SIZE} total={total} hrefFor={hrefFor} />

      <div className="mt-6">
        <GatewayStatusCard status={gateway} webhookUrl={webhookUrl} />
      </div>
    </>
  );
}
