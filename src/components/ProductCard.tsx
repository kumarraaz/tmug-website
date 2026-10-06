"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { Product } from "@/types";
import { frontImage, getVariant } from "@/data/products";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconArrowRight, IconStar } from "./icons";
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
            className={`rounded-full border font-bold transition-all duration-200 ${
              small ? "px-2.5 py-1 text-[11px]" : "px-4 py-2 text-sm"
            } ${
              selected
                ? "border-transparent text-cream shadow-md"
                : "border-ink/15 bg-white/70 text-ink hover:border-tea-green/60"
            }`}
            style={selected ? { backgroundColor: product.accent } : undefined}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}

/** +/- stepper. */
export function QuantitySelector({
  qty,
  onChange,
  small = false,
}: {
  qty: number;
  onChange: (qty: number) => void;
  small?: boolean;
}) {
  const btn = small ? "h-7 w-7" : "h-9 w-9";
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white ${
        small ? "p-0.5" : "p-1"
      }`}
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(Math.max(1, qty - 1));
        }}
        disabled={qty <= 1}
        aria-label="Decrease quantity"
        className={`${btn} flex items-center justify-center rounded-full text-lg font-bold text-ink transition-colors hover:bg-cream-dark disabled:opacity-30`}
      >
        −
      </button>
      <span className={`min-w-6 text-center font-extrabold ${small ? "text-sm" : "text-base"}`} aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(Math.min(99, qty + 1));
        }}
        aria-label="Increase quantity"
        className={`${btn} flex items-center justify-center rounded-full text-lg font-bold text-ink transition-colors hover:bg-cream-dark`}
      >
        +
      </button>
    </div>
  );
}

/**
 * Premium D2C product card: accent-tinted, hover lift + image zoom/rotate,
 * quick-view + product-page links, animated Add to Cart.
 */
export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { setQuickViewId } = useShop();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const variant = getVariant(product, variantId);
  const front = frontImage(variant);
  const back = variant.images.find((i) => i.kind === "back");

  /**
   * Playful wavy interaction: the product leans toward the cursor with
   * spring-smoothed motion (translate ±6px, rotate ±2.5°, scale 1.03),
   * easing back to neutral on leave. Idle 3px bob underneath via CSS.
   * Disabled under prefers-reduced-motion; touch uses a tap lift instead.
   */
  const reduceWavy = useReducedMotion();
  const [wavyHover, setWavyHover] = useState(false);
  const wtx = useMotionValue(0);
  const wty = useMotionValue(0);
  const wrt = useMotionValue(0);
  const wavySpring = { stiffness: 200, damping: 20, mass: 0.6 };
  const wsx = useSpring(wtx, wavySpring);
  const wsy = useSpring(wty, wavySpring);
  const wsr = useSpring(wrt, wavySpring);

  const handleWavyMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceWavy) return;
    const r = e.currentTarget.getBoundingClientRect();
    // normalized cursor position: -0.5 … 0.5 on each axis
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    // lean with the cursor: right → lean right, up → rise, etc.
    wtx.set(nx * 12);
    wty.set(ny * 12);
    wrt.set(nx * 5);
  };
  const handleWavyEnter = (e: React.MouseEvent<HTMLElement>) => {
    setWavyHover(true);
    e.currentTarget.style.borderColor = product.accent;
  };
  const handleWavyLeave = (e: React.MouseEvent<HTMLElement>) => {
    setWavyHover(false);
    wtx.set(0);
    wty.set(0);
    wrt.set(0);
    e.currentTarget.style.borderColor = "";
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ y: -4 }}
      onMouseMove={handleWavyMove}
      onMouseEnter={handleWavyEnter}
      onMouseLeave={handleWavyLeave}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-ink/8 bg-white shadow-[0_10px_28px_-16px_rgba(11,61,46,0.22)] transition-shadow duration-300 hover:shadow-[0_22px_45px_-18px_rgba(11,61,46,0.35)]"
    >
      {/* Image — full pack always visible, never cropped.
          Wavy layer: pointer springs on the outer wrapper, gentle idle bob
          inside, so the two motions never fight. pointer-events-none keeps
          the card link + quick-view button clickable. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ backgroundColor: product.accentSoft }}>
        <motion.div
          aria-hidden="true"
          style={{ x: wsx, y: wsy, rotate: wsr }}
          animate={{ scale: wavyHover && !reduceWavy ? 1.03 : 1 }}
          whileTap={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="pointer-events-none absolute inset-0"
        >
          <div className={reduceWavy ? "h-full w-full" : "h-full w-full animate-bob"}>
            <Image
              src={front.src}
              alt={front.alt}
              fill
              sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 22vw"
              loading="lazy"
              className={`object-contain p-4 transition-opacity duration-300 ${
                back ? "group-hover:opacity-0" : ""
              }`}
            />
            {back && (
              <Image
                src={back.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 22vw"
                loading="lazy"
                className="object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
          </div>
        </motion.div>
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {product.name}</span>
        </Link>
        {product.featured && (
          <span
            className="absolute left-2.5 top-2.5 z-20 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white"
            style={{ backgroundColor: product.accent }}
          >
            <IconStar className="h-2.5 w-2.5" /> Bestseller
          </span>
        )}
        {/* quick view pill — appears on hover (desktop), always visible on touch */}
        <button
          type="button"
          onClick={() => setQuickViewId(product.id)}
          className="absolute bottom-2.5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-tea-ink/85 px-3.5 py-1.5 text-[11px] font-extrabold text-cream backdrop-blur transition-all duration-300 hover:bg-tea-ink sm:translate-y-12 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          Quick view
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em]" style={{ color: product.accent }}>
            {product.profile.split("·")[0]?.trim()}
          </p>
          <Link href={`/products/${product.slug}`} className="hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: product.accent }}>
            <h3 className="mt-0.5 font-display text-[17px] font-bold leading-snug text-ink">
              {product.name}
            </h3>
          </Link>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            {variant.label}
          </p>
        </div>

        <VariantSelector product={product} selectedId={variantId} onChange={setVariantId} small />

        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <p className="font-display text-lg font-extrabold text-tea-deep">
            {formatINR(variant.price)}
          </p>
          <AddToCartButton product={product} variant={variant} className="px-3.5 py-2 text-[13px]" />
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-ink-soft transition-colors hover:text-tea-green"
        >
          View details <IconArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
