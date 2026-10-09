"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Reveal from "./motion/Reveal";
import { IconArrowRight } from "./icons";
import { useSiteControls } from "@/lib/site-controls-context";

const INGREDIENTS = [
  {
    name: "Aparajita (Butterfly Pea)",
    role: "Natural Blue to Violet Brew",
    tea: "Whole dried Aparajita flowers that brew bright royal blue and turn violet with lemon.",
    color: "#4A6FD4",
  },
  {
    name: "Whole Chamomile Flowers",
    role: "Gentle Evening Calm",
    tea: "Babune ke phool with sweet apple-blossom notes for winding down without caffeine.",
    color: "#D9A441",
  },
  {
    name: "Ruby Hibiscus Petals",
    role: "Tart & Berry-Bright",
    tea: "Whole sun-dried hibiscus calyces brewing brilliant crimson — exceptional hot or iced.",
    color: "#F26B5E",
  },
  {
    name: "Darjeeling Long Leaf",
    role: "Single-Estate Green Tea",
    tea: "Delicate spring harvest leaves giving a clean, floral, antioxidant-rich amber cup.",
    color: "#6C4AB6",
  },
];

export default function MadeWithRealTea() {
  const { controls } = useSiteControls();
  const mrt = controls?.sectionsVisual?.madeWithRealTea;

  return (
    <section
      aria-label="Made with real tea"
      style={{
        backgroundColor: mrt?.bgColor || undefined,
        paddingTop: mrt?.paddingTop !== undefined ? `${mrt.paddingTop}px` : undefined,
        paddingBottom: mrt?.paddingBottom !== undefined ? `${mrt.paddingBottom}px` : undefined,
      }}
      className="relative overflow-hidden bg-warm-ivory py-8 sm:py-12"
    >
      {/* Background radial aura & stickers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[5%] top-[18%] w-14 sm:w-16 opacity-75 animate-float-slow">
          <Image
            src="/assets/stickers/badge-natural.svg"
            alt=""
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* Left Column: Editorial Copy & Ingredients Pills */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-tea-gold/30 bg-warm-surface px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-charcoal shadow-xs">
                <span className="h-2 w-2 rounded-full bg-coral" />
                Pure Botanicals
              </span>
              <h2
                style={{ color: mrt?.headingColor || undefined }}
                className="text-section mt-2 font-display font-black text-charcoal"
              >
                {mrt?.heading || (
                  <>
                    Made with <span className="text-coral">real tea.</span>
                  </>
                )}
              </h2>
              <p
                style={{ color: mrt?.textColor || undefined }}
                className="mt-2 text-sm sm:text-base leading-relaxed text-charcoal/75"
              >
                {mrt?.subheading || "From vibrant butterfly pea flowers to fragrant hibiscus and carefully selected long leaves, TMUG brings distinctive Indian botanical experiences to your everyday cup."}
              </p>
            </Reveal>

            {/* Ingredients Stack */}
            <div className="mt-5 space-y-2.5">
              {INGREDIENTS.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="rounded-2xl border border-charcoal/10 bg-white p-4 shadow-xs transition-all duration-300 hover:border-tea-gold hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0">
                      <p className="font-display text-[15px] font-bold text-charcoal">
                        {item.name}
                      </p>
                      <p className="text-xs text-charcoal/70 mt-0.5 leading-relaxed">
                        {item.tea}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/#shop"
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-8 py-3.5 text-sm font-extrabold text-white shadow-md transition-all duration-200 hover:bg-tea-gold hover:text-charcoal hover:scale-105 active:scale-95"
              >
                Taste the Difference <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Organic Layered Botanical & Product Composition */}
          <div className="relative mx-auto w-full max-w-[460px] sm:max-w-[520px] aspect-square flex items-center justify-center">
            {/* Background Organic Sunburst & Circular Waves */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-warm-surface via-white to-warm-surface shadow-xl border border-tea-gold/25" />

            {/* Radial decorative rings */}
            <div className="absolute inset-6 rounded-full border border-dashed border-tea-gold/40 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-16 rounded-full border border-charcoal/10" />

            {/* Central Featured Product Composition */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-[68%] aspect-[4/5] drop-shadow-[0_24px_45px_rgba(39,35,41,0.25)]"
            >
              <Image
                src="/hero/butterfly-pea-100g-pouch-front.png"
                alt="TMUG Butterfly Pea Pouch Botanical Packaging"
                fill
                sizes="(max-width: 768px) 60vw, 380px"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Floating Hibiscus Jar Flank (Bottom Left) */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [-6, -2, -6] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute left-[2%] bottom-[8%] z-20 w-[34%] aspect-square drop-shadow-[0_16px_28px_rgba(39,35,41,0.2)]"
            >
              <Image
                src="/hero/hibiscus-50g-jar-front.png"
                alt="TMUG Hibiscus Jar"
                fill
                sizes="(max-width: 768px) 30vw, 180px"
                className="object-contain"
              />
            </motion.div>

            {/* Floating Chamomile Jar Flank (Top Right) */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [6, 10, 6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute right-[2%] top-[10%] z-20 w-[32%] aspect-square drop-shadow-[0_16px_28px_rgba(39,35,41,0.2)]"
            >
              <Image
                src="/hero/chamomile-50g-jar-front.png"
                alt="TMUG Chamomile Jar"
                fill
                sizes="(max-width: 768px) 30vw, 170px"
                className="object-contain"
              />
            </motion.div>

            {/* Stamp Badge Overlay */}
            <div className="absolute right-[6%] bottom-[12%] z-30">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-tea-gold bg-gradient-to-br from-plum to-charcoal p-2 flex flex-col items-center justify-center text-center shadow-lg">
                <span className="text-[7px] font-black uppercase tracking-widest text-tea-gold">100%</span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight text-white leading-none">PURE</span>
                <span className="text-[6px] font-bold text-warm-ivory/80">BOTANICALS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
