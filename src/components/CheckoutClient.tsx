"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { checkoutSchema } from "@/lib/checkout-schema";
import { INDIAN_STATE_NAMES } from "@/lib/india";
import { formatPaise } from "@/lib/money";
import { siteConfig, whatsappLink } from "@/config/site";
import { useShop } from "@/lib/store";

/**
 * Checkout. The browser only ever sends variant ids + quantities + customer details; the
 * server re-prices everything from the database, so what is shown here is the server's quote.
 * The order is marked paid by the server after it verifies the payment — never by this page.
 */

interface QuoteLine {
  variantId: string;
  productName: string;
  variantLabel: string;
  image: string;
  qty: number;
  unitPricePaise: number;
}
interface Quote {
  lines: QuoteLine[];
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  gstEnabled: boolean;
  pricesIncludeGst: boolean;
  couponCode: string | null;
  couponPercent: number | null;
  issues: { variantId?: string; code: string; message: string }[];
}

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (response: { error?: { description?: string } }) => void) => void;
}
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    // Drop any earlier attempt: a script element that already errored never fires its events again.
    document.querySelector('script[data-razorpay="1"]')?.remove();
    const script = document.createElement("script");
    function fail() {
      clearTimeout(timer);
      script.remove();
      resolve(false);
    }
    const timer = setTimeout(fail, 15_000);
    script.addEventListener("load", () => {
      clearTimeout(timer);
      resolve(Boolean(window.Razorpay));
    });
    script.addEventListener("error", fail);
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "1";
    document.body.appendChild(script);
  });
}

const input = "w-full rounded-xl border border-charcoal/20 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition focus:border-cherry-blossom focus:ring-2 focus:ring-cherry-blossom/30";
const label = "mb-1 block text-xs font-extrabold uppercase tracking-wide text-charcoal/70";

