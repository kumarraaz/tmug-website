"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Oversized TMUG logo used as a VERY SUBTLE background watermark.
 * Extremely low opacity, slow rotation + scroll parallax. Never
 * interferes with readability.
 */
export default function FloatingLogo({
  className = "",
  opacity = 0.05,
  size = "120%",
}: {
  className?: string;
  opacity?: number;
  size?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.img
        src="/logo/tmug-logo.png"
        alt=""
        style={{ y: reduce ? 0 : y, rotate: reduce ? 0 : rotate, opacity, width: size }}
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
        draggable={false}
      />
    </div>
  );
}
