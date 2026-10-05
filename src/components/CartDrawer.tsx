"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { siteConfig, whatsappOrderLink } from "@/config/site";
import { IconClose, IconTrash, IconWhatsApp } from "./icons";
import { QuantitySelector } from "./ProductCard";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, lines, updateQty, removeLine, subtotal, count } = useShop();
  const [checkoutNote, setCheckoutNote] = useState(false);

  useEffect(() => {
    if (!cartOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, setCartOpen]);

  const orderLines = lines.map(
    (l) => `${l.productName} — ${l.variantLabel} × ${l.qty} (${formatINR(l.price * l.qty)})`,
  );

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-tea-dark/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
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
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-tea-green/10 text-4xl" aria-hidden="true">
                  🍵
                </span>
                <p className="font-display text-2xl font-extrabold text-ink">Your cart is empty</p>
                <p className="text-sm text-ink-soft">
                  Every great ritual starts with the first sip. Go find your tea.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full bg-tea-green px-6 py-3 text-sm font-extrabold text-cream transition-transform hover:scale-[1.03]"
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
                        className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm"
                      >
                        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                          {l.image ? (
                            <Image src={l.image} alt={l.imageAlt} fill sizes="80px" className="object-cover" />
                          ) : null}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-extrabold text-ink">{l.productName}</p>
                              <p className="text-xs font-semibold text-ink-soft">{l.variantLabel}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLine(l.variantId)}
                              aria-label={`Remove ${l.productName} (${l.variantLabel})`}
                              className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <IconTrash />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <QuantitySelector small qty={l.qty} onChange={(q) => updateQty(l.variantId, q)} />
                            <p className="text-sm font-extrabold text-tea-green">
                              {formatINR(l.price * l.qty)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Footer */}
                <div className="space-y-3 border-t border-ink/10 bg-white px-5 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink-soft">Subtotal</span>
                    <span className="font-display text-xl font-extrabold text-ink">
                      {formatINR(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft">
                    Shipping calculated at order confirmation. Pay easily on WhatsApp — no account needed.
                  </p>
                  <a
                    href={whatsappOrderLink(orderLines, formatINR(subtotal))}
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
  );
}