interface AddressForm {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}
const emptyAddress: AddressForm = { name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

const CHECK_FIELDS = "Please check the highlighted fields.";
const noopSubscribe = () => () => {};
/** False on the server and during hydration, true afterwards — the cart lives in this browser only, so the first paint must not depend on it. */
const useIsClient = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

export default function CheckoutClient({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const isClient = useIsClient();
  const { lines, coupon, removeLine } = useShop();

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState<AddressForm>(emptyAddress);
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState<AddressForm>(emptyAddress);
  const [note, setNote] = useState("");

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [phase, setPhase] = useState<"idle" | "starting" | "paying" | "verifying">("idle");
  const seq = useRef(0);

  const cartKey = useMemo(() => JSON.stringify(lines.map((l) => [l.variantId, l.qty])), [lines]);

  // Ask the server for the real price of this cart (prices, stock, coupon, shipping, GST).
  useEffect(() => {
    if (!enabled || lines.length === 0) return;
    const mine = ++seq.current;
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: lines.map((l) => ({ variantId: l.variantId, qty: l.qty })), couponCode: coupon, state: shipping.state || null }),
        });
        const data = await res.json().catch(() => ({}));
        if (mine !== seq.current) return;
        if (!res.ok) {
          setQuoteError(data.error ?? "Could not calculate your total.");
          return;
        }
        setQuoteError("");
        setQuote(data.quote as Quote);
      } catch {
        if (mine === seq.current) setQuoteError("Could not reach the server to calculate your total.");
      }
    }, 150);
    return () => clearTimeout(t);
    // cartKey captures lines; eslint cannot see through it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, cartKey, coupon, shipping.state]);

  const whatsapp = whatsappLink(
    `Hello TMUG, I'd like to order:\n${lines.map((l, i) => `${i + 1}. ${l.productName} (${l.variantLabel}) × ${l.qty}`).join("\n")}\n\nPlease confirm my order.`,
  );

  if (!isClient) {
    return (
      <Shell>
        <div className="rounded-3xl bg-white p-8 text-center shadow-xs ring-1 ring-charcoal/10" aria-busy="true">
          <p className="text-sm font-bold text-charcoal/60">Loading your cart…</p>
        </div>
      </Shell>
    );
  }

  if (lines.length === 0) {
    return (
      <Shell>
        <div className="rounded-3xl bg-white p-8 text-center shadow-xs ring-1 ring-charcoal/10">
          <p className="font-display text-2xl font-extrabold text-charcoal">Your cart is empty</p>
          <p className="mt-2 text-sm text-charcoal/70">Add a tea or two, then come back to check out.</p>
          <Link href="/#shop" className="mt-5 inline-block rounded-full bg-charcoal px-6 py-3 text-sm font-extrabold text-white hover:bg-tea-gold hover:text-charcoal">
            Browse teas
          </Link>
        </div>
      </Shell>
    );
  }

  if (!enabled) {
    return (
      <Shell>
        <div className="rounded-3xl bg-white p-8 shadow-xs ring-1 ring-charcoal/10">
          <p className="font-display text-2xl font-extrabold text-charcoal">Online payment isn’t available yet</p>
          <p className="mt-2 text-sm text-charcoal/75">We haven’t switched on card / UPI checkout. You can place this order on WhatsApp and our team will confirm it and share the payment details.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-extrabold text-white">
              Order on WhatsApp
            </a>
            <Link href="/" className="rounded-full border-2 border-charcoal/15 px-6 py-3 text-sm font-bold text-charcoal">
              Keep shopping
            </Link>
          </div>
          <p className="mt-4 text-xs text-charcoal/55">Questions? {siteConfig.whatsapp.display}</p>
        </div>
      </Shell>
    );
  }

  const blocking = quote?.issues ?? [];

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (phase !== "idle") return;
    if (!quote || blocking.length > 0) {
      setFormError(blocking[0]?.message ?? "Please wait for your total to be calculated.");
      return;
    }

    const candidate = {
      lines: lines.map((l) => ({ variantId: l.variantId, qty: l.qty })),
      couponCode: coupon,
      customer,
      shipping: { ...shipping, name: shipping.name || customer.name, phone: shipping.phone || customer.phone },
      billingSameAsShipping: billingSame,
      billing: billingSame ? undefined : billing,
      note,
      expectedTotalPaise: quote.totalPaise,
    };
    const check = checkoutSchema.safeParse(candidate);
    if (!check.success) {
      const next: Record<string, string> = {};
      for (const issue of check.error.issues) {
        const key = issue.path.join(".");
        if (!(key in next)) next[key] = issue.message;
      }
      setErrors(next);
      setFormError(CHECK_FIELDS);
      document.querySelector("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setPhase("starting");

    try {
      // Make sure the payment window can open BEFORE creating anything on the server, so a failed load leaves no unpaid order behind.
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setFormError("The payment window could not be loaded. Check your connection and try again.");
        setPhase("idle");
        return;
      }

      const res = await fetch("/api/checkout/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(candidate) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.code === "price_changed" && data.quote) setQuote(data.quote as Quote);
        if (data.code === "checkout_blocked" && Array.isArray(data.issues)) setQuote((q) => (q ? { ...q, issues: data.issues } : q));
        if (data.fields) setErrors(data.fields as Record<string, string>);
        setFormError(data.error ?? "We could not start your payment. Please try again.");
        setPhase("idle");
        return;
      }

      const token = data.orderToken as string;
      try {
        sessionStorage.setItem("tmug-last-order", token);
      } catch {
        /* storage blocked — the cart simply won't auto-clear */
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amountPaise,
        currency: "INR",
        name: siteConfig.name,
        description: `Order ${data.orderNumber}`,
        order_id: data.gatewayOrderId,
        prefill: data.prefill,
        theme: { color: "#33243A" },
        handler: async (response: RazorpaySuccess) => {
          setPhase("verifying");
          try {
            const v = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderToken: token, ...response }),
            });
            const vd = await v.json().catch(() => ({}));
            if (!v.ok) {
              // The payment itself may have succeeded; the confirmation page shows the real status.
              setFormError(vd.error ?? "We could not verify your payment yet.");
            }
          } catch {
            /* the webhook / confirmation page will settle the status */
          }
          router.push(`/order/${token}`);
        },
        modal: {
          ondismiss: () => setPhase((p) => (p === "verifying" ? p : "idle")),
        },
      });
      rzp.on("payment.failed", (r) => {
        setFormError(r.error?.description ? `Payment failed: ${r.error.description}. You can try again.` : "Payment failed. You can try again.");
      });
      setPhase("paying");
      rzp.open();
    } catch {
      setFormError("Network error. Please try again.");
      setPhase("idle");
    }
  }

  const err = (k: string) => errors[k];
  // An error disappears as soon as the shopper edits that field (validation itself runs when they press Pay).
  const clearError = (k: string) => {
    if (!(k in errors)) return;
    const next = { ...errors };
    delete next[k];
    setErrors(next);
    if (Object.keys(next).length === 0) setFormError((m) => (m === CHECK_FIELDS ? "" : m));
  };
  const field = (k: string) => (err(k) ? { "data-invalid": "true", "aria-invalid": true, onInput: () => clearError(k) } : {});

  const addressFields = (prefix: "shipping" | "billing", value: AddressForm, set: (a: AddressForm) => void) => (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className={label} htmlFor={`${prefix}-name`}>Full name</label>
        <input id={`${prefix}-name`} className={input} value={value.name} autoComplete="name" {...field(`${prefix}.name`)} onChange={(e) => set({ ...value, name: e.target.value })} placeholder={customer.name} />
        {err(`${prefix}.name`) && <p className="mt-1 text-xs font-bold text-berry">{err(`${prefix}.name`)}</p>}
      </div>
      <div>
        <label className={label} htmlFor={`${prefix}-phone`}>Mobile</label>
        <input id={`${prefix}-phone`} className={input} value={value.phone} inputMode="tel" autoComplete="tel" {...field(`${prefix}.phone`)} onChange={(e) => set({ ...value, phone: e.target.value })} placeholder={customer.phone} />
        {err(`${prefix}.phone`) && <p className="mt-1 text-xs font-bold text-berry">{err(`${prefix}.phone`)}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor={`${prefix}-line1`}>Address</label>
        <input id={`${prefix}-line1`} className={input} value={value.line1} autoComplete="address-line1" {...field(`${prefix}.line1`)} onChange={(e) => set({ ...value, line1: e.target.value })} placeholder="House / flat, street" />
        {err(`${prefix}.line1`) && <p className="mt-1 text-xs font-bold text-berry">{err(`${prefix}.line1`)}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor={`${prefix}-line2`}>Area / landmark (optional)</label>
        <input id={`${prefix}-line2`} className={input} value={value.line2} autoComplete="address-line2" onChange={(e) => set({ ...value, line2: e.target.value })} />
      </div>
      <div>
        <label className={label} htmlFor={`${prefix}-city`}>City</label>
        <input id={`${prefix}-city`} className={input} value={value.city} autoComplete="address-level2" {...field(`${prefix}.city`)} onChange={(e) => set({ ...value, city: e.target.value })} />
        {err(`${prefix}.city`) && <p className="mt-1 text-xs font-bold text-berry">{err(`${prefix}.city`)}</p>}
      </div>
      <div>
        <label className={label} htmlFor={`${prefix}-pin`}>PIN code</label>
        <input id={`${prefix}-pin`} className={input} value={value.pincode} inputMode="numeric" maxLength={6} autoComplete="postal-code" {...field(`${prefix}.pincode`)} onChange={(e) => set({ ...value, pincode: e.target.value.replace(/\D/g, "") })} />
        {err(`${prefix}.pincode`) && <p className="mt-1 text-xs font-bold text-berry">{err(`${prefix}.pincode`)}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor={`${prefix}-state`}>State</label>
        <select id={`${prefix}-state`} className={input} value={value.state} autoComplete="address-level1" {...field(`${prefix}.state`)} onChange={(e) => set({ ...value, state: e.target.value })}>
          <option value="">Select your state…</option>
          {INDIAN_STATE_NAMES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {err(`${prefix}.state`) && <p className="mt-1 text-xs font-bold text-berry">{err(`${prefix}.state`)}</p>}
      </div>
    </div>
  );

  return (
    <Shell>
      <form onSubmit={pay} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-5">
          <section className="rounded-3xl bg-white p-5 shadow-xs ring-1 ring-charcoal/10 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-charcoal">1. Your details</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="c-name">Full name</label>
                <input id="c-name" className={input} value={customer.name} autoComplete="name" {...field("customer.name")} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                {err("customer.name") && <p className="mt-1 text-xs font-bold text-berry">{err("customer.name")}</p>}
              </div>
              <div>
                <label className={label} htmlFor="c-email">Email</label>
                <input id="c-email" type="email" className={input} value={customer.email} autoComplete="email" {...field("customer.email")} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                {err("customer.email") && <p className="mt-1 text-xs font-bold text-berry">{err("customer.email")}</p>}
              </div>
              <div>
                <label className={label} htmlFor="c-phone">Mobile number</label>
                <input id="c-phone" className={input} value={customer.phone} inputMode="tel" autoComplete="tel" placeholder="10-digit number" {...field("customer.phone")} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                {err("customer.phone") && <p className="mt-1 text-xs font-bold text-berry">{err("customer.phone")}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-xs ring-1 ring-charcoal/10 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-charcoal">2. Delivery address</h2>
            <div className="mt-4">{addressFields("shipping", shipping, setShipping)}</div>
            <label className="mt-4 flex items-center gap-2 text-sm font-bold text-charcoal">
              <input type="checkbox" className="h-4 w-4" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} />
              Billing address is the same as delivery
            </label>
            {!billingSame && (
              <div className="mt-4 border-t border-charcoal/10 pt-4">
                <h3 className="mb-3 text-sm font-extrabold text-charcoal">Billing address</h3>
                {addressFields("billing", billing, setBilling)}
              </div>
            )}
            <div className="mt-4">
              <label className={label} htmlFor="note">Order note (optional)</label>
              <textarea id="note" rows={2} className={input} value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-3xl bg-white p-5 shadow-xs ring-1 ring-charcoal/10 sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-charcoal">Order summary</h2>
            {quoteError && <p role="alert" className="mt-3 rounded-lg bg-berry/10 px-3 py-2 text-sm font-bold text-berry">{quoteError}</p>}
            {!quote && !quoteError && <p className="mt-3 text-sm text-charcoal/60">Calculating your total…</p>}

            {quote && (
              <>
                <ul className="mt-4 divide-y divide-charcoal/10">
                  {quote.lines.map((l) => (
                    <li key={l.variantId} className="flex items-center gap-3 py-2.5">
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-warm-surface">
                        {l.image && <Image src={l.image} alt="" fill sizes="56px" className="object-contain p-1" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold text-charcoal">{l.productName}</span>
                        <span className="block text-xs text-charcoal/60">
                          {l.variantLabel} × {l.qty}
                        </span>
                      </span>
                      <span className="text-sm font-bold text-charcoal">{formatPaise(l.unitPricePaise * l.qty)}</span>
                    </li>
                  ))}
                </ul>

                {blocking.length > 0 && (
                  <div role="alert" className="mt-3 rounded-xl border border-berry/40 bg-berry/10 p-3 text-sm text-berry">
                    <ul className="list-disc pl-5 font-bold">
                      {blocking.map((i, idx) => (
                        <li key={idx}>{i.message}</li>
                      ))}
                    </ul>
                    {blocking.some((i) => i.variantId) && (
                      <button type="button" className="mt-2 rounded-full bg-berry px-4 py-1.5 text-xs font-extrabold text-white cursor-pointer" onClick={() => blocking.forEach((i) => i.variantId && removeLine(i.variantId))}>
                        Remove these items from my cart
                      </button>
                    )}
                  </div>
                )}

                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between"><dt className="text-charcoal/70">Subtotal</dt><dd className="font-bold">{formatPaise(quote.subtotalPaise)}</dd></div>
                  {quote.discountPaise > 0 && (
                    <div className="flex justify-between text-berry"><dt>Discount ({quote.couponCode})</dt><dd className="font-bold">−{formatPaise(quote.discountPaise)}</dd></div>
                  )}
                  <div className="flex justify-between"><dt className="text-charcoal/70">Shipping</dt><dd className="font-bold">{quote.shippingPaise === 0 ? "Free" : formatPaise(quote.shippingPaise)}</dd></div>
                  {quote.gstEnabled && quote.taxPaise > 0 && (
                    <div className="flex justify-between text-charcoal/60"><dt>{quote.pricesIncludeGst ? "Includes GST" : "GST"}</dt><dd>{formatPaise(quote.taxPaise)}</dd></div>
                  )}
                  <div className="flex items-baseline justify-between border-t border-charcoal/15 pt-3">
                    <dt className="font-extrabold">Total</dt>
                    <dd className="font-display text-2xl font-black text-charcoal">{formatPaise(quote.totalPaise)}</dd>
                  </div>
                </dl>
              </>
            )}

            {formError && <p role="alert" className="mt-3 rounded-lg bg-berry/10 px-3 py-2 text-sm font-bold text-berry">{formError}</p>}

            <button
              type="submit"
              disabled={phase !== "idle" || !quote || blocking.length > 0}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3.5 text-base font-extrabold text-white transition hover:bg-deep-plum active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {phase === "starting" ? "Starting secure payment…" : phase === "paying" ? "Complete the payment window…" : phase === "verifying" ? "Confirming your payment…" : quote ? `Pay ${formatPaise(quote.totalPaise)}` : "Pay"}
            </button>
            <p className="mt-2 text-center text-xs text-charcoal/55">Your order is confirmed only after the payment is verified by our server.</p>
            <p className="mt-3 text-center text-xs">
              Prefer WhatsApp?{" "}
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                Order on WhatsApp
              </a>
            </p>
          </section>
        </aside>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cream pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="mb-6 font-display text-3xl font-black text-deep-plum sm:text-4xl">Checkout</h1>
        {children}
      </div>
    </div>
  );
}
