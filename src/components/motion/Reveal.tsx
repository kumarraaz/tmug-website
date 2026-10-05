"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealKind = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "blur";

const VARIANTS: Record<RevealKind, Variants> = {
  "fade-up": { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } },
  "fade-in": { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  "slide-left": { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } },
  "slide-right": { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  "scale": { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } },
  "blur": { hidden: { opacity: 0, y: 16, filter: "blur(6px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } },
};

interface RevealProps {
  children: ReactNode;
  kind?: RevealKind;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "span";
}

/**
 * Reusable scroll-triggered reveal. Fires once when entering the viewport,
 * respects prefers-reduced-motion automatically via Framer Motion.
 */
export default function Reveal({
  children,
  kind = "fade-up",
  delay = 0,
  duration = 0.55,
  className,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={VARIANTS[kind]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-70px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children should be <RevealItem/>. */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.09,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
