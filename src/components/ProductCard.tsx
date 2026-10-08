"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
              small ? "px-2.5 py-0.5 text-[11px]" : "px-4 py-2 text-sm"
            } ${
              selected
                ? "border-[#33243A] bg-[#33243A] text-white shadow-xs"
                : "border-[#3A3438]/15 bg-white/90 text-[#33243A] hover:border-[#FAA4B5] hover:bg-[#FAA4B5]/10"
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
      className={`inline-flex items-center rounded-full border border-[#3A3438]/20 bg-white ${
        small ? "p-0.5" : "p-1"
      }`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={qty <= min}
        onClick={() => onChange(Math.max(min, qty - 1))}
        className={`flex items-center justify-center rounded-full font-bold text-[#33243A] hover:bg-[#FFF7EF] disabled:opacity-40 cursor-pointer ${
          small ? "h-6 w-6 text-xs" : "h-8 w-8 text-base"
        }`}
      >
        −
      </button>
      <span className={`text-center font-bold text-[#33243A] ${small ? "w-6 text-xs" : "w-8 text-sm"}`}>
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={qty >= max}
        onClick={() => onChange(Math.min(max, qty + 1))}
        className={`flex items-center justify-center rounded-full font-bold text-[#33243A] hover:bg-[#FFF7EF] disabled:opacity-40 cursor-pointer ${
          small ? "h-6 w-6 text-xs" : "h-8 w-8 text-base"
        }`}
      >
        +
      </button>
    </div>
  );
}

/**
 * Premium D2C Product Card:
 * - Subtle Gen-Z hover glow & micro-lift
 * - Transparent PNG cutouts with object-fit: contain (no cropping/pixelation)
 * - Zero water-wave distortion
 * - Authentic packaging reveal with smooth cross-fade
 * - Direct Add to Cart + live quantity controls & remove action
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

  // Cart status
  const cartItem = lines.find((l) => l.variantId === variant.id);
  const isInCart = Boolean(cartItem);

  // Hover & mobile flip state
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileFlipped, setIsMobileFlipped] = useState(false);

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
      transition={{ duration: 0.45, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#3A3438]/10 bg-white shadow-[0_8px_24px_-12px_rgba(51,36,58,0.14)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-14px_rgba(51,36,58,0.22)] hover:border-[#FAA4B5]/60 ${className}`}
    >
      {/* ── Product Packshot Frame with Soft Gen-Z Glow ── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-[#FFF7EF] to-[#FBE7DC]/60">
        {/* Soft Gen-Z Cherry Blossom & Maize glow behind the product on hover */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at center, rgba(250,164,181,0.45) 0%, rgba(255,241,131,0.25) 50%, transparent 75%)",
          }}
        />

        {/* Foreground Packshot Container — 100% sharp, object-fit contain, never cropped */}
        <div className="relative h-full w-full p-4 flex items-center justify-center">
          {/* Front packshot cutout */}
          <div
            className={`relative h-full w-full transition-transform duration-500 ease-out ${
              isHovered && !reduceMotion ? "scale-105" : "scale-100"
            }`}
          >
            <Image
              src={front.src}
              alt={front.alt}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 24vw"
              loading="lazy"
              className={`object-contain transition-all duration-500 ease-out ${
                showBack
                  ? "opacity-0 scale-95"
                  : "opacity-100 scale-100"
              }`}
            />

            {/* Back packshot view — smooth fade, no wave distortions */}
            {back && (
              <div
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  showBack ? "opacity-100" : "opacity-0 pointer-events-none"
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
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {product.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF183] border border-[#F8B77C] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#33243A] shadow-xs">
              <IconStar className="h-2.5 w-2.5 fill-[#33243A]" /> Bestseller
            </span>
          )}
          {showBack && (
            <span className="inline-block rounded-full bg-[#FAA4B5] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#33243A] shadow-xs">
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
            className="absolute bottom-2.5 right-2.5 z-20 flex sm:hidden items-center gap-1 rounded-full bg-white/90 border border-[#3A3438]/15 px-2.5 py-1 text-[10px] font-extrabold text-[#33243A] shadow-xs active:bg-[#FFF183]"
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
      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
        {/* Category Profile & Title */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FAA4B5]">
            {product.category === "chai"
              ? "Assam Chai"
              : product.category === "green-tea"
              ? "Darjeeling"
              : "Botanical"}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="block font-display text-[15px] sm:text-[16px] font-black leading-snug text-[#33243A] transition-colors hover:text-[#FAA4B5]"
          >
            {product.name}
          </Link>
          <p className="text-[11px] font-semibold text-[#3A3438]/60">
            {variant.label}
          </p>
        </div>

        {/* Variant Selector Pills */}
        <VariantSelector product={product} selectedId={variantId} onChange={setVariantId} small />

        {/* Price & Add to Cart / In Cart Controls */}
        <div className="mt-auto pt-2.5 border-t border-[#3A3438]/10">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-display text-base sm:text-lg font-black text-[#33243A]">
                {formatINR(variant.price)}
              </p>
            </div>

            {/* Cart Interactive Actions */}
            {!isInCart ? (
              <AddToCartButton
                product={product}
                variant={variant}
                className="bg-[#FAA4B5] hover:bg-[#F8B77C] text-[#33243A] px-3.5 py-1.5 text-xs font-black rounded-full shadow-xs transition-transform duration-200 group-hover:scale-105 active:scale-95"
              />
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Quantity Stepper */}
                <div className="flex items-center rounded-full border-2 border-[#F8B77C] bg-white p-0.5 shadow-xs">
                  <button
                    type="button"
                    onClick={(e) => handleQtyChange(e, (cartItem?.qty || 1) - 1)}
                    aria-label="Decrease quantity"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-[#33243A] hover:bg-[#FFF183] active:scale-95 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="min-w-5 text-center text-xs font-black text-[#33243A]">
                    {cartItem?.qty || 1}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleQtyChange(e, (cartItem?.qty || 1) + 1)}
                    aria-label="Increase quantity"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-[#33243A] hover:bg-[#FFF183] active:scale-95 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Remove from Cart Button */}
                <button
                  type="button"
                  onClick={handleRemoveFromCart}
                  aria-label={`Remove ${product.name} from cart`}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#FAA4B5]/40 bg-[#FAA4B5]/15 text-[#33243A] transition-colors hover:bg-[#FAA4B5] active:scale-95 cursor-pointer"
                  title="Remove from cart"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* In Cart Confirmation Note */}
          {isInCart && (
            <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#F8B77C]">
              <IconCheck className="h-3 w-3" /> In cart •{" "}
              <button
                type="button"
                onClick={handleRemoveFromCart}
                className="underline hover:text-[#FAA4B5] cursor-pointer"
              >
                Remove
              </button>
            </p>
          )}

          {/* Details Link */}
          <div className="mt-1.5 text-right">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3A3438]/70 transition-colors hover:text-[#FAA4B5]"
            >
              View details <IconArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
