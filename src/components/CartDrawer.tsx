"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useShop } from "@/lib/store";
import { formatINR, formatMoney } from "@/lib/format";
import { siteConfig, whatsappOrderLink } from "@/config/site";
import { IconClose, IconTrash, IconWhatsApp } from "./icons";
import { QuantitySelector } from "./ProductCard";

/**
 * Render into document.body so the drawer is never trapped inside an
 * ancestor stacking context (transform/filter/overflow). This guarantees
 * `position: fixed` is relative to the viewport and the z-index hierarchy
 * below actually holds.
 */
function Portal({ children }: { children: ReactNode }) {
  // Client-only: never portal during SSR.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/** true below the `sm` breakpoint — cart renders as a bottom sheet there. */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

/** Coupon input + applied state. */
function CouponBox() {
  const { coupon, couponError, applyCoupon, removeCoupon } = useShop();
  const [input, setInput] = useState("");

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-tea-gold/15 px-4 py-2.5">
        <p className="text-sm font-bold text-charcoal">
          ✓ {coupon} applied — {siteConfig.promo.discountPercent}% off
        </p>
        <button
          type="button"
          onClick={removeCoupon}
          className="text-xs font-bold text-coral underline-offset-2 hover:underline cursor-pointer"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (applyCoupon(input)) setInput("");
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Coupon code (try ${siteConfig.promo.code})`}
          aria-label="Coupon code"
          className="min-w-0 flex-1 rounded-xl border border-ink/15 bg-cream px-3.5 py-2.5 text-sm font-bold uppercase outline-none placeholder:normal-case placeholder:font-normal focus:border-tea-green"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-ink px-5 py-2.5 text-sm font-extrabold text-cream transition-transform active:scale-95"
        >
          Apply
        </button>
      </form>
      {couponError && (
        <p role="alert" className="mt-1.5 text-xs font-semibold text-red-600">
          {couponError}
        </p>
      )}
    </div>
  );
}

export default function CartDrawer() {
  const { cartOpen, setCartOpen, lines, updateQty, removeLine, subtotal, discount, total, coupon, count } = useShop();
  const [checkoutNote, setCheckoutNote] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!cartOpen) return;
    // Lock body scroll, restoring the *previous* value on close so we never
    // leave the page permanently locked.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, setCartOpen]);

  const orderLines = lines.map((l) => ({
    name: l.productName,
    variant: l.variantLabel,
    qty: l.qty,
    unitPrice: formatINR(l.price),
    lineTotal: formatINR(l.price * l.qty),
  }));

  const waLink = whatsappOrderLink(
    orderLines,
    formatINR(subtotal),
    coupon ? { code: coupon, percent: siteConfig.promo.discountPercent, amount: formatMoney(discount) } : undefined,
    coupon ? formatMoney(total) : undefined,
  );

  // Stacking hierarchy (spec): navbar 40 / dropdown 60 / backdrop 90 /
  // cart drawer 100 / modal 110 / toast 120.
  const sheetAnim = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  return (
    <Portal>
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[4px]"
            onClick={() => setCartOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            initial={sheetAnim.initial}
            animate={sheetAnim.animate}
            exit={sheetAnim.exit}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[100] flex max-h-[88dvh] flex-col rounded-t-[1.5rem] bg-cream shadow-2xl sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-0 sm:h-dvh sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h2 className="font-display text-xl font-extrabold text-ink">
                Your Cart{" "}
                <span className="text-sm font-bold text-ink-soft">
                  ({count} {count === 1 ? "item" : "items"})
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="rounded-full p-2 text-ink-soft transition-colors hover:bg-ink/5"
              >
                <IconClose />
              </button>
            </div>

            {/* Lines */}
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-tea-gold/15 text-4xl" aria-hidden="true">
                  🍵
                </span>
                <p className="font-display text-2xl font-extrabold text-charcoal">Your cart is empty</p>
                <p className="text-sm text-charcoal/70">
                  Every great ritual starts with the first sip. Go find your tea.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full bg-charcoal px-6 py-3 text-sm font-extrabold text-white transition-all hover:bg-tea-gold hover:text-charcoal cursor-pointer"
                >
                  Browse Teas
                </button>
              </div>
            ) : (
              <>
                <ul className="nice-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.variantId}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-3 rounded-2xl bg-white p-3 shadow-xs border border-charcoal/8"
                      >
                        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-warm-surface p-1">
                          {l.image ? (
                            <Image src={l.image} alt={l.imageAlt} fill sizes="80px" className="object-contain" />
                          ) : null}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-extrabold text-charcoal">{l.productName}</p>
                              <p className="text-xs font-semibold text-charcoal/60">{l.variantLabel}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLine(l.variantId)}
                              aria-label={`Remove ${l.productName} (${l.variantLabel})`}
                              className="rounded-full p-1.5 text-charcoal/50 transition-colors hover:bg-coral/10 hover:text-coral cursor-pointer"
                            >
                              <IconTrash />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <QuantitySelector small qty={l.qty} onChange={(q) => updateQty(l.variantId, q)} />
                            <p className="text-sm font-black text-charcoal">
                              {formatINR(l.price * l.qty)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Footer */}
                <div className="space-y-3 border-t border-charcoal/10 bg-white px-5 py-4">
                  <CouponBox />
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-charcoal/70">Subtotal</dt>
                      <dd className="font-bold text-charcoal">{formatINR(subtotal)}</dd>
                    </div>
                    {coupon && (
                      <div className="flex items-center justify-between text-coral">
                        <dt className="font-semibold">
                          Discount ({coupon} — {siteConfig.promo.discountPercent}%)
                        </dt>
                        <dd className="font-bold">−{formatMoney(discount)}</dd>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-charcoal/10 pt-2">
                      <dt className="font-bold text-charcoal">Total</dt>
                      <dd className="font-display text-xl font-black text-charcoal">
                        {coupon ? formatMoney(total) : formatINR(subtotal)}
                      </dd>
                    </div>
                  </dl>
                  <p className="text-xs text-ink-soft">
                    Shipping calculated when you confirm on WhatsApp. No account needed.
                  </p>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-base font-extrabold text-white transition-transform hover:scale-[1.01] active:scale-95"
                  >
                    <IconWhatsApp className="h-5 w-5" /> Order on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setCheckoutNote((v) => !v)}
                    className="w-full rounded-full border-2 border-ink/15 px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-ink/30"
                  >
                    Checkout
                  </button>
                  <AnimatePresence>
                    {checkoutNote && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden text-center text-xs leading-relaxed text-ink-soft"
                      >
                        Online checkout is coming soon — for now, place your order instantly on
                        WhatsApp at {siteConfig.whatsapp.display}.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </Portal>
  );
}
