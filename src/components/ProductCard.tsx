"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import { frontImage, getVariant } from "@/data/products";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconArrowRight, IconStar, IconCheck, IconTrash } from "./icons";
import AddToCartButton from "./cart/AddToCartButton";

/** Small pill selector for product variants (weight/pack). */
export function VariantSelector({
  product,
  selectedId,
  onChange,
  small = false,
}: {
  product: Product;
  selectedId: string;
  onChange: (variantId: string) => void;
  small?: boolean;
}) {
  if (product.variants.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Choose a pack for ${product.name}`}>
      {product.variants.map((v) => {
        const selected = v.id === selectedId;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onChange(v.id);
            }}
            className={`rounded-full border font-bold transition-all duration-200 cursor-pointer ${
              small ? "px-2.5 py-1 text-[11px]" : "px-4 py-2 text-sm"
            } ${
              selected
                ? "border-charcoal bg-charcoal text-white shadow-xs"
                : "border-charcoal/15 bg-white/80 text-charcoal hover:border-tea-gold hover:bg-white"
            }`}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}

/** Stepper for quantity selection (used in modals and details). */
export function QuantitySelector({
  qty,
  onChange,
  min = 1,
  max = 99,
  small = false,
}: {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  small?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-charcoal/20 bg-white ${
        small ? "p-0.5" : "p-1"
      }`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={qty <= min}
        onClick={() => onChange(Math.max(min, qty - 1))}
        className={`flex items-center justify-center rounded-full font-bold text-charcoal hover:bg-cream-warm disabled:opacity-40 cursor-pointer ${
          small ? "h-6 w-6 text-xs" : "h-8 w-8 text-base"
        }`}
      >
        −
      </button>
      <span className={`text-center font-bold text-charcoal ${small ? "w-6 text-xs" : "w-8 text-sm"}`}>
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={qty >= max}
        onClick={() => onChange(Math.min(max, qty + 1))}
        className={`flex items-center justify-center rounded-full font-bold text-charcoal hover:bg-cream-warm disabled:opacity-40 cursor-pointer ${
          small ? "h-6 w-6 text-xs" : "h-8 w-8 text-base"
        }`}
      >
        +
      </button>
    </div>
  );
}

/**
 * Premium D2C Product Card with:
 * - Wavy organic liquid hover reveal
 * - Soft light pink (#F7B6C8) / coral (#F26B5E) Gen-Z glow
 * - Authentic back-side packaging reveal
 * - Mobile tap-to-reveal toggle
 * - Direct Add to Cart + In Cart quantity controls & Remove option
 * - Full unclipped packaging presentation
 */
