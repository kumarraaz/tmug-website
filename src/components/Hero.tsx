"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HERO_BANNERS, type HeroBanner } from "@/config/banners";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const bannerCount = HERO_BANNERS.length;
  const currentBanner = HERO_BANNERS[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerCount);
  }, [bannerCount]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + bannerCount) % bannerCount);
  }, [bannerCount]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Autoplay management (5.5s per slide, paused on hover/touch)
  useEffect(() => {
    if (isPaused || reduceMotion) return;

    autoplayTimerRef.current = setTimeout(() => {
      goToNext();
    }, 5500);

    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
  }, [currentIndex, isPaused, reduceMotion, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 45; // px
    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrev();
    }
  };

  return (
    <section
      id="hero-banner"
      aria-label="Featured Campaigns & Hero Banners"
      className="relative overflow-hidden bg-warm-surface"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Stage Container */}
      <div className="relative mx-auto max-w-[1920px]">
        {/* Banner Aspect Ratio Box: Wide Campaign format (2.35:1 desktop / responsive mobile) */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] w-full overflow-hidden bg-[#272329]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentBanner.id}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.99 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0"
            >
              {/* Entire Banner Click Destination */}
              <Link
                href={currentBanner.destination}
                aria-label={`${currentBanner.headline} — ${currentBanner.cta}`}
                className="group relative block h-full w-full focus:outline-hidden"
              >
                {/* Complete Artwork Asset — Unstretched, uncropped packaging & typography */}
                <Image
                  src={currentBanner.image}
                  alt={currentBanner.alt}
                  fill
                  priority={currentIndex === 0}
                  sizes="100vw"
                  className="object-cover object-center sm:object-contain lg:object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                />

                {/* Subtle soft gradient scrim on mobile/small screens to ensure high contrast */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent sm:hidden"
                />

                {/* Mobile / Compact Screen Editorial Overlay Strip */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:hidden">
                  {currentBanner.campaign && (
                    <span className="inline-block rounded-full bg-tea-gold/90 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-charcoal shadow-xs">
                      {currentBanner.campaign}
                    </span>
                  )}
                  <p className="mt-1 font-display text-lg font-black leading-tight text-white drop-shadow-md">
                    {currentBanner.headline}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-black text-charcoal shadow-md">
                    {currentBanner.cta} →
                  </span>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Previous / Next Arrow Controls (Desktop & Tablet) */}
          <div className="pointer-events-none absolute inset-y-0 inset-x-3 sm:inset-x-6 z-20 flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                goToPrev();
              }}
              aria-label="Previous promotional banner"
              className="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-tea-gold hover:text-charcoal hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-tea-gold cursor-pointer"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
              aria-label="Next promotional banner"
              className="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-tea-gold hover:text-charcoal hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-tea-gold cursor-pointer"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Campaign Navigation & Pagination Strip */}
        <div className="relative z-20 border-b border-tea-gold/20 bg-warm-ivory/95 px-4 py-3.5 backdrop-blur-md sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            {/* Slide Numeric Indicator: 01 / 06 */}
            <div className="flex items-center gap-2">
              <span className="font-display text-sm sm:text-base font-extrabold tracking-tight text-charcoal">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="text-xs text-charcoal/40 font-bold">/</span>
              <span className="text-xs sm:text-sm font-semibold text-charcoal/60">
                {String(bannerCount).padStart(2, "0")}
              </span>
              <span className="hidden sm:inline-block ml-3 h-3.5 w-px bg-charcoal/15" />
              <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                {currentBanner.category}
              </span>
            </div>

            {/* Pagination Line / Pill Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2" role="tablist" aria-label="Banner slides">
              {HERO_BANNERS.map((banner, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={banner.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${idx + 1}: ${banner.headline}`}
                    onClick={() => goToSlide(idx)}
                    className={`relative h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "w-7 sm:w-10 bg-tea-gold shadow-xs"
                        : "w-2 bg-charcoal/20 hover:bg-charcoal/40"
                    }`}
                  />
                );
              })}
            </div>

            {/* Direct Action Link */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href={currentBanner.destination}
                className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-4 py-1.5 text-xs font-black text-charcoal transition-all hover:border-tea-gold hover:bg-tea-gold hover:text-charcoal hover:scale-105 active:scale-95"
              >
                <span>{currentBanner.cta}</span>
                <span className="text-coral">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
