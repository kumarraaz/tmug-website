"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product, ProductVariant } from "@/types";
import { useShop } from "@/lib/store";
import { frontImage } from "@/data/products";
import { IconCheck, IconPlus } from "../icons";

type Phase = "idle" | "adding" | "added";

/**
 * Add-to-cart button with the full micro-interaction:
 * idle → "Adding..." → "Added ✓", plus fly-to-cart thumbnail.
 * The actual cart mutation + badge pulse happen in the store.
 */
export default function AddToCartButton({
  product,
  variant,
  qty = 1,
  className = "",
  openCart = false,
  onAdded,
}: {
  product: Product;
  variant: ProductVariant;
  qty?: number;
  className?: string;
  /** Open the cart drawer after adding (used on product pages). */
  openCart?: boolean;
  /** Called right after the item is added to the cart. */
  onAdded?: () => void;
}) {
  const { addToCart, triggerFly, setCartOpen, showToast } = useShop();
  const [phase, setPhase] = useState<Phase>("idle");
  const btnRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "idle") return;
    setPhase("adding");

    // Fly-to-cart: from the button's center to the header cart icon
    const r = btnRef.current?.getBoundingClientRect();
    const img = frontImage(variant);
    const cartEl = document.getElementById("cart-button");
    const cartRect = cartEl?.getBoundingClientRect();
    const toX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 44;
    const toY = cartRect ? cartRect.top + cartRect.height / 2 : 44;
    if (r) triggerFly(img.src, img.alt, r.left + r.width / 2, r.top + r.height / 2, toX, toY);

    addToCart(product, variant, qty);
    showToast(`${product.name} added to cart`);
    onAdded?.();

    timers.current.push(setTimeout(() => setPhase("added"), 450));
    timers.current.push(
      setTimeout(() => {
        setPhase("idle");
        if (openCart) setCartOpen(true);
      }, 1500),
    );
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      disabled={phase === "adding"}
      aria-live="polite"
      aria-label={
        phase === "added"
          ? `${product.name} added to cart`
          : `Add ${product.name} (${variant.label}) to cart`
      }
      className={`group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-extrabold transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_10px_24px_-10px_rgba(217,164,65,0.4)] active:scale-[0.97] ${
        phase === "added"
          ? "bg-tea-gold text-charcoal shadow-md"
          : "bg-charcoal text-white hover:bg-tea-gold hover:text-charcoal shadow-sm"
      } ${className}`}
    >
      {/* subtle shine sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[180%] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-500 ease-out group-hover/btn:translate-x-[380%]"
      />
      {/* shine sweep on added */}
      <AnimatePresence>
        {phase === "added" && (
          <motion.span
            initial={{ x: "-120%" }}
            animate={{ x: "240%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {phase === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            <IconPlus className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" /> Add to Cart
          </motion.span>
        )}
        {phase === "adding" && (
          <motion.span
            key="adding"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" aria-hidden="true" />
            Adding…
          </motion.span>
        )}
        {phase === "added" && (
          <motion.span
            key="added"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="inline-flex items-center gap-2"
          >
            <IconCheck className="h-4 w-4" /> Added
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
