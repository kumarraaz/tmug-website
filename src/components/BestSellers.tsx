"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PRODUCTS, frontImage, getVariant } from "@/data/products";
import type { Product } from "@/types";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import Reveal from "./motion/Reveal";
import ProductCard from "./ProductCard";
import AddToCartButton from "./cart/AddToCartButton";
import { IconArrowRight, IconStar, IconCheck, IconTrash } from "./icons";

// Verified Best Seller IDs from collections.ts
const BEST_SELLER_IDS = ["butterfly-pea", "hibiscus", "darjeeling-green", "gold-tea"];
const BEST_SELLER_PRODUCTS: Product[] = BEST_SELLER_IDS.map((id) =>
  PRODUCTS.find((p) => p.id === id)!
).filter(Boolean);

export default function BestSellers() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFrontView, setIsFrontView] = useState(true);
  const reduceMotion = useReducedMotion();
  const sliderRef = useRef<HTMLDivElement>(null);

  const { lines, updateQty, removeLine, showToast } = useShop();

  const activeProduct = BEST_SELLER_PRODUCTS[activeIdx] || BEST_SELLER_PRODUCTS[0];
  const [activeVariantId, setActiveVariantId] = useState(activeProduct.variants[0].id);

  // When changing product, reset variant
  const handleSelectProduct = (idx: number) => {
    setActiveIdx(idx);
    setIsFrontView(true);
    setActiveVariantId(BEST_SELLER_PRODUCTS[idx].variants[0].id);
  };

  const currentVariant = getVariant(activeProduct, activeVariantId);
  const frontImg = frontImage(currentVariant);
  const backImg = currentVariant.images.find((i) => i.kind === "back");

  const cartItem = lines.find((l) => l.variantId === currentVariant.id);
  const isInCart = Boolean(cartItem);

  const handleNext = () => {
    handleSelectProduct((activeIdx + 1) % BEST_SELLER_PRODUCTS.length);
  };

  const handlePrev = () => {
    handleSelectProduct(
      (activeIdx - 1 + BEST_SELLER_PRODUCTS.length) % BEST_SELLER_PRODUCTS.length
    );
  };

  const handleRemove = () => {
    removeLine(currentVariant.id);
    showToast(`${activeProduct.name} removed from cart`);
  };

  const handleQtyChange = (qty: number) => {
    if (qty <= 0) {
      handleRemove();
    } else {
      updateQty(currentVariant.id, qty);
    }
  };

  return (
    <section
      id="best-sellers"
      aria-label="TMUG Best Sellers"
      className="relative overflow-hidden bg-warm-surface/60 py-16 sm:py-24"
    >
      {/* Background Decorative Botantical Accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-pink-accent/20 blur-3xl" />
        <div className="absolute right-0 bottom-20 h-80 w-80 rounded-full bg-tea-gold/15 blur-3xl" />
        <div className="absolute right-[5%] top-[8%] w-12 sm:w-14 opacity-70 animate-float">
          <Image
            src="/assets/stickers/sparkle.svg"
            alt=""
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-tea-gold/40 bg-white/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-charcoal shadow-xs">
              <IconStar className="h-3 w-3 fill-tea-gold text-tea-gold" />
              Customer Favourites
            </span>
            <h2 className="text-section mt-3 font-display font-black text-charcoal">
              Best <span className="text-coral">Sellers</span>
            </h2>
            <p className="mt-2 text-[15px] sm:text-base text-charcoal/70">
              The teas everyone keeps reordering. Discover why these signature blends define the TMUG experience.
            </p>
          </Reveal>
        </div>

        {/* ── HALF-SCREEN PRODUCT EXPERIENCE (50/50 Split Showcase) ── */}
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white shadow-[0_20px_50px_-20px_rgba(39,35,41,0.18)]">
          {/* Product Switcher Navigation Tabs */}
          <div className="border-b border-charcoal/8 bg-warm-ivory/60 px-4 py-3 sm:px-6">
            <div className="no-scrollbar flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-2">
                {BEST_SELLER_PRODUCTS.map((prod, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectProduct(idx)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-charcoal text-white shadow-xs ring-2 ring-tea-gold"
                          : "border border-charcoal/15 bg-white text-charcoal hover:border-tea-gold hover:text-coral"
                      }`}
                    >
                      {prod.name.replace("Flower Tea", "Tea")}
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next Switcher Controls */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous best seller"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal shadow-xs hover:bg-tea-gold hover:text-charcoal cursor-pointer active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next best seller"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal shadow-xs hover:bg-tea-gold hover:text-charcoal cursor-pointer active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 50/50 Split Content */}
          <div className="grid lg:grid-cols-2">
            {/* LEFT 50%: Large Product Visual Stage */}
            <div className="relative flex min-h-[380px] sm:min-h-[460px] items-center justify-center overflow-hidden bg-gradient-to-br from-warm-ivory via-warm-surface to-warm-ivory p-6 sm:p-10">
              {/* Luminous Gen-Z Pink / Coral Glow Backdrop */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-[320px] w-[320px] rounded-full blur-3xl opacity-70"
                style={{
                  background:
                    "radial-gradient(circle, rgba(247,182,200,0.6) 0%, rgba(242,107,94,0.3) 50%, transparent 75%)",
                }}
              />

              {/* Packshot Container (Always uncropped, full packaging visible) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeProduct.id}-${activeVariantId}-${isFrontView ? "front" : "back"}`}
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.04 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 h-[300px] w-[300px] sm:h-[380px] sm:w-[380px]"
                >
                  <Image
                    src={isFrontView || !backImg ? frontImg.src : backImg.src}
                    alt={isFrontView || !backImg ? frontImg.alt : `${activeProduct.name} back packaging`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-contain drop-shadow-[0_20px_35px_rgba(39,35,41,0.22)]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* View Flip Switcher (Front / Back Packshot) */}
              {backImg && (
                <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full border border-charcoal/15 bg-white/95 p-1 shadow-md backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => setIsFrontView(true)}
                      className={`rounded-full px-3 py-1 text-xs font-black transition-all cursor-pointer ${
                        isFrontView
                          ? "bg-charcoal text-white shadow-xs"
                          : "text-charcoal/70 hover:text-charcoal"
                      }`}
                    >
                      Front Pack
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFrontView(false)}
                      className={`rounded-full px-3 py-1 text-xs font-black transition-all cursor-pointer ${
                        !isFrontView
                          ? "bg-pink-accent text-charcoal shadow-xs"
                          : "text-charcoal/70 hover:text-charcoal"
                      }`}
                    >
                      Back Info
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT 50%: Product Information & Cart Action */}
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-tea-gold/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-charcoal">
                  <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                  {activeProduct.category === "chai"
                    ? "Authentic Indian Chai"
                    : activeProduct.category === "green-tea"
                    ? "Darjeeling Single-Origin"
                    : "100% Whole Flower"}
                </span>

                <h3 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal leading-tight">
                  {activeProduct.name}
                </h3>
                <p className="mt-1 text-sm sm:text-base font-bold text-coral">
                  {activeProduct.tagline}
                </p>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/75">
                  {activeProduct.description}
                </p>
              </div>

              {/* Verified Taste Profile */}
              <div className="mt-6 flex flex-wrap gap-2">
                {activeProduct.profile.split("·").map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-charcoal/10 bg-warm-ivory px-3 py-1 text-xs font-extrabold text-charcoal/80"
                  >
                    ✦ {p.trim()}
                  </span>
                ))}
              </div>

              {/* Variant Selector */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-charcoal/60">
                  Select Pack Size:
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProduct.variants.map((v) => {
                    const isSel = v.id === activeVariantId;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setActiveVariantId(v.id)}
                        className={`rounded-full px-4 py-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                          isSel
                            ? "border-charcoal bg-charcoal text-white shadow-xs"
                            : "border border-charcoal/15 bg-white text-charcoal hover:border-tea-gold"
                        }`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Price & Conversion Area */}
              <div className="mt-8 pt-6 border-t border-charcoal/10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60">
                      Selling Price
                    </span>
                    <p className="font-display text-2xl sm:text-3xl font-black text-charcoal">
                      {formatINR(currentVariant.price)}
                    </p>
                  </div>

                  {/* Add to Cart / In Cart & Remove Actions */}
                  <div className="flex items-center gap-2">
                    {!isInCart ? (
                      <AddToCartButton
                        product={activeProduct}
                        variant={currentVariant}
                        className="px-6 py-3.5 text-sm"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {/* Stepper */}
                        <div className="flex items-center rounded-full border-2 border-tea-gold bg-warm-ivory p-1 shadow-xs">
                          <button
                            type="button"
                            onClick={() => handleQtyChange((cartItem?.qty || 1) - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-charcoal hover:bg-tea-gold/25 active:scale-95 cursor-pointer"
                          >
                            −
                          </button>
                          <span className="min-w-7 text-center text-sm font-black text-charcoal">
                            {cartItem?.qty || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange((cartItem?.qty || 1) + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-charcoal hover:bg-tea-gold/25 active:scale-95 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={handleRemove}
                          className="flex items-center gap-1.5 rounded-full border border-coral/30 bg-coral/10 px-4 py-2.5 text-xs font-black text-coral transition-colors hover:bg-coral hover:text-white active:scale-95 cursor-pointer"
                          title="Remove item from cart"
                        >
                          <IconTrash className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isInCart && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-extrabold text-tea-gold">
                    <IconCheck className="h-3.5 w-3.5" /> Added to cart • Free doorstep delivery available pan-India
                  </p>
                )}

                {/* Detail Page Link */}
                <div className="mt-5">
                  <Link
                    href={`/products/${activeProduct.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-charcoal hover:text-coral transition-colors"
                  >
                    View Complete Brew Guide & Details <IconArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Best Seller Product Cards Rail ── */}
        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-xl font-black text-charcoal">
              Browse Best Seller Lineup
            </h3>
            <span className="text-xs font-bold text-charcoal/60">
              Hover to reveal back packshot
            </span>
          </div>

          <div
            ref={sliderRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-1"
          >
            {BEST_SELLER_PRODUCTS.map((prod, idx) => (
              <div
                key={prod.id}
                className="w-[280px] sm:w-[310px] shrink-0 snap-start"
              >
                <ProductCard product={prod} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
