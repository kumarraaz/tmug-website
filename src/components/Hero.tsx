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
import MagneticButton from "./motion/MagneticButton";
import { IconArrowRight, IconLeaf, IconCup } from "./icons";

/** 3D-tilting product composition with floating cards. */
function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 120, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 120, damping: 16 });

  const butterfly = getProduct("butterfly-pea")!;
  const hibiscus = getProduct("hibiscus")!;
  const gold = getProduct("gold-tea")!;
  const bImg = frontImage(getVariant(butterfly, butterfly.variants[0].id));
  const hImg = frontImage(getVariant(hibiscus, hibiscus.variants[0].id));
  const gImg = frontImage(getVariant(gold, gold.variants[1].id));

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => { mx.set(0.5); my.set(0.5); }} className="perspective-1000 relative mx-auto w-full max-w-[520px]">
      {/* glow */}
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,166,42,0.25),transparent_65%)] blur-2xl" />

      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* main card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.2rem] bg-white shadow-[0_40px_90px_-25px_rgba(8,42,32,0.45)] ring-1 ring-ink/10"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="relative aspect-[4/5] w-full">
            <Image src={bImg.src} alt={bImg.alt} fill priority sizes="(max-width: 768px) 85vw, 480px" className="object-cover" />
          </div>
          <div className="flex items-center justify-between gap-3 p-5">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-pea">Bestseller</p>
              <p className="font-display text-xl font-extrabold text-ink">{butterfly.name}</p>
            </div>
            <p className="font-display text-2xl font-extrabold text-tea-green">{formatINR(99)}</p>
          </div>
        </motion.div>

        {/* floating card: hibiscus */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="absolute -left-6 top-10 w-32 sm:-left-12 sm:w-40"
          style={{ transform: "translateZ(110px)" }}
        >
          <div className="animate-float overflow-hidden rounded-3xl bg-white shadow-[0_25px_50px_-15px_rgba(216,79,109,0.45)] ring-1 ring-ink/10">
            <div className="relative aspect-square">
              <Image src={hImg.src} alt={hImg.alt} fill sizes="160px" className="object-cover" loading="lazy" />
            </div>
            <p className="px-3 py-2 text-center text-xs font-extrabold text-ink">{formatINR(119)}</p>
          </div>
        </motion.div>

        {/* floating card: gold */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute -right-4 bottom-16 w-32 sm:-right-10 sm:w-40"
          style={{ transform: "translateZ(90px)" }}
        >
          <div className="animate-float-slow overflow-hidden rounded-3xl bg-white shadow-[0_25px_50px_-15px_rgba(216,166,42,0.5)] ring-1 ring-ink/10">
            <div className="relative aspect-square">
              <Image src={gImg.src} alt={gImg.alt} fill sizes="160px" className="object-cover" loading="lazy" />
            </div>
            <p className="px-3 py-2 text-center text-xs font-extrabold text-ink">{formatINR(749)}</p>
          </div>
        </motion.div>

        {/* rotating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.85, type: "spring", stiffness: 200, damping: 16 }}
          className="absolute -top-6 right-6 h-24 w-24 sm:h-28 sm:w-28"
          style={{ transform: "translateZ(130px)" }}
          aria-hidden="true"
        >
          <div className="animate-spin-slow relative h-full w-full">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path id="circ" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <circle cx="50" cy="50" r="50" className="fill-gold" />
              <text className="fill-tea-ink text-[10.5px] font-extrabold uppercase" style={{ letterSpacing: "2.5px" }}>
                <textPath href="#circ">fresh · bold · tmug · fresh · bold ·</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🍵</span>
          </div>
        </motion.div>
      </motion.div>

      {/* floating botanicals */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="animate-float absolute -left-2 bottom-6 text-tea-green/25"><IconLeaf className="h-14 w-14" /></span>
        <span className="animate-float-slow absolute -right-3 top-1/3 text-gold/40"><IconLeaf className="h-10 w-10" /></span>
        <span className="animate-wiggle absolute left-8 top-2 text-blossom/30"><IconCup className="h-9 w-9" /></span>
      </div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream">
      {/* soft gradient wash + dot texture */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_20%_10%,rgba(216,166,42,0.16),transparent),radial-gradient(ellipse_60%_50%_at_85%_85%,rgba(23,107,77,0.12),transparent)]" />
      <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-60" />
      <FloatingLogo opacity={0.045} size="115%" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
        <motion.div style={{ y: textY, opacity: fade }} className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-tea-deep px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-cream">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" aria-hidden="true" />
              Modern Indian Tea Co.
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[13vw] font-black leading-[0.92] tracking-tight text-tea-ink sm:text-7xl lg:text-[5.6rem]"
          >
            TEA, BUT
            <br />
            MAKE IT{" "}
            <span className="relative inline-block text-tea-green">
              FUN.
              <svg viewBox="0 0 220 16" aria-hidden="true" className="absolute -bottom-1 left-0 w-full text-gold">
                <path d="M4 11 C 60 3, 160 3, 216 9" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg lg:mx-0"
          >
            Colour-changing blue teas, tangy ruby reds, mountain greens and{" "}
            <em className="font-bold not-italic text-tea-green">properly kadak chai</em> —
            packed fresh for your everyday ritual.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <MagneticButton
              href="#shop"
              className="rounded-full bg-tea-green px-8 py-4 text-base font-extrabold text-cream shadow-[0_20px_45px_-12px_rgba(23,107,77,0.65)]"
            >
              <span className="inline-flex items-center gap-2">
                Shop Tea <IconArrowRight className="h-5 w-5" />
              </span>
            </MagneticButton>
            <MagneticButton
              href="/collections"
              className="rounded-full border-2 border-tea-green/25 bg-cream-light/60 px-8 py-[14px] text-base font-bold text-tea-green backdrop-blur"
            >
              Explore Collections
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-3 lg:justify-start"
          >
            {["#4A6FD4", "#D84F6D", "#E8A93D", "#8FC93A", "#2E7D4F"].map((c, i) => (
              <motion.span
                key={c}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.55 + i * 0.07, type: "spring", stiffness: 300, damping: 14 }}
                className="h-9 w-9 rounded-full ring-2 ring-white/70 shadow-md"
                style={{ backgroundColor: c }}
                aria-hidden="true"
              />
            ))}
            <span className="ml-1 text-xs font-bold uppercase tracking-widest text-ink-soft">
              7 teas · 13 packs
            </span>
          </motion.div>
        </motion.div>

        <HeroVisual />
      </div>

      {/* scroll cue */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="relative mx-auto mb-8 flex w-max flex-col items-center gap-2 text-ink-soft"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.25em]">Scroll for the good stuff</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="block h-8 w-5 rounded-full border-2 border-ink-soft/40"
        >
          <span className="mx-auto mt-1.5 block h-1.5 w-1.5 rounded-full bg-gold" />
        </motion.span>
      </motion.div>
    </section>
  );
}
