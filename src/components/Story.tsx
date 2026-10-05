"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

/** Short editorial brand story — no invented history, founders or awards. */
export default function Story() {
  return (
    <section id="about" className="scroll-mt-24 overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/products/hibiscus-50g-jar-front.jpg"
                alt="TMUG hibiscus flower tea 50g jar with dried red hibiscus petals"
                fill
                sizes="(max-width: 1024px) 45vw, 300px"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] pt-0">
              <Image
                src="/products/butterfly-pea-100g-pouch-front.jpg"
                alt="TMUG blue butterfly pea flower tea 100g pouch"
                fill
                sizes="(max-width: 1024px) 45vw, 300px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full bg-gold/25 blur-2xl"
          />
        </motion.div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Our story"
            title="Not your nani’s tea dabba. (No disrespect to nani.)"
            description="TMUG started with a simple frustration — great tea in India was either boring commodity packets or overpriced imports. So we packed the good stuff ourselves: whole flowers you can actually see, long leaves that stay whole, and CTC blends bold enough for a proper kadak cup."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft"
          >
            <p>
              Every pack shows you exactly what’s inside — ingredients and brewing steps printed
              right on the label, FSSAI-registered, no mystery blends.
            </p>
            <p>
              Whether it’s a blue butterfly-pea cooler for your feed or the 6 AM chai that runs
              your household — TMUG is tea for how India actually drinks today.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
