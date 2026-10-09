"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Reveal from "./motion/Reveal";
import { useSiteControls } from "@/lib/site-controls-context";

const TRUST_METRICS = [
  {
    badge: "100%",
    title: "Whole Leaves & Flowers",
    desc: "Dried whole flowers and single-estate leaves, never tea dust or industrial fannings.",
    sticker: "/assets/stickers/badge-natural.svg",
  },
  {
    badge: "0%",
    title: "Artificial Additives",
    desc: "Pure botanicals and authentic CTC chai. What is on the label is exactly what is inside.",
    sticker: "/assets/stickers/sparkle.svg",
  },
  {
    badge: "Fresh",
    title: "Small-Batch Packing",
    desc: "Aroma-sealed zip pouches and amber glass jars packed fresh for maximum aroma.",
    sticker: "/assets/stickers/tea-leaf.svg",
  },
  {
    badge: "Pan-India",
    title: "Direct Doorstep Delivery",
    desc: "Carefully shipped across India with instant WhatsApp order tracking and updates.",
    sticker: "/assets/stickers/badge-kadak.svg",
  },
];

export default function BrandProof() {
  const { controls } = useSiteControls();
  const bp = controls?.sectionsVisual?.brandProof;

  return (
    <section
      aria-label="Tea worth talking about"
      style={{
        backgroundColor: bp?.bgColor || undefined,
        paddingTop: bp?.paddingTop !== undefined ? `${bp.paddingTop}px` : undefined,
        paddingBottom: bp?.paddingBottom !== undefined ? `${bp.paddingBottom}px` : undefined,
      }}
      className="relative overflow-hidden bg-plum py-8 sm:py-12 text-warm-ivory"
    >
      {/* Background radial glow & floating decorative stickers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(217,164,65,0.15)_0%,rgba(242,107,94,0.08)_50%,transparent_75%)] blur-3xl" />
        <div className="absolute right-[8%] top-[14%] w-10 sm:w-12 opacity-60 animate-float-slow">
          <Image
            src="/assets/stickers/sparkle.svg"
            alt=""
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-tea-gold/40 bg-white/10 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#EFC65E]">
            <span className="h-1.5 w-1.5 rounded-full bg-tea-gold" />
            Honest Quality
          </span>
          <h2
            style={{ color: bp?.headingColor || undefined }}
            className="text-section mt-2 font-display font-extrabold text-cream"
          >
            {bp?.heading || (
              <>
                Tea worth <span className="text-tea-gold">talking about.</span>
              </>
            )}
          </h2>
          <p
            style={{ color: bp?.textColor || undefined }}
            className="mt-2 text-xs sm:text-sm leading-relaxed text-cream/75"
          >
            {bp?.subheading || "No corporate jargon. No artificial colours. Just proper Indian tea crafted with vibrant whole botanicals and heritage teas made for your daily ritual."}
          </p>
        </Reveal>

        {/* Honest Trust Metrics Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_METRICS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs transition-all duration-300 hover:border-tea-gold/50 hover:bg-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-2xl sm:text-3xl font-extrabold text-gold">
                  {item.badge}
                </span>
                <div className="relative h-9 w-9 shrink-0 opacity-80 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Image
                    src={item.sticker}
                    alt=""
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
              </div>

              <h3 className="font-display text-lg font-bold text-cream group-hover:text-gold-soft transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-cream/65">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
