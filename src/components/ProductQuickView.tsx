"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getProduct, getVariant } from "@/data/products";
import type { Product } from "@/types";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconClose, IconPlus } from "./icons";
import { QuantitySelector, VariantSelector } from "./ProductCard";

/**
 * Modal body, keyed by product id — variant/gallery/qty state initializes
 * from props, so no reset effect is needed when switching products.
 */
function QuickViewBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, setCartOpen } = useShop();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const variant = getVariant(product, variantId);
  const images = variant.images;
  const activeImage = images[Math.min(imgIndex, images.length - 1)];

  const handleAdd = () => {
    addToCart(product, variant, qty);
    onClose();
    setCartOpen(true);
  };

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      onClick={(e) => e.stopPropagation()}
      className="nice-scroll relative grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-t-[1.75rem] bg-cream sm:rounded-[1.75rem] md:grid-cols-2"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quick view"
        className="absolute right-4 top-4 z-10 rounded-full bg-tea-dark/60 p-2 text-cream backdrop-blur transition-colors hover:bg-tea-dark"
      >
        <IconClose />
      </button>

      {/* Gallery */}
      <div className="bg-cream-dark p-4 sm:p-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage.src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2.5" role="tablist" aria-label="Product images">
            {images.map((im, i) => (
              <button
                key={im.src}
                type="button"
                role="tab"
                aria-selected={i === imgIndex}
                aria-label={`View image ${i + 1}: ${im.kind}`}
                onClick={() => setImgIndex(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-xl transition-all sm:h-20 sm:w-20 ${
                  i === imgIndex ? "ring-2 ring-tea-green ring-offset-2 ring-offset-cream-dark" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={im.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-ink-soft">
          {imgIndex === 0 ? "Front" : activeImage.kind === "fssai" ? "FSSAI & packer details" : "Ingredients & brewing"} — swipe through the pack
        </p>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4 p-5 sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea-green">
            {product.tagline}
          </p>
          <h3 className="mt-1 font-display text-3xl font-extrabold text-ink">{product.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{product.description}</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft">Pack size</p>
          <VariantSelector
            product={product}
            selectedId={variant.id}
            onChange={(id) => {
              setVariantId(id);
              setImgIndex(0);
            }}
          />
        </div>

        <div className="flex items-end justify-between">
          <p className="text-2xl font-extrabold text-tea-green">
            {formatINR(variant.price)}{" "}
            {variant.compareAtPrice && (
              <span className="text-base font-semibold text-ink-soft/70 line-through">
                {formatINR(variant.compareAtPrice)}
              </span>
            )}
          </p>
          <span className="text-xs font-semibold text-ink-soft">{variant.sku}</span>
        </div>

        <div className="flex items-center gap-3">
          <QuantitySelector qty={qty} onChange={setQty} />
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-tea-green px-6 py-3 text-base font-extrabold text-cream transition-transform hover:scale-[1.02] active:scale-95"
          >
            <IconPlus className="h-5 w-5" /> Add to Cart
          </button>
        </div>

        <dl className="space-y-3 rounded-2xl bg-white p-4 text-sm">
          <div>
            <dt className="font-bold text-ink">Ingredients</dt>
            <dd className="mt-0.5 text-ink-soft">{product.ingredients}</dd>
          </div>
          <div>
            <dt className="font-bold text-ink">How to brew</dt>
            <dd className="mt-0.5 text-ink-soft">{product.brewGuide}</dd>
          </div>
        </dl>
      </div>
    </motion.div>
  );
}

/** Premium quick-view modal: gallery, variants, quantity, brew info. */
export default function ProductQuickView() {
  const { quickViewId, setQuickViewId } = useShop();
  const product = quickViewId ? getProduct(quickViewId) : undefined;

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickViewId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, setQuickViewId]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-tea-dark/70 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setQuickViewId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view: ${product.name}`}
        >
          <QuickViewBody key={product.id} product={product} onClose={() => setQuickViewId(null)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
