"use client";

import { useRef } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/data/products";
import ProductCard from "./ProductCard";
import Reveal from "./motion/Reveal";

export default function FeaturedSlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const offset = direction === "left" ? -340 : 340;
    trackRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section
      id="featured"
      aria-label="Featured Tea Collection"
      className="relative overflow-hidden bg-cream py-14 sm:py-20"
    >
      {/* Decorative background doodles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[3%] top-[12%] h-10 w-10 opacity-70 animate-float-slow">
          <Image
            src="/assets/stickers/sparkle.svg"
            alt=""
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <div className="absolute right-[4%] top-[18%] h-12 w-12 opacity-80 animate-float">
          <Image
            src="/assets/stickers/tea-leaf.svg"
            alt=""
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header with Title & Arrow Controls */}
        <Reveal className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-tea-green/20 bg-white/70 px-3.5 py-1 text-xs font-black uppercase tracking-[0.18em] text-tea-green">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              The Artisan Lineup
            </div>
            <h2 className="text-section mt-2 font-display font-extrabold text-tea-ink">
              Meet Your New <span className="text-tea-green">Favourite Tea</span>
            </h2>
            <p className="mt-2 text-[15px] sm:text-base text-ink-soft max-w-lg">
              Whole dried flowers, single-estate green tea, and properly kadak CTC chai.
              Packed fresh for your everyday cup.
            </p>
          </div>

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-tea-green/20 bg-white text-tea-ink shadow-xs transition-all duration-200 hover:border-tea-green hover:bg-tea-green hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-tea-green/20 bg-white text-tea-ink shadow-xs transition-all duration-200 hover:border-tea-green hover:bg-tea-green hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </Reveal>
      </div>

      {/* Horizontal Product Carousel Track */}
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        {PRODUCTS.map((product, i) => (
          <div
            key={product.id}
            className="w-[260px] sm:w-[290px] lg:w-[310px] shrink-0 snap-start"
          >
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
