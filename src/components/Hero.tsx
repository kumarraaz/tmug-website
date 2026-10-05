"use client";

import { motion } from "framer-motion";
import HeroSlider from "./HeroSlider";
import { IconArrowRight, IconCup, IconLeaf } from "./icons";

/** Floating decorative leaf blobs (pure CSS/SVG, no assets). */
function DecoLeaves() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[6%] top-[16%] text-tea-green/15"
      >
        <IconLeaf className="h-16 w-16" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[14%] right-[8%] text-gold/25"
      >
        <IconLeaf className="h-20 w-20" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute right-[16%] top-[10%] text-tea-green/10"
      >
        <IconCup className="h-12 w-12" />
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-cream">
      <DecoLeaves />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-20 lg:pt-16">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-tea-green/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-tea-green">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              Modern Indian tea brand
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            Tea, but make it{" "}
            <span className="relative inline-block text-tea-green">
              TMUG.
              <svg viewBox="0 0 220 14" aria-hidden="true" className="absolute -bottom-2 left-0 w-full text-gold">
                <path d="M4 10 C 60 2, 160 2, 216 8" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg lg:mx-0"
          >
            Whole-flower herbal teas that brew blue, tangy reds made for ice,
            Darjeeling long leaf and properly kadak chai — packed fresh,
            shipped across India.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#shop"
              className="inline-flex items-center gap-2 rounded-full bg-tea-green px-7 py-3.5 text-base font-extrabold text-cream shadow-[0_16px_40px_-12px_rgba(40,96,33,0.6)] transition-transform hover:scale-[1.03] active:scale-95"
            >
              Shop Tea <IconArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#collections"
              className="rounded-full border-2 border-tea-green/25 px-7 py-3 text-base font-bold text-tea-green transition-colors hover:border-tea-green hover:bg-tea-green/5"
            >
              Explore Collections
            </a>
          </motion.div>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex items-center justify-center gap-8 lg:justify-start"
          >
            {[
              ["7", "Signature teas"],
              ["13", "Pack variants"],
              ["100%", "Real ingredients"],
            ].map(([v, l]) => (
              <div key={l} className="text-center lg:text-left">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl font-extrabold text-tea-green sm:text-3xl">{v}</dd>
                <dd className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroSlider />
        </motion.div>
      </div>
    </section>
  );
}
