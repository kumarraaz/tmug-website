"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS, frontImage } from "@/data/products";
import SectionHeading from "./SectionHeading";
import { IconCup, IconLeaf, IconShield, IconTruck } from "./icons";

const PILLARS = [
  {
    icon: IconLeaf,
    title: "Real leaves",
    text: "Small-batch dried tea leaves and flowers.",
  },
  {
    icon: IconTruck,
    title: "Fresh packing",
    text: "Packed carefully for aroma and freshness.",
  },
  {
    icon: IconShield,
    title: "No unnecessary stuff",
    text: "Straightforward tea without unnecessary additions.",
  },
  {
    icon: IconCup,
    title: "Made for everyday",
    text: "From morning kadak chai to slow evening brews.",
  },
];

/** The 5-pack lineup for the showcase composition. */
const LINEUP = PRODUCTS.slice(0, 5).map((p) => ({
  product: p,
  img: frontImage(p.variants[0]),
}));

/**
 * Editorial arc offsets — outer packs sit lower and tilt outward,
 * the middle pack rises. Only on sm+; mobile stays a straight row.
 */
const ARC = [
  "sm:translate-y-7 sm:-rotate-3",
  "sm:translate-y-3 sm:-rotate-1",
  "sm:-translate-y-2",
  "sm:translate-y-3 sm:rotate-1",
  "sm:translate-y-7 sm:rotate-3",
];

/** Per-image idle float durations (seconds) — calm, desynced. */
const BOB_DUR = [4, 4.8, 5.2, 4.4, 5.5];

/**
 * Why TMUG — deep-green brand section with a grouped 5-image product
 * lineup. All five packs visible together in one editorial arc; none
 * half-cut, none dominating. Concise pillars, compact copy.
 */
export default function WhyTmug() {
  return (
    <section id="why" className="relative scroll-mt-24 overflow-hidden bg-tea-deep py-10 sm:py-14">
      {/* ── tasteful background: cream organic shapes, gold dots, botanicals ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-[42%_58%_55%_45%] bg-cream opacity-[0.05]" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-gold opacity-10 blur-3xl" />
        <div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-gold animate-dot-pulse" />
        <div className="absolute right-[16%] top-[12%] h-1.5 w-1.5 rounded-full bg-cream opacity-40" />
        <div className="absolute bottom-[20%] left-[8%] h-1.5 w-1.5 rounded-full bg-gold opacity-60" />
        <div className="absolute bottom-[14%] right-[10%] h-2.5 w-2.5 rounded-full bg-gold animate-dot-pulse" style={{ animationDelay: "1.6s" }} />
        {/* tiny restrained accent flowers */}
        <span className="absolute left-[22%] top-[64%] h-2 w-2 rounded-full bg-[#d84f6d] opacity-50" />
        <span className="absolute right-[24%] top-[58%] h-2 w-2 rounded-full bg-[#4a6fd4] opacity-50" />
        <span className="absolute left-[45%] top-[8%] h-1.5 w-1.5 rounded-full bg-[#e8a93d] opacity-60" />
        <span className="absolute right-[42%] bottom-[8%] h-2 w-2 rounded-full bg-[#8fc93a] opacity-40" />
        {/* tiny botanical line art */}
        <svg viewBox="0 0 60 90" className="absolute left-[6%] top-[38%] h-20 w-14 text-cream opacity-20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M30 85 C 28 60, 30 40, 34 18" />
          <path d="M30 62 C 20 58, 14 50, 12 40 C 22 42, 28 50, 30 62 Z" fill="currentColor" stroke="none" opacity="0.7" />
          <path d="M31 44 C 40 40, 46 32, 48 22 C 38 24, 32 32, 31 44 Z" fill="currentColor" stroke="none" opacity="0.7" />
        </svg>
        <svg viewBox="0 0 60 90" className="absolute right-[7%] top-[30%] h-24 w-16 -scale-x-100 text-cream opacity-15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M30 85 C 28 60, 30 40, 34 18" />
          <path d="M30 62 C 20 58, 14 50, 12 40 C 22 42, 28 50, 30 62 Z" fill="currentColor" stroke="none" opacity="0.7" />
          <path d="M31 44 C 40 40, 46 32, 48 22 C 38 24, 32 32, 31 44 Z" fill="currentColor" stroke="none" opacity="0.7" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow="Good tea, honestly"
          title="Tea with nothing to hide"
          description="Simple leaves. Proper tea. Nothing unnecessary."
        />

        {/* ── 5-image lineup: one grouped composition ── */}
        <div className="mx-auto mt-9 max-w-4xl sm:mt-11">
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
                <p className="mt-1.5 truncate text-center text-[10px] font-bold text-cream/70 sm:text-[11px]">
                  {item.product.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── pillars ── */}
        <div className="mt-10 grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-3xl border border-cream/10 bg-white p-5 shadow-[0_10px_28px_-16px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.5)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-tea-green text-cream transition-colors duration-300 group-hover:bg-gold group-hover:text-tea-dark">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3.5 font-display text-[15px] font-bold uppercase tracking-wide text-ink">{p.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
