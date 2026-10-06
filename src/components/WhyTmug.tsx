"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS, frontImage } from "@/data/products";
import { IconCup, IconLeaf, IconShield, IconTruck, IconArrowRight } from "./icons";

const PILLARS = [
  {
    icon: IconLeaf,
    title: "Real Whole Leaves",
    text: "Small-batch dried whole flowers and long tea leaves. Never industrial dust.",
  },
  {
    icon: IconCup,
    title: "Vibrant Botanicals",
    text: "Colour-changing blue pea, ruby-red hibiscus, and gentle calming chamomile.",
  },
  {
    icon: IconShield,
    title: "Aroma-Locked Packaging",
    text: "Resealable barrier zip pouches and amber jars that protect freshness.",
  },
  {
    icon: IconTruck,
    title: "Convenient Ordering",
    text: "Direct ordering on WhatsApp with fast doorstep dispatch pan-India.",
  },
];

/** The 5-pack lineup for the showcase composition. */
const LINEUP = PRODUCTS.slice(0, 5).map((p) => ({
  product: p,
  img: frontImage(p.variants[0]),
}));

const ARC = [
  "sm:translate-y-7 sm:-rotate-3",
  "sm:translate-y-3 sm:-rotate-1",
  "sm:-translate-y-2",
  "sm:translate-y-3 sm:rotate-1",
  "sm:translate-y-7 sm:rotate-3",
];

const BOB_DUR = [4, 4.8, 5.2, 4.4, 5.5];

export default function WhyTmug() {
  return (
    <section id="why" className="relative scroll-mt-24 overflow-hidden bg-tea-deep py-16 sm:py-24">
      {/* Background decorations: stickers, organic blobs, botanicals */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-[42%_58%_55%_45%] bg-cream opacity-[0.05]" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-gold opacity-10 blur-3xl" />
        
        {/* Playful Stickers */}
        <div className="absolute left-[6%] top-[14%] w-11 sm:w-12 opacity-80 animate-float-slow">
          <Image
            src="/assets/stickers/tea-leaf.svg"
            alt=""
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        <div className="absolute right-[8%] top-[12%] w-12 sm:w-14 opacity-80 animate-float">
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
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#EFC65E]">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            The TMUG Difference
          </span>
          <h2 className="text-section mt-3 font-display font-extrabold text-cream">
            Why <span className="text-gold">TMUG?</span>
          </h2>
          <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-cream/75">
            Tea should feel exciting, not ordinary. From morning kadak chai to soothing bedtime brews,
            we craft memorable cups using honest botanicals with nothing to hide.
          </p>
        </div>

        {/* ── 5-image lineup: one grouped composition ── */}
        <div className="mx-auto mt-10 max-w-4xl sm:mt-14">
          <div className="flex items-end justify-center gap-2 sm:gap-0">
            {LINEUP.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, rotate: 0 }}
                style={{ zIndex: 5 - Math.abs(2 - i) }}
                className={`w-[19%] shrink-0 sm:w-auto sm:flex-1 ${i > 0 ? "sm:-ml-7" : ""} ${ARC[i]}`}
              >
                <div
                  className="animate-bob"
                  style={{ animationDuration: `${BOB_DUR[i]}s`, animationDelay: `${i * 0.6}s` }}
                >
                  <Link
                    href={`/products/${item.product.slug}`}
                    aria-label={`View ${item.product.name}`}
                    className="block overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-[0_16px_36px_-20px_rgba(0,0,0,0.45)] transition-shadow duration-300 hover:shadow-[0_24px_44px_-20px_rgba(0,0,0,0.55)]"
                  >
                    <span className="relative block aspect-[3/4]">
                      <Image
                        src={item.img.src}
                        alt={item.img.alt}
                        fill
                        sizes="(max-width: 640px) 18vw, 200px"
                        loading="lazy"
                        className="object-contain p-1.5 sm:p-2.5"
                      />
                    </span>
                  </Link>
                </div>
                <p className="mt-1.5 truncate text-center text-[10px] font-bold text-cream/75 sm:text-[11px]">
                  {item.product.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 4 Pillars Grid ── */}
        <div className="mt-12 sm:mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-cream/10 bg-white p-5 sm:p-6 shadow-[0_10px_28px_-16px_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.5)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tea-green text-cream transition-colors duration-300 group-hover:bg-gold group-hover:text-tea-dark shadow-xs">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-[15px] sm:text-base font-bold uppercase tracking-wide text-ink">
                {p.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-extrabold text-tea-dark shadow-[0_14px_30px_-12px_rgba(216,166,42,0.5)] transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Discover Our Story <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
