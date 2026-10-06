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
    title: "Real ingredients",
    text: "Whole dried flowers and full leaves — not dust, not “natural flavour”. What you see through the jar is what you brew.",
  },
  {
    icon: IconShield,
    title: "Honest packs",
    text: "Ingredients, brewing steps and FSSAI/packer details printed on every pack. Nothing hidden, nothing exaggerated.",
  },
  {
    icon: IconCup,
    title: "Brewed for real life",
    text: "Colour-changing blue teas for the ’gram, tangy iced hibiscus for summer, and kadak CTC that survives rushed mornings.",
  },
  {
    icon: IconTruck,
    title: "Direct & fresh",
    text: "Order straight from us on WhatsApp. Packed for freshness, shipped across India, supported by real humans.",
  },
];

/** The 5-pack lineup for the showcase composition. */
const LINEUP = PRODUCTS.slice(0, 5).map((p) => ({
  product: p,
  img: frontImage(p.variants[0]),
}));

/**
 * Editorial arc offsets for the lineup — outer packs sit lower and tilt
 * outward, the middle pack rises. Only on sm+; mobile stays a straight row.
 */
const ARC = [
  "sm:translate-y-7 sm:-rotate-3",
  "sm:translate-y-3 sm:-rotate-1",
  "sm:-translate-y-2",
  "sm:translate-y-3 sm:rotate-1",
  "sm:translate-y-7 sm:rotate-3",
];

/**
 * Why TMUG — brand section with a grouped 5-image product lineup.
 * All five packs visible together in one composition; none half-cut,
 * none dominating. Concise copy, no text walls.
 */
export default function WhyTmug() {
  return (
    <section id="why" className="scroll-mt-24 overflow-hidden bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Good tea, honestly"
          title="Why TMUG?"
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
                <Link
                  href={`/products/${item.product.slug}`}
                  aria-label={`View ${item.product.name}`}
                  className="block overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-[0_16px_36px_-20px_rgba(11,61,46,0.4)] transition-shadow duration-300 hover:shadow-[0_24px_44px_-20px_rgba(11,61,46,0.5)]"
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
                <p className="mt-1.5 truncate text-center text-[10px] font-bold text-ink-soft sm:text-[11px]">
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
              className="group rounded-3xl border border-ink/8 bg-white p-5 shadow-[0_10px_28px_-16px_rgba(23,32,24,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(23,32,24,0.3)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-tea-green text-cream transition-colors duration-300 group-hover:bg-gold group-hover:text-tea-dark">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3.5 font-display text-[17px] font-bold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
