"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { frontImage, getVariant } from "@/data/products";
import { SHOP_MEDIA } from "@/data/shop-media";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconStar, IconCheck, IconTrash } from "./icons";
import AddToCartButton from "./cart/AddToCartButton";
import { VariantSelector } from "./ProductCard";

// Hover reveal modelled on drinkolipop.com "Shop our collections": on desktop, entering a card raises a
// wave-edged mask (700ms, ease-out-cubic) that reveals a second image; leaving lowers it again.
const WAVE_SIZE = 314;
const WAVE_MS = 700;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function wavePath(revealPx: number): string {
  const reveal = clamp(revealPx, 0, WAVE_SIZE);
  const offset = WAVE_SIZE - reveal;
  const flat = easeOutCubic(clamp((reveal / WAVE_SIZE - 0.84) / 0.16, 0, 1)); // crest flattens near the top
  const y = (v: number) => lerp(v + offset, offset, flat);
  return (
    `M314 314H0.000422459L0.00012756 ${y(4.4565)}C-0.0456402 ${y(4.41899)} 62.4 ${y(-13.1434)} 157 ${y(26.0583)}` +
    `C251.6 ${y(65.2601)} 314 ${y(0.456482)} 314 ${y(0.456482)}V314Z`
  );
}

/**
 * "Shop by Product" card: large square packshot stage on top, centered details below.
 * Desktop hover/focus reveals the pack's back view through a rising wave mask (no hover needed on touch/mobile).
 */
export default function ShopProductCard({ product }: { product: Product }) {
  const { lines, updateQty, removeLine, showToast } = useShop();
  const media = SHOP_MEDIA[product.id];
  // The 100g pouch is the primary variant for products that have pouch + poster artwork
  const [variantId, setVariantId] = useState(
    (media && product.variants.find((v) => v.weight === "100g" && v.pack === "pouch")?.id) || product.variants[0].id,
  );
  const variant = getVariant(product, variantId);
  const pouchMode = Boolean(media) && variant.weight === "100g" && variant.pack === "pouch";
  const front = pouchMode && media ? { src: media.pouch, alt: media.pouchAlt } : frontImage(variant);
  const back = pouchMode && media ? { src: media.poster } : variant.images.find((i) => i.kind === "back");

  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const pathRef = useRef<SVGPathElement>(null);
  const revealRef = useRef(0);
  const rafRef = useRef(0);

  const animateTo = useCallback((target: number) => {
    const path = pathRef.current;
    if (!path) return;
    cancelAnimationFrame(rafRef.current);
    const from = revealRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealRef.current = target;
      path.setAttribute("d", wavePath(target));
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = clamp((now - start) / WAVE_MS, 0, 1);
      const r = lerp(from, target, easeOutCubic(t));
      revealRef.current = r;
      path.setAttribute("d", wavePath(r));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const canReveal = () => window.matchMedia("(min-width:1024px) and (hover:hover)").matches;

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
    <article
      onPointerEnter={(e) => e.pointerType !== "touch" && canReveal() && animateTo(WAVE_SIZE)}
      onPointerLeave={() => animateTo(0)}
      onFocus={() => canReveal() && animateTo(WAVE_SIZE)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && animateTo(0)}
      className="group relative flex h-full flex-col rounded-[1.35rem] border border-[#3A3438]/10 bg-white shadow-[0_8px_24px_-12px_rgba(51,36,58,0.14)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-14px_rgba(51,36,58,0.22)]"
    >
      {/* Packshot stage */}
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-t-[1.35rem] ${
          pouchMode ? "bg-white" : "bg-gradient-to-b from-[#FFF7EF] to-[#FBE7DC]/60"
        }`}
      >
        <div className={`absolute inset-0 ${pouchMode ? "p-0" : "p-[9%]"}`}>
          <div className="relative h-full w-full">
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

        {back && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] hidden lg:block">
            <svg viewBox="0 0 314 314" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
              <defs>
                <clipPath id={`wave-${uid}`} clipPathUnits="userSpaceOnUse">
                  <path ref={pathRef} d={wavePath(0)} />
                </clipPath>
                <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFF7EF" />
                  <stop offset="1" stopColor="#FBE7DC" />
                </linearGradient>
              </defs>
              <g clipPath={`url(#wave-${uid})`}>
                <rect width="314" height="314" fill={pouchMode ? "#FFFFFF" : `url(#bg-${uid})`} />
                <image
                  href={back.src}
                  x={pouchMode ? 0 : 28}
                  y={pouchMode ? 0 : 28}
                  width={pouchMode ? 314 : 258}
                  height={pouchMode ? 314 : 258}
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            </svg>
          </div>
        )}

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
