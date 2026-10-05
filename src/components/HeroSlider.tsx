"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, frontImage, getVariant } from "@/data/products";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconArrowLeft, IconArrowRight, IconPlus } from "./icons";

const FEATURED = PRODUCTS.filter((p) => p.featured);
const AUTOPLAY_MS = 5200;

/** Featured-product slider with autoplay, swipe, arrows and progress. */
export default function HeroSlider() {
  const { addToCart, setQuickViewId } = useShop();
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: number) => {
    setIndex(([i]) => [(i + dir + FEATURED.length) % FEATURED.length, dir]);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => go(1), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, go, index]);

  const product = FEATURED[index];
  const variant = getVariant(product, product.variants[0].id);
  const image = frontImage(variant);

  const variants = {
    enter: (d: number) => ({ x: d >= 0 ? 90 : -90, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d >= 0 ? -90 : 90, opacity: 0, scale: 0.96 }),
  };

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] bg-tea-green text-cream shadow-[0_30px_80px_-20px_rgba(28,68,23,0.55)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured teas"
    >
      {/* decorative rings */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

      <div className="relative min-h-[420px] sm:min-h-[460px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={product.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(1);
              else if (info.offset.x > 70) go(-1);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${FEATURED.length}: ${product.name}`}
          >
            <div className="grid h-full grid-cols-1 items-center gap-2 p-6 sm:grid-cols-2 sm:p-8">
              <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 70vw, 300px"
                  className="rounded-3xl object-cover shadow-xl"
                  draggable={false}
                />
                <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-tea-dark">
                  Bestseller
                </span>
              </div>
              <div className="flex flex-col items-start gap-3 text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-soft">
                  Featured tea
                </p>
                <h3 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                  {product.name}
                </h3>
                <p className="text-sm text-cream/75">{product.tagline}</p>
                <p className="text-xl font-extrabold text-gold-soft">
                  {formatINR(variant.price)}{" "}
                  <span className="text-sm font-semibold text-cream/60 line-through">
                    {variant.compareAtPrice ? formatINR(variant.compareAtPrice) : ""}
                  </span>
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                  <button
                    type="button"
                    onClick={() => addToCart(product, variant, 1)}
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-tea-dark transition-transform hover:scale-[1.03] active:scale-95"
                  >
                    <IconPlus className="h-4 w-4" /> Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickViewId(product.id)}
                    className="rounded-full border border-cream/30 px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-white/10"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="relative flex items-center justify-between px-6 pb-5 sm:px-8">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous featured tea"
            className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20"
          >
            <IconArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next featured tea"
            className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20"
          >
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
          {FEATURED.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${p.name}`}
              onClick={() => setIndex([i, i > index ? 1 : -1])}
              className="group py-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-gold" : "w-3 bg-cream/30 group-hover:bg-cream/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
