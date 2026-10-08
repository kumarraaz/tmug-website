"use client";

import { useState, useEffect, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PRODUCTS, frontImage, getVariant } from "@/data/products";
import type { Product } from "@/types";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import AddToCartButton from "./cart/AddToCartButton";
import { IconArrowRight, IconSparkle, IconClose, IconCheck, IconStar } from "./icons";
import Reveal from "./motion/Reveal";

// Eligible verified products for dynamic/random unboxing
const ELIGIBLE_BOX_IDS = [
  "butterfly-pea",
  "hibiscus",
  "chamomile",
  "lemongrass",
  "gold-tea",
  "darjeeling-green",
];

export default function OpenRevealSection() {
  const reduceMotion = useReducedMotion();
  const { lines, updateQty, removeLine, showToast } = useShop();

  // Eligible products list
  const eligibleProducts: Product[] = ELIGIBLE_BOX_IDS.map(
    (id) => PRODUCTS.find((p) => p.id === id)!
  ).filter(Boolean);

  // Random product initialization on client mount to prevent SSR hydration mismatch
  const [selectedProductId, setSelectedProductId] = useState<string>("butterfly-pea");
  const [hasRandomized, setHasRandomized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  useEffect(() => {
    if (!hasRandomized && eligibleProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * eligibleProducts.length);
      setSelectedProductId(eligibleProducts[randomIndex].id);
      setHasRandomized(true);
    }
  }, [hasRandomized, eligibleProducts.length]);

  const currentProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || eligibleProducts[0] || PRODUCTS[0];
  const currentVariant =
    currentProduct.variants[selectedVariantIdx] || currentProduct.variants[0];
  const packImage = frontImage(currentVariant);

  // Cart status for current variant
  const cartItem = lines.find((l) => l.variantId === currentVariant.id);
  const isInCart = Boolean(cartItem);

  // Shuffle to another random eligible product
  const handleShuffle = () => {
    const others = eligibleProducts.filter((p) => p.id !== selectedProductId);
    if (others.length > 0) {
      const nextProduct = others[Math.floor(Math.random() * others.length)];
      setSelectedProductId(nextProduct.id);
      setSelectedVariantIdx(0);
    }
  };

  const handleSelectTea = (id: string) => {
    setSelectedProductId(id);
    setSelectedVariantIdx(0);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleQtyChange = (qty: number) => {
    if (qty <= 0) {
      removeLine(currentVariant.id);
      showToast(`${currentProduct.name} removed from cart`);
    } else {
      updateQty(currentVariant.id, qty);
    }
  };

  return (
    <section
      id="open-reveal"
      aria-label="TMUG Interactive Box Reveal"
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF7EF] via-[#FBE7DC]/60 to-[#FFF7EF] py-10 sm:py-14"
    >
      {/* ── Background Vibrant Decorative Gradients & Stickers ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#FAA4B5]/25 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#FFF183]/30 blur-3xl" />
        <div className="absolute left-1/3 bottom-10 h-72 w-72 rounded-full bg-[#70C1E1]/20 blur-3xl" />
        
        {/* Playful TMUG stickers */}
        <div className="absolute left-[6%] top-[12%] w-10 sm:w-14 opacity-75 animate-float-slow">
          <Image
            src="/assets/stickers/flower-doodle.svg"
            alt=""
            width={52}
            height={52}
            className="object-contain"
          />
        </div>
        <div className="absolute right-[8%] top-[18%] w-11 sm:w-16 opacity-75 animate-float">
          <Image
            src="/assets/stickers/badge-natural.svg"
            alt=""
            width={60}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="absolute right-[10%] bottom-[12%] w-10 sm:w-12 opacity-65 animate-bob">
          <Image
            src="/assets/stickers/tea-leaf.svg"
            alt=""
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#F8B77C] bg-white/90 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#33243A] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#FAA4B5] animate-ping" />
              Interactive Product Unboxing
            </span>
            <h2 className="text-section mt-2 font-display font-black text-[#33243A]">
              Open Your <span className="text-[#FAA4B5]">TMUG Box</span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#3A3438]/80 max-w-lg mx-auto">
              Tap the collector’s box to pop open whole botanicals and single-origin leaves sealed at origin for your daily ritual.
            </p>
          </Reveal>
        </div>

        {/* Dynamic Tea Selector Chips with Surprise Me Shuffle */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {eligibleProducts.map((tea) => {
            const isSelected = tea.id === selectedProductId;
            return (
              <button
                key={tea.id}
                type="button"
                onClick={() => handleSelectTea(tea.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#33243A] text-white shadow-md ring-2 ring-[#FFF183] scale-105"
                    : "border border-[#3A3438]/15 bg-white/90 text-[#33243A] hover:border-[#FAA4B5] hover:bg-[#FAA4B5]/10"
                }`}
              >
                <span>{tea.name.split(" ")[0]}</span>
                {isSelected && <span className="text-[#FFF183]">✦</span>}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleShuffle}
            title="Randomize product"
            className="flex items-center gap-1.5 rounded-full border border-[#70C1E1] bg-[#70C1E1]/15 px-3.5 py-1.5 text-xs font-black text-[#33243A] hover:bg-[#70C1E1]/30 transition-all cursor-pointer"
          >
            <span>🎲 Surprise Blend</span>
          </button>
        </div>

        {/* ── TMUG Box Stage (Unopened State) ── */}
        <div className="relative mx-auto mt-8 max-w-2xl overflow-hidden rounded-[2.2rem] border border-[#3A3438]/15 bg-gradient-to-br from-white via-[#FBE7DC]/70 to-[#FFF183]/30 p-6 sm:p-10 shadow-[0_30px_70px_-20px_rgba(51,36,58,0.22)]">
          {/* Subtle Stage Highlights */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FAA4B5]/30 blur-2xl" />
            <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#70C1E1]/25 blur-2xl" />
          </div>

          <div className="relative flex flex-col items-center text-center">
            {/* Box Preview Artwork with Floating Pack Preview */}
            <div
              onClick={handleOpen}
              className="group relative h-64 sm:h-72 w-full max-w-sm cursor-pointer select-none"
              title="Click to open TMUG box"
            >
              {/* Product subtly peeking above box */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-x-0 top-2 z-10 flex justify-center"
              >
                <div className="relative h-40 w-40 sm:h-44 sm:w-44 drop-shadow-[0_20px_25px_rgba(51,36,58,0.25)] transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={packImage.src}
                    alt={currentProduct.name}
                    fill
                    sizes="200px"
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* 3D TMUG Box Body */}
              <div className="absolute inset-x-4 bottom-0 z-20 flex h-36 sm:h-40 flex-col items-center justify-center rounded-2xl border-2 border-[#F8B77C] bg-gradient-to-b from-[#33243A] via-[#2A1D30] to-[#1E1424] p-4 text-white shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="absolute inset-x-0 -top-2.5 h-5 rounded-t-xl border-t border-[#FFF183]/80 bg-[#422F4C] shadow-md" />
                <span className="font-display text-[10px] font-black uppercase tracking-[0.25em] text-[#FFF183]">
                  TMUG COLLECTOR&apos;S BOX
                </span>
                <h3 className="mt-0.5 font-display text-lg sm:text-xl font-black text-white">
                  {currentProduct.name}
                </h3>
                <p className="mt-1 text-[11px] font-semibold text-[#F8B77C]">
                  ✦ Tap here to pop open &amp; reveal ✦
                </p>
              </div>
            </div>

            {/* Prominent Call to Action Button */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpen}
                className="inline-flex items-center gap-2 rounded-full bg-[#FAA4B5] hover:bg-[#F8B77C] px-8 py-3.5 text-sm font-black text-[#33243A] shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-white"
              >
                <IconSparkle className="h-4 w-4" /> OPEN TMUG BOX
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL-SCREEN / LARGE VIEWPORT POP-UP PRODUCT REVEAL MODAL ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={`${currentProduct.name} Unboxed Experience`}
          >
            {/* Modal Stage Container */}
            <motion.div
              initial={{ scale: 0.82, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 16, opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0.2 : 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] border-2 border-white/40 bg-gradient-to-br from-[#FFF7EF] via-[#FBE7DC] to-[#FFF183]/40 p-5 sm:p-8 md:p-10 shadow-[0_35px_90px_-20px_rgba(0,0,0,0.5)] my-auto"
            >
              {/* Vibrant Decorative Ambiance Blobs (Palette: #FAA4B5, #F8B77C, #FFF183, #70C1E1) */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#FAA4B5]/35 blur-3xl" />
                <div className="absolute top-1/2 -right-20 h-80 w-80 rounded-full bg-[#70C1E1]/30 blur-3xl" />
                <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-[#FFF183]/40 blur-3xl" />
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close unboxed reveal"
                className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#3A3438]/20 bg-white/90 text-[#33243A] shadow-md transition-all hover:bg-[#FAA4B5] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <IconClose className="h-5 w-5" />
              </button>

              {/* Reveal Grid: Left Product (45-65% Viewport Height), Right Details & Actions */}
              <div className="relative grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
                {/* ── LEFT: DRAMATIC PRODUCT POP-UP (45-65% vh, object-fit contain, transparent PNG) ── */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.82, y: 24, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{
                      duration: reduceMotion ? 0.2 : 0.6,
                      delay: 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative flex items-center justify-center w-full h-[45vh] sm:h-[55vh] max-h-[500px] min-h-[300px]"
                  >
                    {/* Soft ambient product aura */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute h-64 w-64 sm:h-80 sm:w-80 rounded-full blur-3xl opacity-75"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(250,164,181,0.6) 0%, rgba(248,183,124,0.4) 45%, rgba(112,193,225,0.2) 75%, transparent 100%)",
                      }}
                    />

                    {/* Sharp foreground product packshot */}
                    <div className="relative h-full w-full max-w-[420px]">
                      <Image
                        src={packImage.src}
                        alt={packImage.alt}
                        fill
                        priority
                        sizes="(max-width: 1024px) 80vw, 45vw"
                        className="object-contain drop-shadow-[0_25px_40px_rgba(51,36,58,0.35)]"
                      />
                    </div>
                  </motion.div>

                  {/* Pack / Size Toggle */}
                  {currentProduct.variants.length > 1 && (
                    <div className="mt-3 flex items-center gap-2 rounded-full border border-[#3A3438]/15 bg-white/90 p-1 shadow-xs">
                      {currentProduct.variants.map((v, i) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantIdx(i)}
                          className={`rounded-full px-3 py-1 text-xs font-black transition-all cursor-pointer ${
                            selectedVariantIdx === i
                              ? "bg-[#33243A] text-white shadow-xs"
                              : "text-[#33243A]/70 hover:text-[#33243A]"
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── RIGHT: VERIFIED PRODUCT DETAILS & REAL CART ACTION ── */}
                <div className="lg:col-span-6 flex flex-col justify-center text-left">
                  {/* Category & Verified Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF183] border border-[#F8B77C] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#33243A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FAA4B5]" />
                      {currentProduct.category === "chai"
                        ? "Kadak Assam CTC Blend"
                        : currentProduct.category === "green-tea"
                        ? "Darjeeling Single-Origin"
                        : "100% Whole Flower"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-[#3A3438]/15 px-2.5 py-1 text-[11px] font-bold text-[#33243A]">
                      <IconStar className="h-3 w-3 fill-[#F8B77C] text-[#F8B77C]" /> Verified Blend
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#33243A] leading-tight">
                    {currentProduct.name}
                  </h3>

                  <p className="mt-1 text-sm font-extrabold text-[#FAA4B5]">
                    {currentProduct.tagline}
                  </p>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#3A3438]/85">
                    {currentProduct.description}
                  </p>

                  {/* Verified Taste Profile */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {currentProduct.profile.split("·").map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#3A3438]/10 bg-white/90 px-3 py-0.5 text-[11px] font-extrabold text-[#33243A]"
                      >
                        ✦ {tag.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Price & Real Cart Action Area */}
                  <div className="mt-6 pt-5 border-t border-[#3A3438]/15">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A3438]/60">
                          Verified Price
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-2xl sm:text-3xl font-black text-[#33243A]">
                            {formatINR(currentVariant.price)}
                          </span>
                          <span className="text-xs font-bold text-[#3A3438]/50 line-through">
                            {formatINR(currentVariant.price + 30)}
                          </span>
                        </div>
                      </div>

                      {/* Real Add to Cart / In-Cart Quantity Stepper */}
                      <div className="flex items-center gap-2">
                        {!isInCart ? (
                          <AddToCartButton
                            product={currentProduct}
                            variant={currentVariant}
                            className="bg-[#FAA4B5] hover:bg-[#F8B77C] text-[#33243A] px-7 py-3 text-sm font-black shadow-md rounded-full ring-2 ring-white"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-full border-2 border-[#F8B77C] bg-white p-1 shadow-xs">
                              <button
                                type="button"
                                onClick={() => handleQtyChange((cartItem?.qty || 1) - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-[#33243A] hover:bg-[#FFF183] active:scale-95 cursor-pointer"
                              >
                                −
                              </button>
                              <span className="min-w-7 text-center text-sm font-black text-[#33243A]">
                                {cartItem?.qty || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange((cartItem?.qty || 1) + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-[#33243A] hover:bg-[#FFF183] active:scale-95 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs font-black text-[#33243A]">In Cart ✓</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Secondary Navigation Actions */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleShuffle}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#33243A] hover:text-[#FAA4B5] transition-colors cursor-pointer"
                      >
                        <span>🎲 Reveal Another Blend</span>
                      </button>

                      <Link
                        href={`/products/${currentProduct.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-black text-[#33243A] hover:text-[#FAA4B5] transition-colors"
                      >
                        Full Product Details <IconArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
