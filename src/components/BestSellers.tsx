"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PRODUCTS, frontImage, getVariant } from "@/data/products";
import type { Product } from "@/types";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import Reveal from "./motion/Reveal";
import AddToCartButton from "./cart/AddToCartButton";
import { IconArrowRight, IconStar, IconCheck, IconTrash } from "./icons";
import { useSiteControls } from "@/lib/site-controls-context";

// Verified Best Seller IDs from catalog
const BEST_SELLER_IDS = ["butterfly-pea", "hibiscus", "darjeeling-green", "gold-tea"];
const BEST_SELLER_PRODUCTS: Product[] = BEST_SELLER_IDS.map((id) =>
  PRODUCTS.find((p) => p.id === id)!
).filter(Boolean);

export default function BestSellers() {
  const { controls } = useSiteControls();
  const bsSettings = controls?.sectionsVisual?.bestSellers;

  const reduceMotion = useReducedMotion();
  const { lines, updateQty, removeLine, showToast } = useShop();

  // Selected variant state per product
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    BEST_SELLER_PRODUCTS.forEach((p) => {
      initial[p.id] = p.variants[0].id;
    });
    return initial;
  });

  const handleSelectVariant = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  const handleRemove = (productId: string, variantId: string, productName: string) => {
    removeLine(variantId);
    showToast(`${productName} removed from cart`);
  };

  const handleQtyChange = (
    productId: string,
    variantId: string,
    productName: string,
    qty: number
  ) => {
    if (qty <= 0) {
      handleRemove(productId, variantId, productName);
    } else {
      updateQty(variantId, qty);
    }
  };

  return (
    <section
      id="best-sellers"
      aria-label="TMUG Best Sellers"
      style={{
        backgroundColor: bsSettings?.bgColor || undefined,
        paddingTop: bsSettings?.paddingTop !== undefined ? `${bsSettings.paddingTop}px` : undefined,
        paddingBottom: bsSettings?.paddingBottom !== undefined ? `${bsSettings.paddingBottom}px` : undefined,
      }}
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF7EF] via-[#FBE7DC]/50 to-[#FFF7EF] py-10 sm:py-14"
    >
      {/* Decorative Ambiance Blobs (Palette: #FAA4B5, #FFF183, #70C1E1) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#FAA4B5]/25 blur-3xl" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-[#FFF183]/30 blur-3xl" />
        <div className="absolute right-[6%] top-[8%] w-10 sm:w-12 opacity-70 animate-float">
          <Image
            src="/assets/stickers/sparkle.svg"
            alt=""
            width={44}
            height={44}
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F8B77C] bg-white/90 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#33243A] shadow-xs">
              <IconStar className="h-3.5 w-3.5 fill-[#F8B77C] text-[#F8B77C]" />
              Customer Favourites
            </span>
            <h2
              style={{ color: bsSettings?.headingColor || undefined }}
              className="text-section mt-1.5 font-display font-black text-[#33243A]"
            >
              {bsSettings?.heading || (
                <>
                  Top Rated <span className="text-[#FAA4B5]">Best Sellers</span>
                </>
              )}
            </h2>
            <p
              style={{ color: bsSettings?.textColor || undefined }}
              className="mt-1 text-xs sm:text-sm text-[#3A3438]/80 max-w-lg mx-auto"
            >
              {bsSettings?.subheading || "The everyday teas our community keeps reordering. Whole flowers and mountain estate leaves with zero additives."}
            </p>
          </Reveal>
        </div>

        {/* ── Compact, High-Hierarchy D2C Product Grid ── */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BEST_SELLER_PRODUCTS.map((product, idx) => {
            const currentVariantId = selectedVariants[product.id] || product.variants[0].id;
            const currentVariant = getVariant(product, currentVariantId);
            const packImg = frontImage(currentVariant);

            const cartItem = lines.find((l) => l.variantId === currentVariant.id);
            const isInCart = Boolean(cartItem);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col overflow-hidden rounded-[1.6rem] border border-[#3A3438]/12 bg-white shadow-[0_12px_30px_-15px_rgba(51,36,58,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_45px_-16px_rgba(51,36,58,0.25)] hover:border-[#FAA4B5]/70"
              >
                {/* Packshot Frame (Object-fit contain, transparent PNG, sharp foreground) */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-[#FFF7EF] to-[#FBE7DC]/60 p-4">
                  {/* Subtle Colored Aura on Hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(250,164,181,0.5) 0%, rgba(255,241,131,0.25) 50%, transparent 75%)",
                    }}
                  />

                  {/* Bestseller Badge */}
                  <div className="absolute left-3 top-3 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF183] border border-[#F8B77C] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#33243A] shadow-xs">
                      <IconStar className="h-2.5 w-2.5 fill-[#33243A]" /> #{idx + 1} Best Seller
                    </span>
                  </div>

                  {/* Product Packshot Image */}
                  <div className="relative h-full w-full flex items-center justify-center">
                    <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <Image
                        src={packImg.src}
                        alt={packImg.alt}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                        className="object-contain drop-shadow-[0_15px_25px_rgba(51,36,58,0.2)]"
                      />
                    </div>
                  </div>

                  {/* Click to details */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`View ${product.name}`}
                  >
                    <span className="sr-only">View {product.name}</span>
                  </Link>
                </div>

                {/* Card Body & Details */}
                <div className="flex flex-1 flex-col p-4">
                  {/* Category & Name */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FAA4B5]">
                      {product.category === "chai"
                        ? "Assam CTC Chai"
                        : product.category === "green-tea"
                        ? "Darjeeling Green"
                        : "100% Whole Flower"}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-0.5 block font-display text-[16px] font-black text-[#33243A] leading-snug transition-colors hover:text-[#FAA4B5]"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 line-clamp-1 text-[11px] font-medium text-[#3A3438]/70">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Pack Selector (Jar / Pouch) */}
                  {product.variants.length > 1 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.variants.map((v) => {
                        const isSel = v.id === currentVariantId;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSelectVariant(product.id, v.id)}
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all cursor-pointer ${
                              isSel
                                ? "bg-[#33243A] text-white shadow-xs"
                                : "border border-[#3A3438]/15 bg-white/90 text-[#33243A] hover:border-[#FAA4B5]"
                            }`}
                          >
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Price & Real Cart Stepper / Button */}
                  <div className="mt-auto pt-3 border-t border-[#3A3438]/10">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-lg font-black text-[#33243A]">
                          {formatINR(currentVariant.price)}
                        </p>
                      </div>

                      {/* Add to Cart or Quantity Stepper */}
                      {!isInCart ? (
                        <AddToCartButton
                          product={product}
                          variant={currentVariant}
                          className="bg-[#FAA4B5] hover:bg-[#F8B77C] text-[#33243A] px-4 py-2 text-xs font-black rounded-full shadow-xs transition-transform duration-200 group-hover:scale-105 active:scale-95"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center rounded-full border-2 border-[#F8B77C] bg-white p-0.5 shadow-xs">
                            <button
                              type="button"
                              onClick={() =>
                                handleQtyChange(
                                  product.id,
                                  currentVariant.id,
                                  product.name,
                                  (cartItem?.qty || 1) - 1
                                )
                              }
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
                              onClick={() =>
                                handleQtyChange(
                                  product.id,
                                  currentVariant.id,
                                  product.name,
                                  (cartItem?.qty || 1) + 1
                                )
                              }
                              aria-label="Increase quantity"
                              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-[#33243A] hover:bg-[#FFF183] active:scale-95 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemove(product.id, currentVariant.id, product.name)
                            }
                            aria-label={`Remove ${product.name} from cart`}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#FAA4B5]/40 bg-[#FAA4B5]/15 text-[#33243A] hover:bg-[#FAA4B5] active:scale-95 cursor-pointer"
                            title="Remove from cart"
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isInCart && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#F8B77C]">
                        <IconCheck className="h-3 w-3" /> In cart
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
