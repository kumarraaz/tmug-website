"use client";

import { motion } from "framer-motion";
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

/** Product philosophy section. */
export default function WhyTmug() {
  return (
    <section id="why" className="scroll-mt-24 bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why TMUG"
          title="Tea with nothing to hide"
          description="No miracle claims, no 47-ingredient “wellness blends”. Just good tea, packed honestly."
        />
        <div className="mt-8 grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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
