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
    <section id="why" className="scroll-mt-24 bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why TMUG"
          title="Tea with nothing to hide"
          description="No miracle claims, no 47-ingredient “wellness blends”. Just good tea, packed honestly."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-[1.5rem] bg-white p-6 shadow-[0_10px_35px_-15px_rgba(23,32,24,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_50px_-15px_rgba(23,32,24,0.3)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tea-green text-cream transition-colors group-hover:bg-gold group-hover:text-tea-dark">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
