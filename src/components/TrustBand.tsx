"use client";

import { motion } from "framer-motion";
import { IconCheck } from "./icons";

/** Factual trust band — no fabricated reviews, ratings or awards. */
const POINTS = [
  "FSSAI-registered packaging",
  "Ingredients printed on every pack",
  "Whole flowers & leaves, never dust",
  "Brews in 3–5 minutes",
  "Real humans on WhatsApp support",
  "Ships across India",
];

export default function TrustBand() {
  return (
    <section aria-label="The TMUG promise" className="bg-tea-green py-10 text-cream sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-display text-xl font-extrabold sm:text-2xl"
        >
          The TMUG promise — <span className="text-gold-soft">in plain words</span>
        </motion.h2>
        <ul className="mx-auto mt-6 grid max-w-4xl gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-tea-dark">
                <IconCheck className="h-3.5 w-3.5" />
              </span>
              <span className="text-[13px] font-semibold text-cream/90">{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
