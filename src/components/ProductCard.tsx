"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { frontImage, getVariant } from "@/data/products";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconPlus } from "./icons";

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
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Choose a pack for ${product.name}`}>
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
            className={`rounded-full border font-bold transition-all ${
              small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
            } ${
              selected
                ? "border-tea-green bg-tea-green text-cream"
                : "border-ink/15 bg-white text-ink hover:border-tea-green/50"
            }`}
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

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, setQuickViewId } = useShop();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [added, setAdded] = useState(false);
  const variant = getVariant(product, variantId);
  const front = frontImage(variant);
  const back = variant.images.find((i) => i.kind === "back");

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, variant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_35px_-15px_rgba(23,32,24,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-15px_rgba(23,32,24,0.35)]"
      onClick={() => setQuickViewId(product.id)}
    >
      {/* Image with hover swap */}
      <div className="relative aspect-square w-full overflow-hidden bg-cream-dark">
        <Image
          src={front.src}
          alt={front.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            back ? "group-hover:opacity-0" : ""
          }`}
        />
        {back && (
          <Image
            src={back.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
          <span className="absolute left-3 top-3 rounded-full bg-tea-green px-2.5 py-1 text-[11px] font-extrabold text-cream">
            Save {formatINR(variant.compareAtPrice - variant.price)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <div>
          <h3 className="font-display text-lg font-extrabold leading-tight text-ink">
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {variant.label}
          </p>
        </div>

        <VariantSelector product={product} selectedId={variantId} onChange={setVariantId} small />

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="text-lg font-extrabold text-tea-green">
            {formatINR(variant.price)}{" "}
            {variant.compareAtPrice && (
              <span className="text-sm font-semibold text-ink-soft/70 line-through">
                {formatINR(variant.compareAtPrice)}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} (${variant.label}) to cart`}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-extrabold transition-all active:scale-95 ${
              added ? "bg-tea-green text-cream" : "bg-ink text-cream hover:bg-tea-green"
            }`}
          >
            <IconPlus className="h-4 w-4" />
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
