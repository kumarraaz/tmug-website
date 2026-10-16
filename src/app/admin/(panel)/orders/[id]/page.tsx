import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateIst, formatDateTimeIst } from "@/lib/dates";
import { formatRateBp } from "@/lib/tax";
import { formatPaise } from "@/lib/money";
import { requireAdminPage } from "@/server/auth";
import { isDatabaseConfigured } from "@/server/db";
import { FULFILMENT_LABEL } from "@/server/order-core";
import { getOrderDetail } from "@/server/orders-read";
import { FulfilmentBadge, PaymentBadge, TestBadge } from "../../../_components/badges";
import { CancelCard, InvoiceCard, RefundCard, StatusCard } from "../../../_components/OrderActions";
import { Badge, Card, DatabaseNotConfigured, Notice, PageHeader, tableClass, tdClass, thClass } from "../../../_components/ui";

export const dynamic = "force-dynamic";

const FLOW = ["new", "processing", "shipped", "delivered"] as const;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Order" />
        <DatabaseNotConfigured />
      </>
    );
  }
  const { id } = await params;
  const o = await getOrderDetail(id);
  if (!o) notFound();

  const refundable = o.totalPaise - o.refundedPaise;
  const moneyReceived = o.paymentStatus === "paid" || o.paymentStatus === "partially_refunded";
  const cancelled = o.fulfilmentStatus === "cancelled";
  const currentIdx = FLOW.indexOf(o.fulfilmentStatus as (typeof FLOW)[number]);
  const allowedNext = cancelled ? [] : FLOW.filter((_, i) => i > currentIdx).map((v) => ({ value: v, label: FULFILMENT_LABEL[v] }));
  const blockedReason = cancelled
    ? "This order is cancelled and cannot be reopened."
    : o.fulfilmentStatus === "delivered"
      ? "This order has been delivered."
      : o.paymentStatus === "pending" && currentIdx >= 0
        ? "Payment has not been received yet, so the order cannot be shipped."
        : o.paymentStatus === "refunded"
          ? "This order has been fully refunded."
          : undefined;
  const nextForForm = o.paymentStatus === "pending" ? allowedNext.filter((n) => n.value === "processing") : allowedNext;

  const taxTotals = o.items.reduce((a, i) => ({ cgst: a.cgst + i.cgstPaise, sgst: a.sgst + i.sgstPaise, igst: a.igst + i.igstPaise }), { cgst: 0, sgst: 0, igst: 0 });
  const addr = (a: typeof o.shipping) => (
    <address className="not-italic text-sm leading-relaxed">
      <strong>{a.name}</strong>
      <br />
      {a.line1}
      {a.line2 && (
        <>
          <br />
          {a.line2}
        </>
      )}
      <br />
      {a.city}, {a.state} {a.pincode}
      {a.phone && (
        <>
          <br />
          <a href={`tel:${a.phone}`} className="text-charcoal/70 underline">
            {a.phone}
          </a>
        </>
      )}
    </address>
  );

  return (
    <>
      <PageHeader
        title={o.orderNumber}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            Placed {formatDateTimeIst(o.createdAt)} IST <PaymentBadge status={o.paymentStatus} /> <FulfilmentBadge status={o.fulfilmentStatus} />{o.testMode && <TestBadge />}
          </span>
        }
        actions={
          <Link href="/admin/orders" className="text-sm font-bold text-charcoal/70 underline">
            ← All orders
          </Link>
        }
      />

      <div className="mb-4 space-y-2">
        {o.testMode && (
          <Notice tone="info" title="Test order">
            <p>Placed while the payment gateway was on Razorpay test keys, so no real money moved. It is kept for reference but is not counted in the dashboard, payment totals or the CA report.</p>
          </Notice>
        )}
        {cancelled && moneyReceived && refundable > 0 && (
          <Notice tone="bad" title="Cancelled — refund due">
            Payment of {formatPaise(o.totalPaise)} was received. {formatPaise(refundable)} has not been recorded as refunded yet.
          </Notice>
        )}
        {o.paymentStatus === "pending" && (
          <Notice tone="warn" title="Awaiting payment">
            This order is not paid. It stays out of sales figures and cannot be shipped until the payment is verified by the payment gateway.
          </Notice>
        )}
        {o.events.some((e) => e.type === "attention") && (
          <Notice tone="warn" title="Needs attention">
            <ul className="list-disc pl-5">
              {o.events.filter((e) => e.type === "attention").map((e) => (
                <li key={e.id}>{e.message}</li>
              ))}
            </ul>
          </Notice>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-4">
          <Card title="Items">
            <div className="overflow-x-auto">
              <table className={`${tableClass} min-w-[720px]`}>
                <thead>
                  <tr>
                    <th className={thClass}>Product</th>
                    <th className={`${thClass} text-right`}>Qty</th>
                    <th className={`${thClass} text-right`}>Unit price</th>
                    <th className={`${thClass} text-right`}>Discount</th>
                    <th className={`${thClass} text-right`}>Taxable</th>
                    <th className={`${thClass} text-right`}>GST</th>
                    <th className={`${thClass} text-right`}>Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map((i) => (
                    <tr key={i.id}>
                      <td className={tdClass}>
                        <p className="font-bold">{i.name}</p>
                        <p className="text-xs text-charcoal/60">
                          {i.label} · <span className="font-mono">{i.sku}</span>
                          {i.hsnCode ? ` · HSN ${i.hsnCode}` : ""}
                        </p>
                      </td>
                      <td className={`${tdClass} text-right`}>{i.qty}</td>
                      <td className={`${tdClass} text-right`}>{formatPaise(i.unitPricePaise)}</td>
                      <td className={`${tdClass} text-right`}>{i.discountPaise ? `−${formatPaise(i.discountPaise)}` : "—"}</td>
                      <td className={`${tdClass} text-right`}>{formatPaise(i.taxablePaise)}</td>
                      <td className={`${tdClass} text-right`}>{i.gstApplied ? `${formatPaise(i.taxPaise)} (${formatRateBp(i.gstRateBp)})` : <span className="text-charcoal/40">not applied</span>}</td>
                      <td className={`${tdClass} text-right font-bold`}>{formatPaise(i.totalPaise)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="ml-auto mt-4 w-full max-w-sm space-y-1.5 text-sm">
              <Row label="Subtotal" value={formatPaise(o.subtotalPaise)} />
              {o.discountPaise > 0 && <Row label={`Discount${o.couponCode ? ` (${o.couponCode})` : ""}`} value={`−${formatPaise(o.discountPaise)}`} />}
              <Row label="Shipping" value={formatPaise(o.shippingPaise)} />
              {o.taxPaise > 0 && (
                <>
                  <Row label={o.pricesIncludeGst ? "GST (included in price)" : "GST (added)"} value={formatPaise(o.taxPaise)} muted />
                  {taxTotals.cgst + taxTotals.sgst > 0 && <Row label="  CGST + SGST" value={`${formatPaise(taxTotals.cgst)} + ${formatPaise(taxTotals.sgst)}`} muted />}
                  {taxTotals.igst > 0 && <Row label="  IGST" value={formatPaise(taxTotals.igst)} muted />}
                </>
              )}
              <div className="flex items-baseline justify-between border-t border-charcoal/15 pt-2">
                <dt className="font-extrabold">Grand total</dt>
                <dd className="font-display text-xl font-black text-deep-plum">{formatPaise(o.totalPaise)}</dd>
              </div>
              {o.refundedPaise > 0 && <Row label="Refunded" value={`−${formatPaise(o.refundedPaise)}`} />}
              {o.refundedPaise > 0 && <Row label="Net after refunds" value={formatPaise(o.totalPaise - o.refundedPaise)} bold />}
            </dl>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Customer">
              <p className="font-bold">{o.customer.name}</p>
              <p className="text-sm">
                <a href={`mailto:${o.customer.email}`} className="underline">
                  {o.customer.email}
                </a>
              </p>
              <p className="text-sm">
                <a href={`tel:${o.customer.phone}`} className="underline">
                  {o.customer.phone}
                </a>
              </p>
              {o.customerNote && <p className="mt-2 rounded-lg bg-warm-ivory p-2 text-sm">“{o.customerNote}”</p>}
            </Card>
            <Card title="Delivery (place of supply)">{addr(o.shipping)}</Card>
            <Card title="Billing address">{addr(o.billing)}</Card>
            <Card title="Payment & references">
              <dl className="space-y-1 text-sm">
                <Row label="Method" value={o.paymentMethod ? o.paymentMethod.toUpperCase() : "—"} />
                <Row label="Paid at" value={o.paidAt ? `${formatDateTimeIst(o.paidAt)} IST` : "—"} />
                <Row label="Invoice no." value={o.invoiceNumber ?? "Not issued"} />
                <Row label="Invoice date" value={o.invoiceDate ? formatDateIst(new Date(`${o.invoiceDate}T00:00:00+05:30`)) : "—"} />
                <Row label="Gateway order" value={o.gatewayOrderId ?? "—"} mono />
                <Row label="Tracking" value={o.trackingReference ?? "—"} />
                {o.gstEnabled && <Row label="Seller GSTIN" value={o.sellerGstin ?? "not configured"} mono />}
              </dl>
            </Card>
          </div>

          <Card title="Payments">
            {o.payments.length === 0 ? (
              <p className="text-sm text-charcoal/60">No payment attempts recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th className={thClass}>Payment ID</th>
                      <th className={thClass}>Method</th>
                      <th className={thClass}>Status</th>
                      <th className={`${thClass} text-right`}>Amount</th>
                      <th className={`${thClass} text-right`}>Refunded</th>
                      <th className={thClass}>Date (IST)</th>
                      <th className={thClass}>Verified via</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.payments.map((p) => (
                      <tr key={p.id}>
                        <td className={`${tdClass} font-mono text-xs`}>{p.gatewayPaymentId ?? "—"}</td>
                        <td className={`${tdClass} capitalize`}>{p.method ?? "—"}</td>
                        <td className={tdClass}>
                          <Badge tone={p.status === "captured" ? "good" : p.status === "failed" ? "bad" : "info"}>{p.status.replace("_", " ")}</Badge>
                          {p.failureReason && <p className="text-xs text-charcoal/55">{p.failureReason}</p>}
                        </td>
                        <td className={`${tdClass} text-right`}>{formatPaise(p.amountPaise)}</td>
                        <td className={`${tdClass} text-right`}>{p.refundedPaise ? formatPaise(p.refundedPaise) : "—"}</td>
                        <td className={`${tdClass} whitespace-nowrap text-xs`}>{formatDateTimeIst(p.paidAt ?? p.createdAt)}</td>
                        <td className={`${tdClass} text-xs capitalize`}>{p.verifiedVia ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {o.refunds.length > 0 && (
              <>
                <h3 className="mb-1 mt-4 text-xs font-extrabold uppercase tracking-wide text-charcoal/60">Refunds</h3>
                <ul className="divide-y divide-charcoal/10 text-sm">
                  {o.refunds.map((r) => (
                    <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <span>
                        <strong>{formatPaise(r.amountPaise)}</strong> · {r.reason || "—"}
                        {r.reference && <span className="ml-2 font-mono text-xs text-charcoal/60">{r.reference}</span>}
                      </span>
                      <span className="text-xs text-charcoal/60">
                        {formatDateTimeIst(r.refundedAt)} · {r.source} · {r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>

          <Card title="Activity">
            <ol className="space-y-2 text-sm">
              {o.events.map((e) => (
                <li key={e.id} className="flex gap-3">
                  <span className="w-36 shrink-0 text-xs text-charcoal/55">{formatDateTimeIst(e.at)}</span>
                  <span>
                    {e.message} <span className="text-xs text-charcoal/45">· {e.actor}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <aside className="space-y-4">
          <StatusCard orderId={o.id} current={FULFILMENT_LABEL[o.fulfilmentStatus]} allowedNext={nextForForm} tracking={o.trackingReference ?? ""} blockedReason={blockedReason} />
          <InvoiceCard orderId={o.id} invoiceNumber={o.invoiceNumber ?? ""} invoiceDate={o.invoiceDate ?? ""} adminNote={o.adminNote} />
          {moneyReceived && refundable > 0 && <RefundCard orderId={o.id} refundableRupees={refundable / 100} />}
          {!cancelled && o.fulfilmentStatus !== "delivered" && <CancelCard orderId={o.id} paidNotRefunded={moneyReceived && refundable > 0} />}
        </aside>
      </div>
    </>
  );
}

function Row({ label, value, bold, muted, mono }: { label: string; value: string; bold?: boolean; muted?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={muted ? "text-charcoal/55" : "text-charcoal/75"}>{label}</dt>
      <dd className={`text-right ${bold ? "font-extrabold" : "font-semibold"} ${mono ? "break-all font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
