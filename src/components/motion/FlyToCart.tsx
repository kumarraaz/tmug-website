"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useShop } from "@/lib/store";

/**
 * Fly-to-cart animation: a small product thumbnail arcs from the
 * Add-to-Cart button to the header cart icon, then the badge pulses.
 * Rendered once near the root (inside ShopProvider).
 */
export default function FlyToCart() {
  const { fly, clearFly } = useShop();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {fly && !reduce && (
        <motion.img
          key={fly.key}
          src={fly.img}
          alt=""
          aria-hidden="true"
          initial={{
            x: fly.fromX - 32,
            y: fly.fromY - 32,
            scale: 1,
            opacity: 1,
            borderRadius: 16,
          }}
          animate={{
            x: fly.toX - 32,
            y: fly.toY - 32,
            scale: 0.18,
            opacity: 0.9,
            borderRadius: 999,
          }}
          exit={{ opacity: 0, scale: 0.1 }}
          transition={{ duration: 0.7, ease: [0.3, 0.7, 0.4, 1] }}
          onAnimationComplete={clearFly}
          className="pointer-events-none fixed left-0 top-0 z-[80] h-16 w-16 object-cover shadow-xl"
        />
      )}
    </AnimatePresence>
  );
}
