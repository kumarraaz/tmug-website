"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { IconClose } from "./icons";

const STORAGE_KEY = "tmug-promo-dismissed";

/** Festive promo popup — premium colorful card, floating animation, no fake urgency. */
export default function PromoModal() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <AnimatePresence>
      {visible && promo.enabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-tea-ink/60 p-4 backdrop-blur-md"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label={promo.title}
        >
          <motion.div
            initial={{ scale: 0.85, y: 40, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)]"
            style={{ background: "linear-gradient(140deg, #33243a 0%, #d94f7d 55%, #faa4b5 100%)" }}
          >
            {/* floating decorative blobs */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="animate-float absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gold/25 blur-2xl" />
              <div className="animate-float-slow absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-blossom/25 blur-2xl" />
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Close offer"
              className="absolute right-3 top-3 z-10 rounded-full bg-white/15 p-2 text-cream transition-colors hover:bg-white/25"
            >
              <IconClose className="h-4 w-4" />
            </button>

            <div className="relative px-7 py-10 text-center text-cream">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-gold-soft">
                  {promo.title}
                </p>
                <p className="mt-3 font-display text-5xl font-extrabold leading-none">
                  {promo.discountPercent}
                  <span className="text-2xl">% OFF</span>
                </p>
              </motion.div>
              <p className="mt-3 text-sm leading-relaxed text-cream/80">{promo.message}</p>

              <button
                type="button"
                onClick={copyCode}
                aria-live="polite"
                className="mx-auto mt-6 flex items-center gap-3 rounded-2xl border-2 border-dashed border-gold/70 bg-white/10 px-6 py-3 backdrop-blur transition-colors hover:bg-white/15"
                aria-label={`Copy coupon code ${promo.code}`}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-cream/60">Code</span>
                <span className="font-display text-2xl font-extrabold tracking-[0.2em] text-gold">
                  {promo.code}
                </span>
                <span className="text-xs font-bold text-cream/70">{copied ? "Copied ✓" : "Tap to copy"}</span>
              </button>

              <button
                type="button"
                onClick={goShop}
                className="mt-6 w-full rounded-full bg-gold px-6 py-4 text-base font-extrabold text-tea-ink shadow-[0_15px_35px_-10px_rgba(216,166,42,0.7)] transition-transform hover:scale-[1.03] active:scale-95"
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
