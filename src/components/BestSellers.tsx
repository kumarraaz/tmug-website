"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS, frontImage, getVariant } from "@/data/products";
import type { Product } from "@/types";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import Reveal from "./motion/Reveal";
import AddToCartButton from "./cart/AddToCartButton";
import { IconStar } from "./icons";
import { useSiteControls } from "@/lib/site-controls-context";

// Verified Best Seller IDs from catalog
const BEST_SELLER_IDS = ["butterfly-pea", "hibiscus", "darjeeling-green", "gold-tea"];
const BEST_SELLER_PRODUCTS: Product[] = BEST_SELLER_IDS.map((id) =>
  PRODUCTS.find((p) => p.id === id)!
).filter(Boolean);

export default function BestSellers() {
  const { controls } = useSiteControls();
  const bsSettings = controls?.sectionsVisual?.bestSellers;

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
      className="relative overflow-hidden bg-white py-10 sm:py-14"
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

        {/* ── Product Grid ── */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {BEST_SELLER_PRODUCTS.map((product, idx) => {
            const currentVariantId = selectedVariants[product.id] || product.variants[0].id;
            const currentVariant = getVariant(product, currentVariantId);
            const packImg = frontImage(currentVariant);
            const compareAt = currentVariant.compareAtPrice;
            const discount =
              compareAt && compareAt > currentVariant.price
                ? Math.round(((compareAt - currentVariant.price) / compareAt) * 100)
                : 0;

            const cartItem = lines.find((l) => l.variantId === currentVariant.id);
            const isInCart = Boolean(cartItem);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#3A3438]/10 bg-white shadow-sm"
              >
                {/* Square image, edge to edge */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#FFF7EF]">
                  <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-[#FFE9D2] px-2 py-1 text-[11px] font-semibold text-[#C2410C]">
                    #{idx + 1} Best Seller
                  </span>
                  {discount > 0 && (
                    <span className="absolute right-2 top-2 z-10 rounded-md bg-[#DCFCE7] px-1.5 py-0.5 text-[11px] font-semibold text-[#15803D]">
                      -{discount}%
                    </span>
                  )}
                  <Image
                    src={packImg.src}
                    alt={packImg.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 22vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                  <Link
                    href={`/products/${product.slug}`}
                    className="absolute inset-0 z-[5]"
                    aria-label={`View ${product.name}`}
                  >
                    <span className="sr-only">View {product.name}</span>
                  </Link>
                </div>

                {/* Details, centered */}
                <div className="flex flex-1 flex-col items-center gap-1.5 px-3 pb-3 pt-3 text-center">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-display text-[15px] font-medium leading-snug text-[#33243A] hover:text-[#2E7D32]"
                  >
                    {product.name}
                  </Link>
                  <p className="line-clamp-1 text-[12px] text-[#3A3438]/60">{product.tagline}</p>

                  {product.variants.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {product.variants.map((v) => {
                        const isSel = v.id === currentVariantId;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSelectVariant(product.id, v.id)}
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all cursor-pointer ${
                              isSel
                                ? "bg-[#33243A] text-white"
                                : "border border-[#3A3438]/15 bg-white text-[#33243A] hover:border-[#5CD07A]"
                            }`}
                          >
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <p className="mt-0.5 flex items-baseline gap-2 text-[15px] font-semibold text-[#33243A]">
                    {compareAt && compareAt > currentVariant.price && (
                      <span className="text-[12px] font-normal text-[#3A3438]/50 line-through">
                        {formatINR(compareAt)}
                      </span>
                    )}
                    {formatINR(currentVariant.price)}
                  </p>

                  <div className="mt-auto w-full pt-1.5">
                    {!isInCart ? (
                      <AddToCartButton
                        product={product}
                        variant={currentVariant}
                        className="!w-full !rounded-lg !bg-[#5CD07A] !text-white hover:!bg-[#4BBF69] px-4 py-2.5 text-sm font-bold"
                      />
                    ) : (
                      <div className="flex w-full items-center justify-between rounded-lg bg-[#5CD07A] px-2 py-1.5 text-white">
                        <button
                          type="button"
                          onClick={() =>
                            handleQtyChange(product.id, currentVariant.id, product.name, (cartItem?.qty || 1) - 1)
                          }
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-lg font-bold hover:bg-white/20 cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold">{cartItem?.qty || 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQtyChange(product.id, currentVariant.id, product.name, (cartItem?.qty || 1) + 1)
                          }
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-lg font-bold hover:bg-white/20 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
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
