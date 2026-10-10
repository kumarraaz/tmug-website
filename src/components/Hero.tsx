"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HERO_BANNERS, type HeroBanner } from "@/config/banners";
import { useSiteControls } from "@/lib/site-controls-context";

function mapToHeroBanner(b: any): HeroBanner {
  return {
    id: b.id || "banner",
    headline: b.headline || b.title || "Experience Pure Tea",
    subtitle: b.subtitle || b.subheadline || "",
    campaign: b.campaign || "Featured",
    category: b.category || "Botanical Tea",
    cta: b.cta || b.ctaText || "Shop Collection",
    destination: b.destination || b.ctaLink || "/#shop",
    image: b.image || b.desktopSrc || "/banners/s1.png",
    mobileImage: b.mobileImage || b.mobileSrc || b.image || b.desktopSrc || "/banners/s1.png",
    alt: b.alt || b.headline || b.title || "TMUG Tea",
  };
}

export default function Hero() {
  const { controls } = useSiteControls();
  const heroSettings = controls?.sectionsVisual?.hero;
  const banners: HeroBanner[] = (controls?.banners && controls.banners.length > 0)
    ? controls.banners.map(mapToHeroBanner)
    : HERO_BANNERS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const bannerCount = banners.length;
  const currentBanner = banners[currentIndex] || banners[0] || HERO_BANNERS[0];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerCount);
  }, [bannerCount]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + bannerCount) % bannerCount);
  }, [bannerCount]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  const autoplayInterval = heroSettings?.interval || 5500;
  const isAutoplay = heroSettings?.autoplay !== false;

  // Autoplay management (paused on hover/touch)
  useEffect(() => {
    if (!isAutoplay || isPaused || reduceMotion) return;

    autoplayTimerRef.current = setTimeout(() => {
      goToNext();
    }, autoplayInterval);

    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
  }, [currentIndex, isPaused, reduceMotion, goToNext, autoplayInterval, isAutoplay]);

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
      style={{
        backgroundColor: heroSettings?.bgColor || undefined,
        paddingTop: heroSettings?.paddingTop !== undefined ? `${heroSettings.paddingTop}px` : undefined,
        paddingBottom: heroSettings?.paddingBottom !== undefined ? `${heroSettings.paddingBottom}px` : undefined,
      }}
      className="relative overflow-hidden bg-warm-surface"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Stage Container */}
      <div className="relative mx-auto max-w-[1920px]">
        {/* Banner Aspect Ratio Box: Native 2.4:1 campaign banner ratio across all viewports */}
        <div className="relative aspect-[2.4/1] w-full overflow-hidden bg-[#272329]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentBanner.id}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.995 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: [0.25, 0.1, 0.25, 1] }}
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
                  className="object-contain sm:object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.008]"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Previous / Next Arrow Controls (Desktop & Tablet) */}
          {heroSettings?.showArrows !== false && (
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
          )}
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
            {heroSettings?.showDots !== false && (
              <div className="flex items-center gap-1.5 sm:gap-2" role="tablist" aria-label="Banner slides">
                {banners.map((banner, idx) => {
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
            )}

            {/* Direct Action Link */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={currentBanner.destination}
                className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-black text-charcoal transition-all hover:border-tea-gold hover:bg-tea-gold hover:text-charcoal hover:scale-105 active:scale-95"
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
