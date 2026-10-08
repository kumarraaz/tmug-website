"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PRODUCTS, frontImage } from "@/data/products";
import { useShop } from "@/lib/store";
import AddToCartButton from "./cart/AddToCartButton";
import { IconArrowRight, IconSparkle, IconCheck } from "./icons";
import Reveal from "./motion/Reveal";

// Botanical Petal SVG Component for product-specific flower shower
function BotanicalPetal({
  type,
  className = "",
  style,
}: {
  type: "blue-pea" | "hibiscus" | "chamomile" | "tea-leaf";
  className?: string;
  style?: React.CSSProperties;
}) {
  if (type === "blue-pea") {
    return (
      <svg
        viewBox="0 0 32 32"
        className={`pointer-events-none drop-shadow-sm ${className}`}
        style={style}
        aria-hidden="true"
      >
        <path
          d="M 16 3 C 25 3, 30 13, 25 23 C 21 31, 11 31, 7 23 C 2 13, 7 3, 16 3 Z"
          fill="#4A6FD4"
          opacity="0.85"
        />
        <circle cx="16" cy="18" r="3" fill="#F4B400" />
      </svg>
    );
  }
  if (type === "hibiscus") {
    return (
      <svg
        viewBox="0 0 32 32"
        className={`pointer-events-none drop-shadow-sm ${className}`}
        style={style}
        aria-hidden="true"
      >
        <path
          d="M 16 4 C 23 4, 28 11, 26 20 C 24 28, 14 29, 8 22 C 3 15, 8 4, 16 4 Z"
          fill="#F26B5E"
          opacity="0.88"
        />
        <circle cx="16" cy="16" r="2.5" fill="#D9A441" />
      </svg>
    );
  }
  if (type === "chamomile") {
    return (
      <svg
        viewBox="0 0 30 30"
        className={`pointer-events-none drop-shadow-sm ${className}`}
        style={style}
        aria-hidden="true"
      >
        <g fill="#FFFDF7" stroke="#D9A441" strokeWidth="1">
          <ellipse cx="15" cy="7" rx="3.5" ry="6" />
          <ellipse cx="15" cy="7" rx="3.5" ry="6" transform="rotate(60 15 15)" />
          <ellipse cx="15" cy="7" rx="3.5" ry="6" transform="rotate(120 15 15)" />
          <ellipse cx="15" cy="7" rx="3.5" ry="6" transform="rotate(180 15 15)" />
          <ellipse cx="15" cy="7" rx="3.5" ry="6" transform="rotate(240 15 15)" />
          <ellipse cx="15" cy="7" rx="3.5" ry="6" transform="rotate(300 15 15)" />
        </g>
        <circle cx="15" cy="15" r="4" fill="#F4B400" />
      </svg>
    );
  }
  // tea-leaf
  return (
    <svg
      viewBox="0 0 32 20"
      className={`pointer-events-none drop-shadow-sm ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M 2 10 C 12 2, 22 2, 30 10 C 22 18, 12 18, 2 10 Z"
        fill="#D9A441"
        opacity="0.85"
      />
    </svg>
  );
}

// 4 Interactive Tea Ritual Options
const RITUAL_TEAS = [
  {
    id: "butterfly-pea",
    name: "Butterfly Pea Flower",
    petalType: "blue-pea" as const,
    color: "#4A6FD4",
    emoji: "🦋",
    tagline: "Turns Sapphire Blue & Violet with Citrus",
    thankYou: "🍵 Pure Aparajita flowers • Thank you for choosing a colourful ritual!",
  },
  {
    id: "hibiscus",
    name: "Hibiscus Flower",
    petalType: "hibiscus" as const,
    color: "#F26B5E",
    emoji: "🌺",
    tagline: "Tangy ruby-red brew packed with natural botanicals",
    thankYou: "✨ Whole Gudhal petals • Thank you for sipping pure wellness!",
  },
  {
    id: "chamomile",
    name: "Chamomile Flower",
    petalType: "chamomile" as const,
    color: "#D9A441",
    emoji: "🌼",
    tagline: "Gentle calming evening brew with sweet honey notes",
    thankYou: "🙏 Gentle Babune ke Phool • Thank you for taking a calm pause!",
  },
  {
    id: "gold-tea",
    name: "Assam Gold Tea",
    petalType: "tea-leaf" as const,
    color: "#D9A441",
    emoji: "☕",
    tagline: "Malty Assam CTC & Orthodox blend for proper kadak chai",
    thankYou: "🔥 Bold morning kadak chai • Thank you for brewing authentic TMUG!",
  },
];

export default function OpenRevealSection() {
  const [selectedTeaId, setSelectedTeaId] = useState("butterfly-pea");
  const [isOpen, setIsOpen] = useState(false);
  const [showShower, setShowShower] = useState(false);
  const reduceMotion = useReducedMotion();
  const showerTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTea = RITUAL_TEAS.find((t) => t.id === selectedTeaId) || RITUAL_TEAS[0];
  const productData = PRODUCTS.find((p) => p.id === selectedTeaId) || PRODUCTS[0];
  const variant = productData.variants[0];
  const packImage = frontImage(variant);

  // Trigger open action with realistic flower shower and emoji feedback
  const handleOpenBox = () => {
    setIsOpen(true);
    setShowShower(true);

    if (showerTimerRef.current) clearTimeout(showerTimerRef.current);
    // Flower shower is short (2.8s) so it doesn't block the screen
    showerTimerRef.current = setTimeout(() => {
      setShowShower(false);
    }, 2800);
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setShowShower(false);
    } else {
      handleOpenBox();
    }
  };

  const handleSelectTea = (teaId: string) => {
    setSelectedTeaId(teaId);
    handleOpenBox();
  };

  useEffect(() => {
    return () => {
      if (showerTimerRef.current) clearTimeout(showerTimerRef.current);
    };
  }, []);

  return (
    <section
      id="open-reveal"
      aria-label="TMUG Interactive Box Reveal"
      className="relative overflow-hidden bg-warm-ivory py-8 sm:py-12"
    >
      {/* Background Botanical Pattern & Subtle Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tea-gold/10 blur-3xl" />
        <div className="absolute left-[8%] top-[12%] w-10 sm:w-12 opacity-60 animate-float-slow">
          <Image
            src="/assets/stickers/flower-doodle.svg"
            alt=""
            width={44}
            height={44}
            className="object-contain"
          />
        </div>
        <div className="absolute right-[8%] bottom-[14%] w-10 sm:w-12 opacity-60 animate-float">
          <Image
            src="/assets/stickers/tea-leaf.svg"
            alt=""
            width={44}
            height={44}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-tea-gold/40 bg-white/90 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-charcoal shadow-xs">
              <span className="h-2 w-2 rounded-full bg-coral animate-ping" />
              The TMUG Reveal Experience
            </span>
            <h2 className="text-section mt-2 font-display font-black text-charcoal">
              Open Your <span className="text-coral">Tea Ritual</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-charcoal/70">
              Tap to open the TMUG collector’s box and reveal whole botanical flowers and single-origin leaves blooming fresh for your cup.
            </p>
          </Reveal>
        </div>

        {/* Tea Selection Pills */}
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2">
          {RITUAL_TEAS.map((tea) => {
            const isSelected = tea.id === selectedTeaId;
            return (
              <button
                key={tea.id}
                type="button"
                onClick={() => handleSelectTea(tea.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-charcoal text-white shadow-md ring-2 ring-tea-gold scale-105"
                    : "border border-charcoal/15 bg-white text-charcoal hover:border-tea-gold hover:text-coral"
                }`}
              >
                <span>{tea.emoji}</span>
                <span>{tea.name}</span>
              </button>
            );
          })}
        </div>

        {/* ── 3D TMUG Collector's Box Stage ── */}
        <div className="relative mx-auto mt-6 sm:mt-8 max-w-3xl overflow-hidden rounded-[2rem] border border-charcoal/10 bg-gradient-to-b from-white via-warm-surface/50 to-warm-ivory p-5 sm:p-8 shadow-[0_25px_60px_-20px_rgba(39,35,41,0.18)]">
          {/* Subtle Short Flower Shower (tasteful, non-blocking) */}
          <AnimatePresence>
            {showShower && !reduceMotion && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`petal-${i}`}
                    initial={{
                      x: `${15 + (i * 7)}%`,
                      y: -20,
                      rotate: 0,
                      opacity: 0,
                      scale: 0.6,
                    }}
                    animate={{
                      y: [0, 240 + (i % 4) * 40],
                      rotate: [0, 180 + i * 30],
                      opacity: [0, 1, 1, 0],
                      scale: [0.6, 1, 0.9],
                    }}
                    transition={{
                      duration: 2.4,
                      delay: i * 0.12,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="absolute"
                  >
                    <BotanicalPetal
                      type={selectedTea.petalType}
                      className="h-6 w-6 sm:h-8 sm:w-8"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Interactive Stage Composition */}
          <div className="relative flex flex-col items-center text-center">
            {/* Box & Rising Product Presentation */}
            <div
              onClick={handleToggle}
              className="group relative h-64 sm:h-76 w-full max-w-sm cursor-pointer select-none"
              title={isOpen ? "Click to close box" : "Click to open box"}
            >
              {/* Product Packshot rising out when OPEN */}
              <motion.div
                animate={{
                  y: isOpen ? -45 : 10,
                  scale: isOpen ? 1.08 : 0.88,
                  opacity: isOpen ? 1 : 0.4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 20,
                }}
                className="absolute inset-x-0 top-0 z-10 flex justify-center"
              >
                <div className="relative h-44 w-44 sm:h-52 sm:w-52 drop-shadow-[0_20px_30px_rgba(39,35,41,0.3)]">
                  <Image
                    src={packImage.src}
                    alt={packImage.alt}
                    fill
                    sizes="200px"
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* 3D TMUG Box Body Container */}
              <div className="absolute inset-x-8 bottom-0 z-20 flex h-36 sm:h-40 flex-col items-center justify-center rounded-2xl border-2 border-tea-gold/60 bg-gradient-to-b from-[#33243A] via-[#272329] to-[#1E1B20] p-4 text-white shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                {/* 3D Box Lid (Hinges back when open) */}
                <motion.div
                  animate={{
                    rotateX: isOpen ? -65 : 0,
                    y: isOpen ? -8 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "top center" }}
                  className="absolute inset-x-0 -top-3 h-6 rounded-t-xl border-t border-tea-gold/70 bg-[#3D2C45] shadow-md"
                />

                {/* Box Gold Brand Embellishment */}
                <div className="relative text-center">
                  <span className="font-display text-[10px] font-black uppercase tracking-[0.25em] text-tea-gold">
                    TMUG RITUAL BOX
                  </span>
                  <h4 className="mt-0.5 font-display text-lg sm:text-xl font-black text-white">
                    {selectedTea.name}
                  </h4>
                  <p className="mt-1 text-[11px] font-semibold text-warm-ivory/70">
                    {isOpen ? "Tap box to close" : "✦ Tap here to open & unbox ✦"}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Feedback & Thank-You Emoji Badge */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mt-6 flex flex-col items-center"
                >
                  {/* Subtle Thank-You & Appreciation Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-tea-gold/50 bg-warm-ivory px-4 sm:px-5 py-2 text-xs sm:text-sm font-black text-charcoal shadow-sm">
                    <span>{selectedTea.thankYou}</span>
                  </div>

                  <p className="mt-2 text-xs font-bold text-charcoal/70">
                    {selectedTea.tagline}
                  </p>

                  {/* Immediate Action Buttons */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <AddToCartButton
                      product={productData}
                      variant={variant}
                      className="px-6 py-3 text-xs sm:text-sm shadow-md"
                    />
                    <Link
                      href={`/products/${productData.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/20 bg-white px-5 py-3 text-xs sm:text-sm font-black text-charcoal transition-all hover:border-tea-gold hover:bg-tea-gold hover:text-charcoal"
                    >
                      View Details <IconArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isOpen && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleOpenBox}
                  className="inline-flex items-center gap-2 rounded-full bg-tea-gold px-7 py-3 text-sm font-black text-charcoal shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <IconSparkle className="h-4 w-4" /> Open TMUG Box
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
