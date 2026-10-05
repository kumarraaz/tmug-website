"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { IconClose } from "./icons";

const STORAGE_KEY = "tmug-promo-dismissed";

/** Festive promo popup — shows once per `remindAfterDays`, easy to disable via config. */
export default function PromoModal() {
  const [visible, setVisible] = useState(false);
  const { promo } = siteConfig;

  useEffect(() => {
    if (!promo.enabled) return;
    let dismissedAt = 0;
    try {
      dismissedAt = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    } catch { /* ignore */ }
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    if (dismissedAt && daysSince < promo.remindAfterDays) return;
    const t = setTimeout(() => setVisible(true), promo.delayMs);
    return () => clearTimeout(t);
  }, [promo]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch { /* ignore */ }
    setVisible(false);
  };

  const goShop = () => {
    dismiss();
    document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && promo.enabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-tea-dark/70 p-4 backdrop-blur-sm"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label={promo.title}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] bg-tea-green text-cream shadow-2xl"
          >
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/20 blur-2xl" />
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close offer"
              className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
            >
              <IconClose className="h-4 w-4" />
            </button>
            <div className="relative px-7 py-9 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-soft">
                {promo.title}
              </p>
              <p className="mt-3 font-display text-4xl font-extrabold leading-none">
                {promo.discountPercent}% OFF
              </p>
              <p className="mt-2 font-display text-xl font-bold">{promo.headline.replace(/^\D*\d+% OFF\s*/i, "")}</p>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">{promo.message}</p>
              <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-gold/60 bg-tea-dark/40 px-5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-cream/60">Code</span>
                <span className="font-display text-xl font-extrabold tracking-widest text-gold">
                  {promo.code}
                </span>
              </div>
              <button
                type="button"
                onClick={goShop}
                className="mt-6 w-full rounded-full bg-gold px-6 py-3.5 text-base font-extrabold text-tea-dark transition-transform hover:scale-[1.02] active:scale-95"
              >
                {promo.cta}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="mt-3 text-xs font-semibold text-cream/60 underline-offset-2 hover:underline"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
