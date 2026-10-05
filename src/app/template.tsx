"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Subtle page transition: opacity fade only.
 *
 * IMPORTANT: this wrapper contains the ENTIRE app, including all fixed
 * overlays (cart drawer, quick view, search, mobile menu, toasts). We must
 * NOT animate `filter` or `transform` (y/x/scale) here: any non-`none` value
 * of those makes this div the *containing block* for fixed-position
 * descendants, which breaks `position: fixed` overlays (e.g. the cart drawer
 * rendered off-screen while its backdrop covered the page). Opacity alone
 * creates no such trap.
 *
 * Keyed by pathname so every route change animates once.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
