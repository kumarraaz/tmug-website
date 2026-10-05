"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Magnetic CTA — the button subtly follows the cursor within its bounds
 * and springs back on leave. Disabled for touch / reduced motion.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 0.25,
  onClick,
  href,
  ariaLabel,
  type,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };

  const reset = () => setPos({ x: 0, y: 0 });
  const motionProps = {
    animate: { x: pos.x, y: pos.y },
    transition: { type: "spring" as const, stiffness: 200, damping: 18 },
    onMouseMove: onMove,
    onMouseLeave: reset,
  };

  if (href) {
    return (
      <motion.a
        // @ts-expect-error polymorphic ref
        ref={ref}
        href={href}
        aria-label={ariaLabel}
        className={`inline-block ${className}`}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      // @ts-expect-error polymorphic ref
      ref={ref}
      type={type ?? "button"}
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
