"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSiteControls } from "@/lib/site-controls-context";

const TRUST_POINTS = [
  {
    icon: "/assets/stickers/tea-cup.svg",
    title: "Premium Indian Tea",
    subtitle: "Heritage blends & botanicals",
  },
  {
    icon: "/assets/stickers/tea-leaf.svg",
    title: "Whole Leaves & Flowers",
    subtitle: "Never dust, never fannings",
  },
  {
    icon: "/assets/stickers/badge-natural.svg",
    title: "Fresh Small Batches",
    subtitle: "Aroma-locked glass jars & pouches",
  },
  {
    icon: "/assets/stickers/sparkle.svg",
    title: "Ships Across India",
    subtitle: "Safe pan-India delivery",
  },
  {
    icon: "/assets/stickers/badge-kadak.svg",
    title: "WhatsApp Ordering",
    subtitle: "Easy ordering with real humans",
  },
];

export default function TrustStrip() {
  const { controls } = useSiteControls();
  const ts = controls?.sectionsVisual?.trustStrip;

  return (
    <section
      aria-label="TMUG Quality Highlights"
      style={{
        backgroundColor: ts?.bgColor || undefined,
        color: ts?.textColor || undefined,
        paddingTop: ts?.paddingTop !== undefined ? `${ts.paddingTop}px` : undefined,
        paddingBottom: ts?.paddingBottom !== undefined ? `${ts.paddingBottom}px` : undefined,
      }}
      className="relative z-10 border-y border-tea-gold/20 bg-gradient-to-r from-warm-ivory via-peach-cream/40 to-warm-ivory py-3 sm:py-4 shadow-xs"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Desktop / Tablet Grid */}
        <div className="hidden lg:grid grid-cols-5 gap-4 items-center">
          {TRUST_POINTS.map((item, i) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="group flex items-center gap-3 rounded-2xl border border-transparent p-2 transition-all hover:border-[#D8A62A]/30 hover:bg-white/80 hover:shadow-xs"
            >
              <div className="relative h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-tea-green/10 p-1.5 transition-transform duration-300 group-hover:rotate-6">
                <Image
                  src={item.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-black uppercase tracking-wider text-charcoal leading-tight">
                  {item.title}
                </p>
                <p className="text-[10px] font-medium text-charcoal/70 leading-tight truncate">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile / Tablet Horizontal Smooth Carousel / Ticker */}
        <div className="lg:hidden no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-1 py-1">
          {TRUST_POINTS.map((item) => (
            <div
              key={item.title}
              className="flex shrink-0 snap-start items-center gap-3 rounded-2xl border border-tea-gold/30 bg-white/90 px-4 py-2.5 shadow-xs backdrop-blur-xs"
            >
              <div className="relative h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-tea-gold/15 p-1.5">
                <Image
                  src={item.icon}
                  alt=""
                  width={28}
                  height={28}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-charcoal whitespace-nowrap">
                  {item.title}
                </p>
                <p className="text-[10px] font-medium text-charcoal/70 whitespace-nowrap">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
