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
import { useSiteControls } from "@/lib/site-controls-context";

const CATEGORY_TABS = [
  { id: "all-teas", label: "All Teas" },
  { id: "flower-teas", label: "Flower Teas" },
  { id: "chai", label: "Kadak Chai" },
  { id: "green-tea", label: "Green Tea" },
  { id: "herbal-fresh", label: "Herbal & Fresh" },
  { id: "best-sellers", label: "Bestsellers" },
];

/**
 * Filter products according to category tabs from authentic TMUG catalog.
 */
function getCategoryProducts(tabId: string, allProducts: Product[]): Product[] {
  switch (tabId) {
    case "flower-teas":
      return allProducts.filter((p) => p.category === "herbal-flower" && p.id !== "lemongrass");
    case "chai":
      return allProducts.filter((p) => p.category === "chai");
    case "green-tea":
      return allProducts.filter((p) => p.category === "green-tea" || p.id === "darjeeling-green");
    case "herbal-fresh":
      return allProducts.filter((p) => p.category === "herbal-flower");
    case "best-sellers":
      return allProducts.filter((p) => p.featured);
    case "all-teas":
    default:
      return allProducts;
  }
}

export default function ShopCollections() {
  const { controls } = useSiteControls();
  const collSettings = controls?.sectionsVisual?.collections;

  const [activeTab, setActiveTab] = useState("all-teas");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const products = getCategoryProducts(activeTab, PRODUCTS);

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

  // Smoothly reset scroll on tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardEl = sliderRef.current.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + 20 : 280;
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      id="collections"
      aria-label="Shop our collections"
      style={{
        backgroundColor: collSettings?.bgColor || undefined,
        paddingTop: collSettings?.paddingTop !== undefined ? `${collSettings.paddingTop}px` : undefined,
        paddingBottom: collSettings?.paddingBottom !== undefined ? `${collSettings.paddingBottom}px` : undefined,
      }}
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF7EF] via-[#FBE7DC]/40 to-[#FFF7EF] py-8 sm:py-12"
    >
      {/* Decorative subtle background accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[3%] top-[10%] w-12 sm:w-16 opacity-70 animate-float-slow">
          <Image
            src="/assets/stickers/badge-natural.svg"
            alt=""
            width={60}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="absolute left-[2%] bottom-[12%] w-10 sm:w-14 opacity-70 animate-float">
          <Image
            src="/assets/stickers/flower-doodle.svg"
            alt=""
            width={52}
            height={52}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1560px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <Reveal className="text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#F8B77C] bg-white/90 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#33243A] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#FAA4B5]" />
              The TMUG Product Rail
            </span>
            <h2
              style={{ color: collSettings?.headingColor || undefined }}
              className="text-section mt-1.5 font-display font-black text-[#33243A]"
            >
              {collSettings?.heading || (
                <>
                  Shop Our <span className="text-[#FAA4B5]">Collections</span>
                </>
              )}
            </h2>
            <p
              style={{ color: collSettings?.textColor || undefined }}
              className="mt-1 max-w-lg text-[13px] sm:text-[14px] text-[#3A3438]/80"
            >
              {collSettings?.subheading || "Whole flower herbal teas and authentic mountain estate chai, sealed fresh for your cup."}
            </p>
          </Reveal>

          {/* Top Desktop Carousel Controls */}
          {collSettings?.showArrows !== false && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous products"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#3A3438]/15 bg-white text-[#33243A] shadow-xs transition-all duration-200 ${
                  canScrollLeft
                    ? "hover:bg-[#FFF183] hover:text-[#33243A] hover:scale-105 active:scale-95 cursor-pointer"
                    : "opacity-30 cursor-not-allowed"
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
                aria-label="Next products"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#3A3438]/15 bg-white text-[#33243A] shadow-xs transition-all duration-200 ${
                  canScrollRight
                    ? "hover:bg-[#FFF183] hover:text-[#33243A] hover:scale-105 active:scale-95 cursor-pointer"
                    : "opacity-30 cursor-not-allowed"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="no-scrollbar mt-5 flex snap-x snap-mandatory justify-start gap-2 overflow-x-auto px-1 pb-1">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#33243A] text-white shadow-md ring-2 ring-[#FFF183] scale-105"
                    : "border border-[#3A3438]/15 bg-white/90 text-[#33243A] hover:border-[#FAA4B5] hover:text-[#FAA4B5] hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Wide Screen Product Rail Carousel with Flank Arrow Controls ── */}
        <div className="relative mt-5">
          {/* Outer Left Flank Arrow Button (Desktop, outside product packaging area) */}
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`hidden xl:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-[#3A3438]/15 bg-white text-[#33243A] shadow-lg transition-all duration-200 ${
              canScrollLeft
                ? "hover:bg-[#FAA4B5] hover:scale-110 active:scale-95 cursor-pointer"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slider Track (Full width from left to right, 4-6 products on desktop, 1-2 on mobile) */}
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
                  className="flex-none w-[78vw] max-w-[275px] min-w-[230px] snap-center sm:snap-start sm:w-[calc(50%-12px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-14px)] xl:w-[calc(20%-14px)] 2xl:w-[calc(16.666%-14px)]"
                >
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Outer Right Flank Arrow Button (Desktop, outside product packaging area) */}
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-[#3A3438]/15 bg-white text-[#33243A] shadow-lg transition-all duration-200 ${
              canScrollRight
                ? "hover:bg-[#FAA4B5] hover:scale-110 active:scale-95 cursor-pointer"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Mobile Swipe Indicators & Arrow Controls */}
          <div className="mt-3 flex items-center justify-between sm:hidden px-2">
            <span className="text-xs font-bold text-[#3A3438]/60">
              ← Swipe to explore teas →
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#3A3438]/15 bg-white text-[#33243A] ${
                  canScrollLeft ? "active:bg-[#FFF183]" : "opacity-30"
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
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#3A3438]/15 bg-white text-[#33243A] ${
                  canScrollRight ? "active:bg-[#FFF183]" : "opacity-30"
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
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#3A3438]/20 bg-white px-8 py-3 text-sm font-black text-[#33243A] shadow-xs transition-all duration-300 hover:border-[#F8B77C] hover:bg-[#FFF183] hover:scale-105 active:scale-95"
          >
            Explore Complete Catalog <IconArrowRight className="h-4 w-4 text-[#FAA4B5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
