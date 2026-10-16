import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusWatcher from "@/components/OrderStatusWatcher";
import PageShell from "@/components/PageShell";
import { siteConfig, whatsappLink } from "@/config/site";
import { formatDateTimeIst } from "@/lib/dates";
import { formatPaise } from "@/lib/money";
import { getPublicOrder } from "@/server/orders-read";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/**
 * Order confirmation. This page only REPORTS what the database says. Arriving here proves
 * nothing: an order shows as paid only after the server verified the payment.
 */
export default async function OrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getPublicOrder(token);
  if (!order) notFound();

  const paid = order.paymentStatus === "paid" || order.paymentStatus === "partially_refunded";
  const refunded = order.paymentStatus === "refunded";
  const cancelled = order.fulfilmentStatus === "cancelled";
  const pending = order.paymentStatus === "pending" && !cancelled;
  const stillWaiting = pending && order.ageMinutes < 30;

  const headline = refunded
    ? "This order was refunded"
    : cancelled && !paid
      ? "This order was cancelled"
      : paid
        ? "Thank you — your payment is confirmed"
        : stillWaiting
          ? "Confirming your payment…"
          : "We haven’t received a payment for this order";
  const tone = paid ? "bg-olivine/25 text-[#2f5d35]" : refunded || cancelled ? "bg-charcoal/10 text-charcoal" : "bg-fawn/30 text-[#6b3f0b]";
  const support = whatsappLink(`Hi TMUG, I need help with my order ${order.orderNumber}.`);

  return (
    <PageShell>
      <OrderStatusWatcher token={token} paid={paid} pending={stillWaiting} />
      <div className="bg-cream pb-16 pt-8 sm:pt-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className={`rounded-3xl px-5 py-5 sm:px-6 ${tone}`} role="status">
            <p className="font-display text-2xl font-black sm:text-3xl">{headline}</p>
            <p className="mt-1 text-sm">
              Order <strong>{order.orderNumber}</strong> · placed {formatDateTimeIst(order.createdAt)} IST
            </p>
            {paid && <p className="mt-2 text-sm">We’ll pack your tea and ship it to {order.shippingCity}, {order.shippingState}. Keep your order number handy for any questions.</p>}
            {stillWaiting && <p className="mt-2 text-sm">This usually takes a few seconds. This page updates by itself — you don’t need to pay again.</p>}
            {pending && !stillWaiting && (
              <p className="mt-2 text-sm">
                If money was deducted from your account, it will be matched to this order automatically or returned by your bank. For quick help, message us on WhatsApp with the order number.
              </p>
            )}
          </div>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-xs ring-1 ring-charcoal/10 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-charcoal">Items</h2>
            <ul className="mt-3 divide-y divide-charcoal/10">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex items-center gap-3 py-3">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-warm-surface">{i.image && <Image src={i.image} alt="" fill sizes="56px" className="object-contain p-1" />}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold text-charcoal">{i.name}</span>
                    <span className="block text-xs text-charcoal/60">
                      {i.label} × {i.qty}
                    </span>
                  </span>
                  <span className="text-sm font-bold">{formatPaise(i.totalPaise)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-charcoal/10 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-charcoal/70">Subtotal</dt><dd className="font-bold">{formatPaise(order.subtotalPaise)}</dd></div>
              {order.discountPaise > 0 && <div className="flex justify-between text-berry"><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt><dd className="font-bold">−{formatPaise(order.discountPaise)}</dd></div>}
              <div className="flex justify-between"><dt className="text-charcoal/70">Shipping</dt><dd className="font-bold">{order.shippingPaise === 0 ? "Free" : formatPaise(order.shippingPaise)}</dd></div>
              {order.gstEnabled && order.taxPaise > 0 && <div className="flex justify-between text-charcoal/60"><dt>{order.pricesIncludeGst ? "Includes GST" : "GST"}</dt><dd>{formatPaise(order.taxPaise)}</dd></div>}
              <div className="flex items-baseline justify-between border-t border-charcoal/15 pt-2"><dt className="font-extrabold">Total</dt><dd className="font-display text-xl font-black">{formatPaise(order.totalPaise)}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-charcoal/55">
              Confirmation for {order.customerName} · {order.emailMasked}. Keep this page’s link — it is private to you.
            </p>
          </section>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/#shop" className="rounded-full bg-charcoal px-6 py-3 text-sm font-extrabold text-white hover:bg-tea-gold hover:text-charcoal">
              Continue shopping
            </Link>
            <a href={support} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-charcoal/15 px-6 py-3 text-sm font-bold text-charcoal">
              Need help? WhatsApp {siteConfig.whatsapp.display}
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
