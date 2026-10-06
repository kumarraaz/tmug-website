"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
      className="relative overflow-hidden bg-cream-light py-14 sm:py-20"
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
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-tea-green/20 bg-white/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-tea-green shadow-xs">
              <span className="h-2 w-2 rounded-full bg-gold" />
              Curated Blends
            </span>
            <h2 className="text-section mt-3 font-display font-extrabold text-tea-ink">
              Shop Our <span className="text-tea-green">Collections</span>
            </h2>
            <p className="mt-2 max-w-lg text-[15px] sm:text-base text-ink-soft">
              Explore by mood, taste, or ritual. Every pack is sealed fresh with whole leaves and
              flowers.
            </p>
          </Reveal>

          {/* Desktop Carousel Arrow Controls */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 bg-white text-tea-ink shadow-sm transition-all duration-200 ${
                canScrollLeft
                  ? "hover:bg-tea-green hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next products"
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 bg-white text-tea-ink shadow-sm transition-all duration-200 ${
                canScrollRight
                  ? "hover:bg-tea-green hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="no-scrollbar mt-8 sm:mt-10 flex snap-x snap-mandatory justify-start sm:justify-start gap-2 overflow-x-auto px-1 pb-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-tea-green text-cream shadow-[0_8px_20px_-6px_rgba(23,107,77,0.5)] scale-105"
                    : "border border-ink/10 bg-white/80 text-tea-ink hover:border-tea-green/40 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Real Interactive Horizontal Product Slider Track */}
        <div className="relative mt-8">
          <div
            ref={sliderRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 pt-2 px-1"
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
            <span className="text-xs font-bold text-ink-soft">
              ← Swipe to explore teas →
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 bg-white text-tea-ink ${
                  canScrollLeft ? "active:bg-tea-green active:text-white" : "opacity-35"
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
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 bg-white text-tea-ink ${
                  canScrollRight ? "active:bg-tea-green active:text-white" : "opacity-35"
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
            className="inline-flex items-center gap-2 rounded-full border-2 border-tea-green/25 bg-white px-8 py-3.5 text-sm font-extrabold text-tea-green shadow-xs transition-all duration-300 hover:border-tea-green hover:bg-tea-green hover:text-white hover:scale-105 active:scale-95"
          >
            Explore Complete Catalog <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
