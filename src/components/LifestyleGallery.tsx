"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowRight } from "./icons";
import { useSiteControls } from "@/lib/site-controls-context";

/**
 * Section: "Made for moments that linger."
 *
 * Playful editorial poster composition:
 * - Centered high-impact typography
 * - Dynamic interactive stickers with brand copy
 * - ZERO large product photos, ZERO giant logos, ZERO heavy card grids
 * - Zero Green UI
 */
export default function LifestyleGallery() {
  const { controls } = useSiteControls();
  const lg = controls?.sectionsVisual?.lifestyleGallery;

  return (
    <section
      aria-label="Made for moments that linger"
      style={{
        backgroundColor: lg?.bgColor || undefined,
        paddingTop: lg?.paddingTop !== undefined ? `${lg.paddingTop}px` : undefined,
        paddingBottom: lg?.paddingBottom !== undefined ? `${lg.paddingBottom}px` : undefined,
      }}
      className="relative overflow-hidden bg-warm-ivory py-8 sm:py-12 md:py-14"
    >
      {/* Background organic gradients & decorative lines */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tea-gold/10 blur-3xl" />
        <div className="absolute left-[10%] top-1/4 h-64 w-64 rounded-full bg-pink-accent/10 blur-2xl" />
        <div className="absolute right-[8%] bottom-1/4 h-64 w-64 rounded-full bg-coral/10 blur-2xl" />

        {/* Dotted arched divider line */}
        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 300 Q 700 80 1400 320"
            fill="none"
            stroke="#272329"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
        </svg>
      </div>

      {/* ── Playful Interactive Stickers ── */}
      {/* Sticker 1: "TEA TIME" (Top Left - Washi Style) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -7 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.12, rotate: -2, y: -4 }}
        className="absolute left-[3%] top-[8%] z-10 hidden sm:block cursor-pointer select-none"
      >
        <div className="rounded-xl border border-charcoal/10 bg-warm-surface px-4 py-2 shadow-[0_10px_24px_-8px_rgba(39,35,41,0.12)]">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🍃</span>
            <span className="font-display text-xs font-black uppercase tracking-[0.18em] text-charcoal">
              Tea Time
            </span>
          </div>
        </div>
      </motion.div>

      {/* Sticker 2: "CHAI O'CLOCK" (Top Right - Scalloped Gold Badge) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.12, rotate: 10, y: -4 }}
        className="absolute right-[4%] top-[10%] z-10 hidden sm:block cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 rounded-2xl border-2 border-tea-gold/40 bg-tea-gold px-4 py-2.5 text-charcoal shadow-[0_12px_28px_-8px_rgba(217,164,65,0.4)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
          </svg>
          <span className="font-display text-xs font-black uppercase tracking-wider">
            Chai O&apos;Clock
          </span>
        </div>
      </motion.div>

      {/* Sticker 3: "POUR SOMETHING GOOD" (Middle Left - Plum Pill) */}
      <motion.div
        initial={{ opacity: 0, x: -20, rotate: -6 }}
        whileInView={{ opacity: 1, x: 0, rotate: -4 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.1, rotate: 0, y: -4 }}
        className="absolute left-[5%] top-[48%] z-10 hidden md:block cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 rounded-full border border-tea-gold/30 bg-charcoal px-4 py-2 text-warm-ivory shadow-[0_14px_30px_-10px_rgba(39,35,41,0.25)]">
          <span className="h-2 w-2 rounded-full bg-tea-gold animate-ping" />
          <span className="font-display text-[11px] font-black uppercase tracking-widest text-tea-gold">
            Pour Something Good
          </span>
        </div>
      </motion.div>

      {/* Sticker 4: "100% WHOLE FLOWERS" (Middle Right - Coral Pill) */}
      <motion.div
        initial={{ opacity: 0, x: 20, rotate: 8 }}
        whileInView={{ opacity: 1, x: 0, rotate: 7 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.12, rotate: 2, y: -4 }}
        className="absolute right-[5%] top-[46%] z-10 hidden md:block cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 rounded-full border border-coral/30 bg-warm-surface px-4 py-2 text-coral shadow-xs">
          <span className="text-xs">🌸</span>
          <span className="font-display text-[11px] font-black uppercase tracking-wider text-charcoal">
            100% Whole Flowers
          </span>
        </div>
      </motion.div>

      {/* Sticker 5: "STEEP HAPPY" (Bottom Left - Coral Accent) */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 6 }}
        whileInView={{ opacity: 1, y: 0, rotate: 5 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.12, rotate: 0, y: -4 }}
        className="absolute left-[8%] bottom-[12%] z-10 hidden sm:block cursor-pointer select-none"
      >
        <div className="flex items-center gap-1.5 rounded-2xl border border-charcoal/10 bg-white px-4 py-2 shadow-xs">
          <span className="text-coral font-bold text-sm">✦</span>
          <span className="font-display text-xs font-black uppercase tracking-wider text-charcoal">
            Steep Happy
          </span>
        </div>
      </motion.div>

      {/* Sticker 6: "STEEP. SIP. REPEAT." (Bottom Right - Editorial Ticket) */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -6 }}
        whileInView={{ opacity: 1, y: 0, rotate: -5 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.12, rotate: 0, y: -4 }}
        className="absolute right-[8%] bottom-[12%] z-10 hidden sm:block cursor-pointer select-none"
      >
        <div className="rounded-xl border border-dashed border-charcoal/20 bg-white/90 px-4 py-2 backdrop-blur-xs shadow-xs">
          <span className="font-display text-xs font-black uppercase tracking-widest text-charcoal">
            Steep • Sip • Repeat
          </span>
        </div>
      </motion.div>

      {/* ── Main Centered Editorial Content ── */}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-tea-gold/30 bg-warm-surface px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-charcoal shadow-xs"
        >
          <span className="h-2 w-2 rounded-full bg-coral" />
          TMUG Moments
        </motion.div>

        {/* Large Editorial Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ color: lg?.headingColor || undefined }}
          className="mt-5 font-display text-4xl font-black tracking-tight text-charcoal sm:text-5xl md:text-6xl leading-[1.08]"
        >
          {lg?.heading || (
            <>
              Made for moments <br className="hidden sm:block" />
              <span className="relative inline-block text-coral">
                that linger.
                {/* Playful hand-drawn underline SVG */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 3 8 C 60 2, 180 11, 247 5"
                    stroke="#D9A441"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </>
          )}
        </motion.h2>

        {/* Supporting Editorial Copy */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ color: lg?.textColor || undefined }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-charcoal/70 sm:text-lg"
        >
          {lg?.subheading || "From slow solo mornings to late-night kitchen talks, discover real teas crafted to bring more joy, aroma, and natural vibrancy to every pour."}
        </motion.p>

        {/* Mobile-Friendly Interactive Stickers Row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:hidden">
          <span className="rounded-full border border-charcoal/10 bg-white px-3 py-1 text-[11px] font-extrabold text-charcoal shadow-xs">
            ☕ Chai O&apos;Clock
          </span>
          <span className="rounded-full border border-tea-gold/40 bg-tea-gold px-3 py-1 text-[11px] font-extrabold text-charcoal shadow-xs">
            🌸 100% Whole Flowers
          </span>
          <span className="rounded-full border border-charcoal/10 bg-white px-3 py-1 text-[11px] font-extrabold text-coral shadow-xs">
            🍃 Steep Happy
          </span>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10"
        >
          <Link
            href="/#collections"
            className="inline-flex items-center gap-2 rounded-full bg-charcoal px-8 py-4 text-sm font-extrabold text-white shadow-md transition-all duration-200 hover:bg-tea-gold hover:text-charcoal hover:scale-105 active:scale-95 cursor-pointer"
          >
            Shop Tea
            <IconArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 bg-white px-7 py-3.5 text-sm font-extrabold text-charcoal transition-all duration-200 hover:border-tea-gold hover:bg-warm-surface hover:scale-102 active:scale-98 cursor-pointer"
          >
            Explore Blends
          </Link>
        </motion.div>

        {/* Tiny playful label */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-charcoal/60">
          <span>✨</span>
          <span>Brew bold, sip happy. No shortcuts, just pure leaf and flower.</span>
          <span>✨</span>
        </div>
      </div>
    </section>
  );
}
