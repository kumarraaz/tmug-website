"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { frontImage, getVariant } from "@/data/products";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconStar, IconCheck, IconTrash } from "./icons";
import AddToCartButton from "./cart/AddToCartButton";
import { VariantSelector } from "./ProductCard";

/**
 * "Shop by Product" card: large square packshot stage on top, centered details below.
 * Hover (mouse/pen only, driven by React state so it doesn't depend on CSS variants): the packshot smoothly
 * enlarges inside its padded stage, never clipped; touch devices simply show the normal state.
 */
export default function ShopProductCard({ product }: { product: Product }) {
  const { lines, updateQty, removeLine, showToast } = useShop();
  const [zoom, setZoom] = useState(false);
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const variant = getVariant(product, variantId);
  const front = frontImage(variant);

  const cartItem = lines.find((l) => l.variantId === variant.id);
  const compareAt = variant.compareAtPrice;
  const discount =
    compareAt && compareAt > variant.price ? Math.round(((compareAt - variant.price) / compareAt) * 100) : 0;

  const setQty = (qty: number) => {
    if (qty <= 0) {
      removeLine(variant.id);
      showToast(`${product.name} removed from cart`);
    } else {
      updateQty(variant.id, qty);
    }
  };

  return (
    <article className="group relative flex h-full flex-col rounded-[1.35rem] border border-[#3A3438]/10 bg-white shadow-[0_8px_24px_-12px_rgba(51,36,58,0.14)] transition-shadow duration-300 hover:z-10 hover:shadow-[0_20px_40px_-14px_rgba(51,36,58,0.22)]">
      {/* Packshot stage — padded so the enlarged product stays fully inside it */}
      <div
        onPointerEnter={(e) => e.pointerType !== "touch" && setZoom(true)}
        onPointerLeave={() => setZoom(false)}
        className="relative aspect-square w-full overflow-hidden rounded-t-[1.35rem] bg-gradient-to-b from-[#FFF7EF] to-[#FBE7DC]/60"
      >
        <div className="absolute inset-0 p-[9%]">
          <div
            className="relative h-full w-full"
            style={{
              transform: zoom ? "scale(1.16)" : "scale(1)",
              transformOrigin: "center",
              transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
              willChange: "transform",
            }}
          >
            <Image
              src={front.src}
              alt={front.alt}
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              className="object-contain"
            />
          </div>
        </div>

        {product.featured && (
          <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full border border-[#F8B77C] bg-[#FFF183] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#33243A] shadow-xs">
            <IconStar className="h-2.5 w-2.5 fill-[#33243A]" /> Bestseller
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 z-20 rounded-full bg-[#FAA4B5] px-2 py-0.5 text-[11px] font-black text-[#33243A]">
            -{discount}%
          </span>
        )}

        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {product.name}</span>
        </Link>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col items-center gap-1.5 p-3.5 text-center sm:p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FAA4B5]">
          {product.category === "chai" ? "Assam Chai" : product.category === "green-tea" ? "Darjeeling" : "Botanical"}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="block font-display text-[15px] font-black leading-snug text-[#33243A] transition-colors hover:text-[#FAA4B5] sm:text-[16px]"
        >
          {product.name}
        </Link>
        <p className="text-[12px] font-semibold text-[#3A3438]/60">{variant.label}</p>

        <VariantSelector product={product} selectedId={variantId} onChange={setVariantId} small />

        <p className="mt-1 flex items-baseline justify-center gap-2 font-display text-lg font-black text-[#33243A]">
          {discount > 0 && compareAt && (
            <span className="text-[13px] font-semibold text-[#3A3438]/50 line-through">{formatINR(compareAt)}</span>
          )}
          {formatINR(variant.price)}
        </p>

        <div className="mt-auto w-full pt-2">
          {!cartItem ? (
            <AddToCartButton
              product={product}
              variant={variant}
              className="w-full bg-[#FAA4B5] px-4 py-2.5 text-sm font-black text-[#33243A] shadow-xs hover:bg-[#F8B77C] rounded-xl"
            />
          ) : (
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex flex-1 items-center justify-between rounded-xl border-2 border-[#F8B77C] bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setQty(cartItem.qty - 1)}
                  aria-label="Decrease quantity"
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-black text-[#33243A] hover:bg-[#FFF183] cursor-pointer"
                >
                  −
                </button>
                <span className="inline-flex items-center gap-1 text-sm font-black text-[#33243A]">
                  <IconCheck className="h-3.5 w-3.5 text-[#F8B77C]" /> {cartItem.qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(cartItem.qty + 1)}
                  aria-label="Increase quantity"
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-black text-[#33243A] hover:bg-[#FFF183] cursor-pointer"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => setQty(0)}
                aria-label={`Remove ${product.name} from cart`}
                title="Remove from cart"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#FAA4B5]/40 bg-[#FAA4B5]/15 text-[#33243A] hover:bg-[#FAA4B5] cursor-pointer"
              >
                <IconTrash className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
