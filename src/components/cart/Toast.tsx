"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useShop } from "@/lib/store";
import { IconCheck } from "../icons";

/** Small bottom toast — slide + fade, auto-dismisses after ~2.2s. */
export default function Toast() {
  const { toast, clearToast } = useShop();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2200);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[75] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2.5 rounded-full bg-tea-ink py-3 pl-4 pr-5 text-sm font-bold text-cream shadow-[0_16px_40px_-12px_rgba(8,42,32,0.6)]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tea-green">
              <IconCheck className="h-3.5 w-3.5" />
            </span>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
