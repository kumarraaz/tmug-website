"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconCup, IconLeaf, IconShield, IconTruck, IconArrowRight, IconSparkle } from "./icons";
import Reveal from "./motion/Reveal";

const PILLARS = [
  {
    icon: IconLeaf,
    title: "100% Whole Flowers & Leaves",
    text: "Whole dried Aparajita, Chamomile, and Darjeeling long leaves. Never industrial dust or floor sweepings.",
    tag: "Whole Botanicals",
  },
  {
    icon: IconShield,
    title: "Zero Artificial Additives",
    text: "Pure botanical colour and authentic Assam malt. No chemical flavour sprays, added sugars or synthetic dyes.",
    tag: "Pure Ingredients",
  },
  {
    icon: IconCup,
    title: "Properly Kadak Strength",
    text: "Full-bodied Assam CTC selected specifically to hold strength against hot milk, fresh adrak, and elaichi.",
    tag: "Authentic Chai",
  },
  {
    icon: IconTruck,
    title: "Fresh Batch Sealed Jars",
    text: "Sealed in food-grade UV-protective jars and airtight aroma-locked pouches. Shipped fresh across India.",
    tag: "Direct Dispatch",
  },
];

export default function WhyTmug() {
  return (
    <section
      id="why"
      aria-label="Why TMUG — Our Tea Philosophy"
      className="relative scroll-mt-24 overflow-hidden bg-warm-ivory py-8 sm:py-12"
    >
      {/* Botanical Flower Watermarks & Warm Golden Ambient Auras */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-tea-gold/10 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-pink-accent/15 blur-3xl" />

        {/* Botanical watermark decorations */}
        <div className="absolute left-[4%] top-[10%] w-14 sm:w-16 opacity-40 animate-float-slow">
          <Image
            src="/assets/stickers/flower-doodle.svg"
            alt=""
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <div className="absolute right-[5%] top-[15%] w-14 sm:w-16 opacity-40 animate-float">
          <Image
            src="/assets/stickers/tea-leaf.svg"
            alt=""
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <div className="absolute left-[8%] bottom-[8%] w-12 sm:w-14 opacity-35">
          <Image
            src="/assets/stickers/badge-natural.svg"
            alt=""
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-tea-gold/40 bg-warm-surface px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-charcoal shadow-xs">
              <span className="h-2 w-2 rounded-full bg-coral" />
              The TMUG Difference
            </span>
            <h2 className="text-section mt-2 font-display font-black text-charcoal">
              Tea should feel <span className="text-coral">exciting</span>, not ordinary.
            </h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-charcoal/75">
              Most supermarket tea is dusty CTC sweepings or artificial flavor sprays. We set out to craft honest cups celebrating authentic botanical petals and bold garden-fresh leaves.
            </p>
          </Reveal>
        </div>

        {/* ── Large Campaign Packshot Showcase ── */}
        <div className="relative mx-auto mt-6 sm:mt-8 max-w-5xl overflow-hidden rounded-[2rem] border border-charcoal/10 bg-gradient-to-br from-warm-surface via-white to-warm-surface p-5 sm:p-8 shadow-[0_20px_50px_-20px_rgba(39,35,41,0.18)]">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Left Column: Editorial Manifesto */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <span className="inline-block rounded-full bg-tea-gold/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-charcoal">
                Crafted for Modern Daily Rituals
              </span>
              <h3 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal leading-tight">
                From morning <span className="text-tea-gold">kadak chai</span> to evening <span className="text-coral">blue blooms</span>.
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/75">
                Whether you’re boiling a hearty pot with crushed ginger before work or pouring soothing sapphire tea for a slow weekend pause — TMUG is made with 100% natural ingredients you can see and trust.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 border border-charcoal/10 shadow-xs">
                  <span className="text-base">🍃</span>
                  <span className="text-xs font-bold text-charcoal">No Industrial Dust</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 border border-charcoal/10 shadow-xs">
                  <span className="text-base">🌸</span>
                  <span className="text-xs font-bold text-charcoal">Whole Flower Petals</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 border border-charcoal/10 shadow-xs">
                  <span className="text-base">⚡</span>
                  <span className="text-xs font-bold text-charcoal">Assam Single Origin</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md transition-all hover:bg-tea-gold hover:text-charcoal hover:scale-105 active:scale-95"
                >
                  Discover Our Founder Story <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Large Packshot Composition */}
            <div className="relative lg:col-span-6 flex items-center justify-center">
              {/* Golden Ambient Aura */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-72 w-72 sm:h-88 sm:w-88 rounded-full bg-tea-gold/25 blur-3xl"
              />

              {/* Layered Packshot Stage with prominent authentic packs */}
              <div className="relative flex h-[320px] w-full max-w-[420px] items-center justify-center sm:h-[380px]">
                {/* Pack 1: TMUG Gold Chai Pouch */}
                <motion.div
                  initial={{ opacity: 0, x: -20, y: 15 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-2 sm:left-4 bottom-4 h-56 w-56 sm:h-72 sm:w-72 -rotate-6 drop-shadow-[0_20px_35px_rgba(39,35,41,0.25)]"
                >
                  <Image
                    src="/hero/gold-250g-pouch-front.png"
                    alt="TMUG Gold Chai Pouch — Authentic whole-leaf CTC blend"
                    fill
                    sizes="(max-width: 640px) 220px, 280px"
                    className="object-contain"
                  />
                </motion.div>

                {/* Pack 2: Butterfly Pea Jar */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: -15 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-2 sm:right-4 top-2 h-52 w-52 sm:h-64 sm:w-64 rotate-6 drop-shadow-[0_20px_35px_rgba(39,35,41,0.25)]"
                >
                  <Image
                    src="/hero/butterfly-pea-50g-jar-front.png"
                    alt="TMUG Butterfly Pea Flower Tea 50g Jar — Whole dried flowers"
                    fill
                    sizes="(max-width: 640px) 200px, 260px"
                    className="object-contain"
                  />
                </motion.div>

                {/* Center Quality Seal */}
                <div className="absolute z-10 rounded-2xl border-2 border-tea-gold bg-warm-ivory/95 px-4 py-2 text-center shadow-xl backdrop-blur-md">
                  <span className="text-[10px] font-black uppercase tracking-widest text-tea-gold">
                    100% PURE
                  </span>
                  <p className="font-display text-xs font-black text-charcoal">Aroma Protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 Pillars Grid (Crisp cards, zero green UI) ── */}
        <div className="mt-8 sm:mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-charcoal/10 bg-white p-5 shadow-[0_10px_28px_-16px_rgba(39,35,41,0.12)] transition-all duration-300 hover:shadow-[0_20px_40px_-18px_rgba(39,35,41,0.2)] hover:border-tea-gold/50"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warm-surface text-charcoal transition-colors duration-300 group-hover:bg-tea-gold group-hover:text-charcoal shadow-xs">
                  <p.icon className="h-5 w-5 text-coral group-hover:text-charcoal" />
                </span>
                <span className="rounded-full bg-warm-ivory px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-charcoal/60">
                  {p.tag}
                </span>
              </div>
              <h3 className="mt-4 font-display text-base font-black text-charcoal">
                {p.title}
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-charcoal/70">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
