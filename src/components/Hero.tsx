"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { getProduct, frontImage, getVariant } from "@/data/products";
import { formatINR } from "@/lib/format";
import FloatingLogo from "./motion/FloatingLogo";
import { IconArrowRight, IconLeaf } from "./icons";

/** Compact product composition: gentle float, subtle tilt, one accent card. */
function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 120, damping: 18 });

  const butterfly = getProduct("butterfly-pea")!;
  const hibiscus = getProduct("hibiscus")!;
  const bImg = frontImage(getVariant(butterfly, butterfly.variants[0].id));
  const hImg = frontImage(getVariant(hibiscus, hibiscus.variants[0].id));

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      className="perspective-1000 relative mx-auto w-[62vw] max-w-[300px] sm:max-w-[340px]"
    >
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[105%] w-[105%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,166,42,0.18),transparent_65%)] blur-2xl" />

      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="animate-float relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_60px_-24px_rgba(8,42,32,0.4)] ring-1 ring-ink/10"
        >
          <div className="relative aspect-[4/5] w-full">
            <Image src={bImg.src} alt={bImg.alt} fill priority sizes="(max-width: 768px) 62vw, 340px" className="object-cover" />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-pea">Bestseller</p>
              <p className="font-display text-base font-bold text-ink">{butterfly.name}</p>
            </div>
            <p className="font-display text-lg font-extrabold text-tea-green">{formatINR(99)}</p>
          </div>
        </motion.div>

        {/* small floating accent card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute -right-5 top-8 w-24 sm:-right-8 sm:w-28"
          aria-hidden="true"
        >
          <div className="animate-float-slow overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-ink/10">
            <div className="relative aspect-square">
              <Image src={hImg.src} alt="" fill sizes="112px" loading="lazy" className="object-cover" />
            </div>
            <p className="px-2 py-1.5 text-center text-[11px] font-extrabold text-ink">{formatINR(119)}</p>
          </div>
        </motion.div>

        <span className="animate-float absolute -left-4 bottom-4 text-tea-green/20" aria-hidden="true">
          <IconLeaf className="h-10 w-10" />
        </span>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_20%_10%,rgba(216,166,42,0.12),transparent),radial-gradient(ellipse_55%_45%_at_85%_85%,rgba(23,107,77,0.08),transparent)]" />
      <FloatingLogo opacity={0.04} size="95%" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-16 lg:pt-14">
        <motion.div style={reduce ? undefined : { y: textY }} className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-tea-green/20 bg-white/70 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-tea-green">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              Modern Indian Tea Co.
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-hero mt-5 font-display font-extrabold text-tea-ink"
          >
            Tea, but
            <br />
            make it <span className="text-tea-green">fun.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-base lg:mx-0"
          >
            Colour-changing blue teas, tangy ruby reds and properly kadak chai —
            packed fresh for your everyday ritual.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#shop"
              className="inline-flex items-center gap-2 rounded-full bg-tea-green px-7 py-3.5 text-[15px] font-extrabold text-cream shadow-[0_14px_30px_-12px_rgba(23,107,77,0.6)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Shop Tea <IconArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/collections"
              className="inline-flex items-center gap-2 rounded-full border border-tea-green/25 bg-white/60 px-7 py-3.5 text-[15px] font-bold text-tea-green transition-colors duration-200 hover:border-tea-green/50"
            >
              Explore Collections
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft"
          >
            7 teas · 13 packs · Ships across India
          </motion.p>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}
