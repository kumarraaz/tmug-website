"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import Reveal from "./motion/Reveal";
import { IconArrowRight } from "./icons";

const CATEGORY_TABS = [
  { id: "all-teas", label: "All Teas" },
  { id: "flower-teas", label: "Flower Teas" },
  { id: "chai", label: "Chai" },
  { id: "green-tea", label: "Green Tea" },
  { id: "herbal-fresh", label: "Herbal & Fresh" },
  { id: "best-sellers", label: "Bestsellers" },
];

/**
 * Filter products according to category tabs from authentic TMUG catalog.
 */
function getCategoryProducts(tabId: string): Product[] {
  switch (tabId) {
    case "flower-teas":
      return PRODUCTS.filter((p) => p.category === "herbal-flower" && p.id !== "lemongrass");
    case "chai":
      return PRODUCTS.filter((p) => p.category === "chai");
    case "green-tea":
      return PRODUCTS.filter((p) => p.category === "green-tea" || p.id === "darjeeling-green");
    case "herbal-fresh":
      return PRODUCTS.filter((p) => p.category === "herbal-flower");
    case "best-sellers":
      return PRODUCTS.filter((p) => p.featured);
    case "all-teas":
    default:
      return PRODUCTS;
  }
}

export default function ShopCollections() {
  const [activeTab, setActiveTab] = useState("all-teas");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const products = getCategoryProducts(activeTab);

  const checkScrollBounds = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScrollBounds();
    el.addEventListener("scroll", checkScrollBounds, { passive: true });
    window.addEventListener("resize", checkScrollBounds);
    return () => {
      el.removeEventListener("scroll", checkScrollBounds);
      window.removeEventListener("resize", checkScrollBounds);
    };
  }, [checkScrollBounds, products]);

  // When active tab changes, smoothly reset scroll to start
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardEl = sliderRef.current.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + 24 : 320;
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      id="collections"
      aria-label="Shop our collections"
      className="relative overflow-hidden bg-warm-ivory py-8 sm:py-12"
    >
      {/* Decorative subtle background accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[4%] top-[12%] w-12 sm:w-14 opacity-75 animate-float-slow">
          <Image
            src="/assets/stickers/badge-natural.svg"
            alt=""
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
        <div className="absolute left-[3%] bottom-[10%] w-12 sm:w-14 opacity-70 animate-float">
          <Image
            src="/assets/stickers/flower-doodle.svg"
            alt=""
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header with Carousel Controls */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <Reveal className="text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-tea-gold/30 bg-warm-surface px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-charcoal shadow-xs">
              <span className="h-2 w-2 rounded-full bg-tea-gold" />
              Shop by Product
            </span>
            <h2 className="text-section mt-2 font-display font-black text-charcoal">
              Shop Our <span className="text-coral">Collections</span>
            </h2>
            <p className="mt-1.5 max-w-lg text-[14px] sm:text-[15px] text-charcoal/70">
              From slow caffeine-free evening flowers to proper morning doodh chai.
              Every pack is sealed fresh with whole leaves.
            </p>
          </Reveal>

          {/* Desktop Carousel Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal shadow-xs transition-all duration-200 ${
                canScrollLeft
                  ? "hover:bg-tea-gold hover:text-charcoal hover:scale-105 active:scale-95 cursor-pointer"
                  : "opacity-35 cursor-not-allowed"
              }`}
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next products"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal shadow-xs transition-all duration-200 ${
                canScrollRight
                  ? "hover:bg-tea-gold hover:text-charcoal hover:scale-105 active:scale-95 cursor-pointer"
                  : "opacity-35 cursor-not-allowed"
              }`}
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="no-scrollbar mt-5 sm:mt-6 flex snap-x snap-mandatory justify-start sm:justify-start gap-2 overflow-x-auto px-1 pb-1">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`shrink-0 rounded-full px-4.5 py-2 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-charcoal text-white shadow-[0_6px_16px_-4px_rgba(39,35,41,0.35)] scale-105 ring-2 ring-tea-gold"
                    : "border border-charcoal/15 bg-white text-charcoal hover:border-tea-gold hover:text-coral hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Real Interactive Horizontal Product Slider Track */}
        <div className="relative mt-5">
          <div
            ref={sliderRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 pt-1 px-1"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}

          >
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-none w-[80vw] max-w-[310px] min-w-[260px] snap-center sm:snap-start sm:w-[calc(50%-12px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] lg:min-w-[270px] lg:max-w-[305px]"
                >
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile Swipe Indicators & Arrow Controls */}
          <div className="mt-4 flex items-center justify-between sm:hidden px-2">
            <span className="text-xs font-bold text-charcoal/60">
              ← Swipe to explore teas →
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal ${
                  canScrollLeft ? "active:bg-tea-gold active:text-charcoal" : "opacity-35"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Next"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal ${
                  canScrollRight ? "active:bg-tea-gold active:text-charcoal" : "opacity-35"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* View All Collections Button */}
        <div className="mt-8 text-center sm:mt-10">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal/20 bg-white px-8 py-3.5 text-sm font-extrabold text-charcoal shadow-xs transition-all duration-300 hover:border-tea-gold hover:bg-tea-gold hover:text-charcoal hover:scale-105 active:scale-95"
          >
            Explore Complete Catalog <IconArrowRight className="h-4 w-4 text-coral" />
          </Link>
        </div>
      </div>
    </section>
  );
}