export default function ProductCard({
  product,
  index = 0,
  className = "",
}: {
  product: Product;
  index?: number;
  className?: string;
}) {
  const { lines, updateQty, removeLine, showToast } = useShop();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const variant = getVariant(product, variantId);
  const front = frontImage(variant);
  const back = variant.images.find((i) => i.kind === "back");

  // Check if current variant is already in cart
  const cartItem = lines.find((l) => l.variantId === variant.id);
  const isInCart = Boolean(cartItem);


  // Mobile tap reveal toggle state
  const [isMobileFlipped, setIsMobileFlipped] = useState(false);

  // Hover states & motion values
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const wtx = useMotionValue(0);
  const wty = useMotionValue(0);
  const wrt = useMotionValue(0);
  const wavySpring = { stiffness: 220, damping: 18, mass: 0.5 };
  const wsx = useSpring(wtx, wavySpring);
  const wsy = useSpring(wty, wavySpring);
  const wsr = useSpring(wrt, wavySpring);

  const handleWavyMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    wtx.set(nx * 14);
    wty.set(ny * 14);
    wrt.set(nx * 6);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    wtx.set(0);
    wty.set(0);
    wrt.set(0);
  };

  const handleMobileCardClick = (e: React.MouseEvent) => {
    // On touch devices without hover, toggle flip
    if (window.matchMedia("(hover: none)").matches && back) {
      // Don't intercept button or link clicks
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) return;
      setIsMobileFlipped((prev) => !prev);
    }
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeLine(variant.id);
    showToast(`${product.name} removed from cart`);
  };

  const handleQtyChange = (e: React.MouseEvent, newQty: number) => {
    e.stopPropagation();
    if (newQty <= 0) {
      removeLine(variant.id);
      showToast(`${product.name} removed from cart`);
    } else {
      updateQty(variant.id, newQty);
    }
  };

  const showBack = (isHovered || isMobileFlipped) && Boolean(back);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleWavyMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMobileCardClick}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-charcoal/10 bg-white shadow-[0_10px_28px_-16px_rgba(39,35,41,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_-16px_rgba(39,35,41,0.25)] hover:border-tea-gold/50 ${className}`}
    >
      {/* ── Product Packshot Frame with Wavy Reveal & Soft Pink Glow ── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-warm-surface/70">
        {/* Luminous Gen-Z Pink / Coral Glow (animates on hover/reveal) */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            showBack ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at center, rgba(247,182,200,0.5) 0%, rgba(242,107,94,0.2) 48%, transparent 72%)",
          }}
        />

        {/* Wavy organic liquid highlight overlay */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-2 transition-transform duration-700 ease-out ${
            showBack ? "scale-105 opacity-80" : "scale-95 opacity-0"
          }`}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full opacity-35" preserveAspectRatio="none">
            <path
              d="M 40 10 C 90 2, 130 18, 170 12 C 190 40, 195 90, 180 140 C 160 180, 110 195, 60 185 C 20 170, 5 120, 15 65 Z"
              fill="#F7B6C8"
            />
          </svg>
        </div>

        {/* Wavy Spring Packshot Stage */}
        <motion.div
          aria-hidden="true"
          style={{ x: wsx, y: wsy, rotate: wsr }}
          animate={{ scale: isHovered && !reduceMotion ? 1.04 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center p-3 sm:p-4"
        >
        {/* Packaging Container — Always full pack, object-contain, never cropped */}
        <div className="relative h-full w-full">
          {/* Front Image */}
          <Image
              src={front.src}
              alt={front.alt}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 24vw"
              loading="lazy"
              className={`object-contain transition-all duration-500 ease-out ${
                showBack
                  ? "opacity-0 scale-95 blur-[1px]"
                  : "opacity-100 scale-100 blur-0"
              }`}
            />

            {/* Back-Side Image with Organic Liquid Water-Wave Reveal */}
            {back && (
              <div
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  showBack ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div
                  className={`relative h-full w-full ${
                    showBack && !reduceMotion
                      ? "animate-[tmugWave_3.5s_ease-in-out_infinite]"
                      : ""
                  }`}
                >
                  <Image
                    src={back.src}
                    alt={`Back view of ${product.name} packaging`}
                    fill
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 24vw"
                    loading="lazy"
                    className="object-contain"
                  />
                  {/* Subtle Blush Pink (#F6B6C8) & Coral (#F36F6F) liquid glow highlight */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pink-accent/25 via-coral/15 to-transparent mix-blend-soft-light"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>


        {/* Subtle Badge Tags */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {product.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-tea-gold px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-charcoal shadow-xs">
              <IconStar className="h-2.5 w-2.5 fill-charcoal" /> Bestseller
            </span>
          )}
          {showBack && (
            <span className="inline-block rounded-full bg-pink-accent/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-charcoal shadow-xs backdrop-blur-xs">
              Back View
            </span>
          )}
        </div>

        {/* Mobile tap flip hint pill (visible only on touch devices with back images) */}
        {back && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileFlipped((prev) => !prev);
            }}
            aria-label={isMobileFlipped ? "Show front packaging" : "Reveal back packaging"}
            className="absolute bottom-2.5 right-2.5 z-20 flex sm:hidden items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-charcoal shadow-xs backdrop-blur-xs active:bg-tea-gold"
          >
            🔄 {isMobileFlipped ? "Front" : "Flip"}
          </button>
        )}

        {/* Direct Link to product detail page */}
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">View {product.name}</span>
        </Link>
      </div>

      {/* ── Product Card Body ── */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Category Profile & Title */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-coral">
            {product.profile.split("·")[0]?.trim()}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="block font-display text-[16px] sm:text-[17px] font-bold leading-snug text-charcoal transition-colors hover:text-coral"
          >
            {product.name}
          </Link>
          <p className="text-[11px] font-bold text-charcoal/60">
            {variant.label}
          </p>
        </div>

        {/* Variant Selector Pills */}
        <VariantSelector product={product} selectedId={variantId} onChange={setVariantId} small />

        {/* Price & Add to Cart / In Cart Controls */}
        <div className="mt-auto pt-2 border-t border-charcoal/8">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-display text-lg font-black text-charcoal">
                {formatINR(variant.price)}
              </p>
            </div>

            {/* Cart Interactive Actions */}
            {!isInCart ? (
              <AddToCartButton
                product={product}
                variant={variant}
                className="px-3.5 py-2 text-xs"
              />
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Quantity Stepper */}
                <div className="flex items-center rounded-full border border-tea-gold bg-warm-ivory p-0.5 shadow-xs">
                  <button
                    type="button"
                    onClick={(e) => handleQtyChange(e, (cartItem?.qty || 1) - 1)}
                    aria-label="Decrease quantity"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-charcoal hover:bg-tea-gold/20 active:scale-95 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="min-w-5 text-center text-xs font-black text-charcoal">
                    {cartItem?.qty || 1}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleQtyChange(e, (cartItem?.qty || 1) + 1)}
                    aria-label="Increase quantity"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-charcoal hover:bg-tea-gold/20 active:scale-95 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Remove from Cart Button */}
                <button
                  type="button"
                  onClick={handleRemoveFromCart}
                  aria-label={`Remove ${product.name} from cart`}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-coral transition-colors hover:bg-coral hover:text-white active:scale-95 cursor-pointer"
                  title="Remove from cart"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* In Cart Confirmation Note */}
          {isInCart && (
            <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-tea-gold">
              <IconCheck className="h-3 w-3" /> In your cart •{" "}
              <button
                type="button"
                onClick={handleRemoveFromCart}
                className="underline hover:text-coral cursor-pointer"
              >
                Remove
              </button>
            </p>
          )}

          {/* Details Link */}
          <div className="mt-2 text-right">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-charcoal/70 transition-colors hover:text-coral"
            >
              View details <IconArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
