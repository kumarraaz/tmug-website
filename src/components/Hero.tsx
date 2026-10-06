"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import FloatingLogo from "./motion/FloatingLogo";
import { IconArrowRight } from "./icons";

/* ============================================================================
 * TMUG INTERACTIVE HERO SECTION — 3D PRODUCT SHOWCASE & REVEAL
 *
 * Visual storytelling inspired by premium modern D2C beverage brands:
 * - Bespoke 3D TMUG Collector's Discovery Box with physical OPEN -> REVEAL -> CLOSE cycle
 * - The box opens: lid hinges back, inner star tea product & steaming kulhad cup
 *   rise gracefully out of the box, surrounded by expanding botanical elements
 * - Multi-layered authentic TMUG product composition (Pouches, Jars, Blossoms)
 * - 3D tactile floating info cards, mini 3D cubes, and physical "Limited Edition" seal
 * - Subtle desktop mouse-follow parallax (3-8 deg rotation) & mobile smooth float
 * - Elegant organic curved divider guiding the eye from editorial typography to product stage
 * - Dedicated responsive mobile composition, zero horizontal overflow, prefers-reduced-motion compliant
 * ========================================================================== */

// Botanical Petal SVG Component for floating florals
function FloatingPetal({
  type,
  className = "",
}: {
  type: "blue-pea" | "chamomile" | "tea-leaf" | "hibiscus";
  className?: string;
}) {
  if (type === "blue-pea") {
    return (
      <svg
        viewBox="0 0 40 40"
        className={`pointer-events-none drop-shadow-md ${className}`}
        aria-hidden="true"
      >
        <path
          d="M 20 4 C 32 4, 38 16, 32 28 C 26 38, 14 38, 8 28 C 2 16, 8 4, 20 4 Z"
          fill="#3B5EB8"
          opacity="0.9"
        />
        <path
          d="M 20 10 C 26 10, 30 18, 27 26 C 24 32, 16 32, 13 26 C 10 18, 14 10, 20 10 Z"
          fill="#587CE4"
          opacity="0.95"
        />
        <circle cx="20" cy="22" r="3.5" fill="#E8A93D" />
      </svg>
    );
  }
  if (type === "chamomile") {
    return (
      <svg
        viewBox="0 0 36 36"
        className={`pointer-events-none drop-shadow-md ${className}`}
        aria-hidden="true"
      >
        <g fill="#FFFDF7" stroke="#D8A62A" strokeWidth="1.2">
          <ellipse cx="18" cy="8" rx="4" ry="7" />
          <ellipse cx="18" cy="8" rx="4" ry="7" transform="rotate(45 18 18)" />
          <ellipse cx="18" cy="8" rx="4" ry="7" transform="rotate(90 18 18)" />
          <ellipse cx="18" cy="8" rx="4" ry="7" transform="rotate(135 18 18)" />
          <ellipse cx="18" cy="8" rx="4" ry="7" transform="rotate(180 18 18)" />
          <ellipse cx="18" cy="8" rx="4" ry="7" transform="rotate(225 18 18)" />
          <ellipse cx="18" cy="8" rx="4" ry="7" transform="rotate(270 18 18)" />
          <ellipse cx="18" cy="8" rx="4" ry="7" transform="rotate(315 18 18)" />
        </g>
        <circle cx="18" cy="18" r="4.5" fill="#D8A62A" />
      </svg>
    );
  }
  if (type === "hibiscus") {
    return (
      <svg
        viewBox="0 0 38 38"
        className={`pointer-events-none drop-shadow-md ${className}`}
        aria-hidden="true"
      >
        <g fill="#D84F6D" opacity="0.92">
          <ellipse cx="19" cy="9" rx="5.5" ry="9" />
          <ellipse cx="19" cy="9" rx="5.5" ry="9" transform="rotate(72 19 19)" />
          <ellipse cx="19" cy="9" rx="5.5" ry="9" transform="rotate(144 19 19)" />
          <ellipse cx="19" cy="9" rx="5.5" ry="9" transform="rotate(216 19 19)" />
          <ellipse cx="19" cy="9" rx="5.5" ry="9" transform="rotate(288 19 19)" />
        </g>
        <circle cx="19" cy="19" r="3.5" fill="#E8A93D" />
      </svg>
    );
  }
  // tea-leaf
  return (
    <svg
      viewBox="0 0 38 24"
      className={`pointer-events-none drop-shadow-md ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 2 12 C 14 3, 26 3, 36 12 C 26 21, 14 21, 2 12 Z"
        fill="#176B4D"
        opacity="0.9"
      />
      <path
        d="M 6 12 C 16 10, 26 10, 32 12"
        stroke="#FFF8EA"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Limited Edition 3D Medallion / Wax Sticker Badge
function LimitedEditionBadge({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.div
      animate={{
        y: isOpen ? [0, -6, 0] : [0, -3, 0],
        rotate: isOpen ? [8, 12, 8] : [6, 9, 6],
        scale: isOpen ? 1.05 : 1,
      }}
      transition={{
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.6, ease: "easeOut" },
      }}
      className="group relative select-none cursor-pointer"
      title="TMUG Collector's Reserve"
    >
      <div className="relative flex h-[80px] w-[80px] sm:h-[92px] sm:w-[92px] items-center justify-center rounded-full border-2 border-[#D8A62A] bg-gradient-to-br from-[#0B3D2E] via-[#0E513B] to-[#07241B] p-1.5 shadow-[0_16px_32px_-6px_rgba(8,42,32,0.5),0_6px_14px_rgba(216,166,42,0.3)] ring-2 ring-[#D8A62A]/40 ring-offset-2 ring-offset-cream transition-transform duration-300 group-hover:scale-105">
        {/* Scalloped decorative border dots */}
        <div className="absolute inset-1 rounded-full border border-dashed border-[#D8A62A]/60" />

        {/* Shimmer sweep */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <div className="h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[marquee_4s_linear_infinite]" />
        </div>

        {/* Seal Typography */}
        <div className="relative text-center leading-none">
          <p className="font-display text-[8px] sm:text-[9px] font-extrabold tracking-[0.2em] text-[#EFC65E]">
            TMUG
          </p>
          <p className="my-0.5 font-display text-[11px] sm:text-[13px] font-extrabold uppercase tracking-tight text-white drop-shadow-xs">
            LIMITED
          </p>
          <p className="font-display text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#D8A62A]">
            EDITION
          </p>
          <p className="mt-0.5 text-[7px] font-bold text-cream/75 tracking-wider">
            ★ 2026 ★
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// 3D Miniature Isometric Info Cube
function Mini3DCube({
  label,
  sublabel,
  className = "",
}: {
  label: string;
  sublabel: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative select-none rounded-xl border border-white/70 bg-white/90 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_12px_24px_-6px_rgba(11,61,46,0.16),0_2px_6px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_-6px_rgba(11,61,46,0.22)] ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#D8A62A] to-[#B38318] text-[10px] font-black text-white shadow-xs">
          7
        </div>
        <div>
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-tea-ink">
            {label}
          </p>
          <p className="text-[9px] sm:text-[10px] font-medium text-ink-soft">
            {sublabel}
          </p>
        </div>
      </div>
    </div>
  );
}

// Floating Card Component
function FloatingInfoCard({
  icon,
  title,
  subtitle,
  className = "",
  isOpen,
  offset = 0,
}: {
  icon: string;
  title: string;
  subtitle: string;
  className?: string;
  isOpen: boolean;
  offset?: number;
}) {
  return (
    <motion.div
      animate={{
        y: isOpen ? [offset, offset - 4, offset] : [0, -3, 0],
        scale: isOpen ? 1.02 : 1,
      }}
      transition={{
        y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: offset * 0.1 },
        scale: { duration: 0.5, ease: "easeOut" },
      }}
      className={`group select-none rounded-2xl border border-white/80 bg-white/92 p-2.5 sm:p-3 shadow-[0_14px_28px_-8px_rgba(11,61,46,0.16),0_2px_6px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:border-tea-green/30 hover:shadow-[0_18px_36px_-6px_rgba(11,61,46,0.22)] ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-cream-dark/60 text-sm sm:text-base shadow-inner">
          {icon}
        </span>
        <div className="min-w-0 pr-1">
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-tea-ink">
            {title}
          </p>
          <p className="text-[9px] sm:text-[10px] font-medium text-ink-soft truncate">
            {subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Signature Hand-Drawn Kulhad Cup & Saucer Illustration with Aromatic Steam
function KulhadTeaIllustration() {
  return (
    <div className="relative mx-auto w-[150px] sm:w-[175px]">
      <svg
        viewBox="0 0 420 380"
        className="h-auto w-full drop-shadow-[0_18px_26px_rgba(8,42,32,0.25)]"
        role="presentation"
        focusable="false"
      >
        <defs>
          <linearGradient id="teaGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5C451" />
            <stop offset="100%" stopColor="#C47E18" />
          </linearGradient>
        </defs>

        {/* Golden ambient steam */}
        <g stroke="#D8A62A" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M 185 170 C 178 140, 194 120, 186 90 C 180 72, 188 56, 184 38">
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M 185 170 C 178 140, 194 120, 186 90 C 180 72, 188 56, 184 38;
                M 185 170 C 192 140, 178 120, 190 90 C 182 72, 186 56, 184 38;
                M 185 170 C 178 140, 194 120, 186 90 C 180 72, 188 56, 184 38
              "
            />
          </path>
          <path d="M 215 172 C 223 142, 206 122, 216 92 C 222 74, 214 58, 218 40">
            <animate
              attributeName="d"
              dur="4.5s"
              repeatCount="indefinite"
              values="
                M 215 172 C 223 142, 206 122, 216 92 C 222 74, 214 58, 218 40;
                M 215 172 C 207 142, 220 122, 210 92 C 216 74, 214 58, 218 40;
                M 215 172 C 223 142, 206 122, 216 92 C 222 74, 214 58, 218 40
              "
            />
          </path>
          <path d="M 240 168 C 234 140, 248 124, 242 94 C 236 76, 244 60, 240 44">
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="
                M 240 168 C 234 140, 248 124, 242 94 C 236 76, 244 60, 240 44;
                M 240 168 C 244 140, 236 124, 246 94 C 240 76, 242 60, 240 44;
                M 240 168 C 234 140, 248 124, 242 94 C 236 76, 244 60, 240 44
              "
            />
          </path>
        </g>

        {/* Saucer */}
        <ellipse cx="210" cy="310" rx="130" ry="24" fill="#FFFDF7" stroke="#0E513B" strokeWidth="3.5" />
        <ellipse cx="210" cy="310" rx="90" ry="15" fill="none" stroke="#D8A62A" strokeWidth="2.5" opacity="0.8" />

        {/* Kulhad Body */}
        <path
          d="M 130 190 C 132 245, 158 290, 210 292 C 262 290, 288 245, 290 190 Z"
          fill="#FFFDF7"
          stroke="#0E513B"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Gold Luxury Pinstripe Bands */}
        <path d="M 136 226 C 170 240, 250 240, 284 226" stroke="#D8A62A" strokeWidth="3" fill="none" />
        <path d="M 142 244 C 172 256, 248 256, 278 244" stroke="#D8A62A" strokeWidth="2.2" fill="none" opacity="0.65" />

        {/* Botanical sprig motif */}
        <path d="M 210 278 C 210 270, 210 264, 210 256" stroke="#176B4D" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 206 264 C 198 258, 194 264, 206 264 Z" fill="#176B4D" />
        <path d="M 214 268 C 222 262, 226 268, 214 268 Z" fill="#176B4D" />

        {/* Handle */}
        <path d="M 290 208 C 326 210, 330 254, 296 264" stroke="#0E513B" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Cup Rim & Steaming Tea Infusion */}
        <ellipse cx="210" cy="190" rx="80" ry="20" fill="#FFFDF7" stroke="#0E513B" strokeWidth="4" />
        <ellipse cx="210" cy="190" rx="66" ry="15" fill="url(#teaGlowGrad)" />
      </svg>
    </div>
  );
}

// Organic SVG Divider Wave between Editorial Typography & Product Stage
function HeroOrganicDivider() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
        className="h-full w-full opacity-65 lg:opacity-85"
      >
        <defs>
          <linearGradient id="warmAlcoveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8EA" stopOpacity="0" />
            <stop offset="42%" stopColor="#F8EED9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#EFE3C7" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="dividerStrokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D8A62A" stopOpacity="0.05" />
            <stop offset="28%" stopColor="#D8A62A" stopOpacity="0.45" />
            <stop offset="72%" stopColor="#176B4D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D8A62A" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Organic S-Curve Divider Line & Backdrop Fill */}
        <path
          d="M 620 0 C 560 180, 710 320, 640 480 C 570 640, 680 760, 610 900 L 1440 900 L 1440 0 Z"
          fill="url(#warmAlcoveGrad)"
        />
        <path
          d="M 620 0 C 560 180, 710 320, 640 480 C 570 640, 680 760, 610 900"
          stroke="url(#dividerStrokeGrad)"
          strokeWidth="2.5"
          strokeDasharray="8 6"
        />
      </svg>

      {/* Ambient Radial Golden Aura behind Product Center */}
      <div className="absolute right-[8%] top-[42%] h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(216,166,42,0.2)_0%,rgba(23,107,77,0.08)_50%,transparent_75%)] blur-3xl" />
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 48]);

  // Animation cycle state: OPEN -> REVEAL -> CLOSE
  const [isOpen, setIsOpen] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 3D Mouse Parallax Tracking (Desktop only)
  const [mouseTilt, setMouseTilt] = useState({ rotX: 0, rotY: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce || typeof window === "undefined" || window.innerWidth < 1024) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      // Subtle tilt: max 5-7 degrees as requested
      setMouseTilt({
        rotY: normX * 12,
        rotX: -normY * 10,
      });
    },
    [reduce]
  );

  const handleMouseLeave = useCallback(() => {
    setMouseTilt({ rotX: 0, rotY: 0 });
  }, []);

  // Auto-Cycling Animation Loop (5.8 seconds per full cycle: ~2.8s open, ~3.0s closed)
  useEffect(() => {
    if (reduce || isManualOverride) return;

    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    const interval = setInterval(() => {
      setIsOpen((prev) => !prev);
    }, 3300);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [reduce, isManualOverride]);

  // Interactive user trigger (click/hover)
  const toggleBox = () => {
    setIsManualOverride(true);
    setIsOpen((prev) => !prev);

    if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = setTimeout(() => {
      setIsManualOverride(false);
    }, 9000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip bg-cream py-6 sm:py-10 lg:py-16 selection:bg-gold selection:text-tea-dark"
      aria-label="TMUG Interactive Hero"
    >
      {/* Background Ambience & Organic Dividing Alcove */}
      <HeroOrganicDivider />
      <FloatingLogo opacity={0.035} size="85%" />

      {/* Main Grid: Editorial Typography Left, 3D Product Theater Right */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:gap-12 xl:gap-16">
          {/* ==========================================================
              LEFT / EDITORIAL TYPOGRAPHY & CALLS TO ACTION
             ========================================================== */}
          <motion.div
            style={reduce ? undefined : { y: textY }}
            className="z-10 text-center lg:text-left pt-2 lg:pt-0"
          >
            {/* Top pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2.5 rounded-full border border-tea-green/25 bg-white/85 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-tea-green shadow-xs backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />
                Modern Indian Tea Co. · Tasting Reserve
              </span>
            </motion.div>

            {/* Large Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display font-extrabold text-tea-ink tracking-tight leading-[0.94] text-[3.25rem] sm:text-[4.25rem] lg:text-[5rem] xl:text-[5.75rem]"
            >
              Tea, but
              <br />
              make it{" "}
              <span className="relative inline-block text-tea-green">
                fun.
                {/* Handcrafted playful gold wave flourish */}
                <svg
                  viewBox="0 0 170 24"
                  className="absolute -bottom-2.5 sm:-bottom-3.5 left-0 w-full overflow-visible pointer-events-none"
                  fill="none"
                  stroke="#D8A62A"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="M 6 14 C 45 4, 115 3, 164 12 C 128 19, 65 20, 32 17"
                    opacity="0.9"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-6 max-w-lg text-[15px] sm:text-lg leading-relaxed text-ink-soft lg:mx-0"
            >
              Colour-changing blue teas, tangy ruby reds and properly kadak chai —
              whole flowers & leaves, packed fresh in small batches for your everyday ritual.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 lg:justify-start"
            >
              <a
                href="#shop"
                id="hero-primary-cta"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-tea-green px-8 py-4 text-[15px] sm:text-base font-extrabold tracking-wide text-cream shadow-[0_16px_36px_-10px_rgba(23,107,77,0.55)] transition-all duration-300 hover:bg-tea-deep hover:shadow-[0_20px_42px_-8px_rgba(23,107,77,0.65)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Tea
                  <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
              </a>

              <a
                href="/collections"
                id="hero-secondary-cta"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-tea-green/25 bg-white/80 px-7 py-3.5 text-[15px] sm:text-base font-bold text-tea-green shadow-xs backdrop-blur-sm transition-all duration-300 hover:border-tea-green hover:bg-white hover:text-tea-deep hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Collections</span>
                <span className="text-gold font-bold transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </motion.div>

            {/* Trust Proof Micro-Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.48 }}
              className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft lg:justify-start"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-gold">★</span> 7 Curated Teas
              </span>
              <span className="h-1 w-1 rounded-full bg-ink/25" aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <span className="text-tea-green font-black">✓</span> Whole Flowers, Never Dust
              </span>
              <span className="h-1 w-1 rounded-full bg-ink/25" aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <span>🚚</span> Ships Pan-India
              </span>
            </motion.div>
          </motion.div>

          {/* ==========================================================
              RIGHT / 3D INTERACTIVE PRODUCT STAGE & HERO BOX THEATER
             ========================================================== */}
          <motion.div
            style={reduce ? undefined : { y: stageY }}
            className="relative z-10 w-full"
          >
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative mx-auto w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[600px] h-[490px] sm:h-[550px] lg:h-[600px] select-none"
              style={{ perspective: 1200 }}
            >
              {/* 3D Master Parallax Container */}
              <motion.div
                animate={{
                  rotateX: reduce ? 0 : mouseTilt.rotX,
                  rotateY: reduce ? 0 : mouseTilt.rotY,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                  mass: 0.5,
                }}
                className="relative h-full w-full preserve-3d"
              >
                {/* ── AMBIENT GROUND OCCLUSION SHADOW ── */}
                <motion.div
                  animate={{
                    scale: isOpen ? [1, 1.15, 1.1] : [1.05, 0.95, 1],
                    opacity: isOpen ? 0.38 : 0.28,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="pointer-events-none absolute bottom-[12%] left-1/2 h-[38px] w-[75%] -translate-x-1/2 rounded-[100%] bg-tea-ink/40 blur-2xl"
                  aria-hidden="true"
                />

                {/* ── FLOATING BOTANICAL PETALS ── */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <motion.div
                    animate={{
                      y: isOpen ? [-10, -28, -10] : [-5, -12, -5],
                      x: isOpen ? [-6, -18, -6] : [-2, -6, -2],
                      rotate: isOpen ? [-15, -35, -15] : [-10, -18, -10],
                      opacity: isOpen ? 0.95 : 0.65,
                    }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[12%] top-[14%] w-8 sm:w-9"
                  >
                    <FloatingPetal type="blue-pea" />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: isOpen ? [-8, -24, -8] : [-3, -10, -3],
                      x: isOpen ? [8, 20, 8] : [3, 8, 3],
                      rotate: isOpen ? [20, 45, 20] : [15, 25, 15],
                      opacity: isOpen ? 0.95 : 0.7,
                    }}
                    transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className="absolute right-[16%] top-[10%] w-7 sm:w-8"
                  >
                    <FloatingPetal type="chamomile" />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: isOpen ? [0, -18, 0] : [0, -8, 0],
                      rotate: isOpen ? [40, 20, 40] : [30, 24, 30],
                    }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                    className="absolute left-[6%] top-[45%] w-7 sm:w-8"
                  >
                    <FloatingPetal type="tea-leaf" />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: isOpen ? [6, 20, 6] : [2, 8, 2],
                      x: isOpen ? [8, 16, 8] : [2, 6, 2],
                      rotate: isOpen ? [-25, -45, -25] : [-20, -28, -20],
                    }}
                    transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="absolute right-[14%] bottom-[20%] w-8 sm:w-9"
                  >
                    <FloatingPetal type="hibiscus" />
                  </motion.div>
                </div>

                {/* ── SURROUNDING PRODUCTS COMPOSITION ── */}
                {/* 1. Upper Left Product: Chamomile 50g Jar */}
                <motion.div
                  animate={{
                    x: isOpen ? -18 : 0,
                    y: isOpen ? -14 : 0,
                    rotate: isOpen ? -9 : -6,
                    scale: isOpen ? 1.04 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 85, damping: 15 }}
                  className="absolute left-[1%] sm:left-[4%] top-[12%] sm:top-[13%] z-10 w-[100px] sm:w-[130px] lg:w-[145px]"
                >
                  <div className="relative group cursor-pointer">
                    <Image
                      src="/hero/chamomile-50g-jar-front.png"
                      alt="TMUG Chamomile Flower Tea Jar"
                      width={280}
                      height={280}
                      className="h-auto w-full drop-shadow-[0_18px_24px_rgba(8,42,32,0.22)] transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-tea-ink shadow-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Chamomile 50g
                    </div>
                  </div>
                </motion.div>

                {/* 2. Upper Right Product: Butterfly Pea 100g Pouch */}
                <motion.div
                  animate={{
                    x: isOpen ? 20 : 0,
                    y: isOpen ? -16 : 0,
                    rotate: isOpen ? 9 : 6,
                    scale: isOpen ? 1.04 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 85, damping: 15 }}
                  className="absolute right-[2%] sm:right-[5%] top-[10%] sm:top-[11%] z-10 w-[105px] sm:w-[135px] lg:w-[155px]"
                >
                  <div className="relative group cursor-pointer">
                    <Image
                      src="/hero/butterfly-pea-100g-pouch-front.png"
                      alt="TMUG Blue Butterfly Pea Flower Tea Pouch"
                      width={280}
                      height={280}
                      className="h-auto w-full drop-shadow-[0_20px_28px_rgba(8,42,32,0.25)] transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-tea-ink shadow-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Blue Pea 100g
                    </div>
                  </div>
                </motion.div>

                {/* 3. Lower Left Product: Hibiscus 50g Jar */}
                <motion.div
                  animate={{
                    x: isOpen ? -18 : 0,
                    y: isOpen ? 16 : 0,
                    rotate: isOpen ? -7 : -4,
                    scale: isOpen ? 1.04 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 85, damping: 15 }}
                  className="absolute left-[3%] sm:left-[5%] bottom-[12%] sm:bottom-[14%] z-25 w-[95px] sm:w-[120px] lg:w-[135px]"
                >
                  <div className="relative group cursor-pointer">
                    <Image
                      src="/hero/hibiscus-50g-jar-front.png"
                      alt="TMUG Hibiscus Flower Tea Jar"
                      width={260}
                      height={260}
                      className="h-auto w-full drop-shadow-[0_18px_24px_rgba(8,42,32,0.22)] transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-tea-ink shadow-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Hibiscus 50g
                    </div>
                  </div>
                </motion.div>

                {/* 4. Lower Right Product: Assam Gold 250g Pouch */}
                <motion.div
                  animate={{
                    x: isOpen ? 20 : 0,
                    y: isOpen ? 16 : 0,
                    rotate: isOpen ? 8 : 5,
                    scale: isOpen ? 1.04 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 85, damping: 15 }}
                  className="absolute right-[3%] sm:right-[5%] bottom-[12%] sm:bottom-[13%] z-25 w-[100px] sm:w-[125px] lg:w-[145px]"
                >
                  <div className="relative group cursor-pointer">
                    <Image
                      src="/hero/gold-250g-pouch-front.png"
                      alt="TMUG Assam Gold Tea Pouch"
                      width={260}
                      height={260}
                      className="h-auto w-full drop-shadow-[0_18px_24px_rgba(8,42,32,0.24)] transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-tea-ink shadow-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Assam Gold
                    </div>
                  </div>
                </motion.div>

                {/* ── LIMITED EDITION BADGE (Top Right Floating) ── */}
                <div className="absolute right-[1%] sm:right-[3%] top-[2%] sm:top-[3%] z-30">
                  <LimitedEditionBadge isOpen={isOpen} />
                </div>

                {/* ── FLOATING 3D INFO ELEMENTS ── */}
                {/* Info 1: Top-Left Pill */}
                <div className="absolute left-[1%] sm:left-[3%] top-[4%] sm:top-[5%] z-25">
                  <FloatingInfoCard
                    icon="🌿"
                    title="100% Whole Botanicals"
                    subtitle="Never dust or fannings"
                    isOpen={isOpen}
                    offset={-6}
                  />
                </div>

                {/* Info 2: Right Middle 3D Cube */}
                <motion.div
                  animate={{
                    x: isOpen ? 10 : 0,
                    y: isOpen ? [0, -4, 0] : [0, -2, 0],
                  }}
                  transition={{
                    x: { duration: 0.6, ease: "easeOut" },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute right-[0%] sm:right-[1%] top-[48%] -translate-y-1/2 z-30 hidden sm:block"
                >
                  <Mini3DCube label="7 Artisan Teas" sublabel="Daily Mood Rituals" />
                </motion.div>

                {/* Info 3: Bottom Left Pill */}
                <div className="absolute left-[2%] sm:left-[5%] bottom-[2%] sm:bottom-[3%] z-30">
                  <FloatingInfoCard
                    icon="✨"
                    title="Caffeine-Free Options"
                    subtitle="Blue Pea · Chamomile · Hibiscus"
                    isOpen={isOpen}
                    offset={6}
                  />
                </div>

                {/* ==========================================================
                    CENTRAL 3D HERO PRODUCT BOX — HINGED LID & RISING PRODUCT
                   ========================================================== */}
                <div
                  onClick={toggleBox}
                  className="absolute left-1/2 top-[52%] sm:top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 w-[260px] sm:w-[305px] lg:w-[335px] cursor-pointer"
                  style={{ perspective: 1200 }}
                  title="Click to toggle box reveal"
                >
                  <motion.div
                    animate={{
                      y: isOpen ? [0, -6, 0] : [0, -3, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative w-full h-[330px] sm:h-[370px] preserve-3d"
                  >
                    {/* 1. BACK CAVITY & VELVET LINING (z-index 5) */}
                    <div className="absolute inset-x-0 bottom-0 top-[20%] rounded-3xl border-2 border-[#D8A62A]/50 bg-gradient-to-b from-[#08261C] via-[#0A3326] to-[#061D15] shadow-[0_26px_52px_-12px_rgba(8,42,32,0.5),0_12px_24px_rgba(0,0,0,0.3)] ring-1 ring-gold/25 z-5 overflow-hidden">
                      {/* Golden ambient radial spotlight behind rising items */}
                      <motion.div
                        animate={{
                          opacity: isOpen ? 0.95 : 0.2,
                          scale: isOpen ? 1.25 : 0.85,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(240,186,60,0.5)_0%,rgba(23,107,77,0.2)_50%,transparent_75%)] blur-lg"
                        aria-hidden="true"
                      />
                    </div>

                    {/* 2. THE RISING STAR ITEMS (Kulhad Cup + Butterfly Pea Jar) (z-index 15)
                         When closed: sits down inside behind front face.
                         When open: rises UP +45px out of the box into the open air! */}
                    <motion.div
                      animate={{
                        y: isOpen ? -52 : 36,
                        scale: isOpen ? 1.06 : 0.9,
                        opacity: isOpen ? 1 : 0.7,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 75,
                        damping: 14,
                        mass: 0.6,
                      }}
                      className="absolute inset-x-0 top-[10%] z-15 flex flex-col items-center pointer-events-none"
                    >
                      {/* Main visual duo: Kulhad cup + Jar */}
                      <div className="relative w-full flex items-center justify-center">
                        <KulhadTeaIllustration />

                        {/* Nestled Butterfly Pea Jar next to cup */}
                        <motion.div
                          animate={{
                            x: isOpen ? 46 : 28,
                            y: isOpen ? -10 : 12,
                            rotate: isOpen ? 8 : 4,
                          }}
                          transition={{ type: "spring", stiffness: 75, damping: 14 }}
                          className="absolute z-10 w-[105px] sm:w-[125px] -right-2 top-0"
                        >
                          <Image
                            src="/hero/butterfly-pea-50g-jar-front.png"
                            alt="TMUG Butterfly Pea Jar Revealed"
                            width={260}
                            height={260}
                            className="h-auto w-full drop-shadow-[0_18px_24px_rgba(8,42,32,0.35)]"
                          />
                        </motion.div>
                      </div>

                      {/* Discovery Selection Pill Tag */}
                      <motion.div
                        animate={{
                          opacity: isOpen ? 1 : 0,
                          y: isOpen ? 0 : 10,
                        }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-white/95 px-3 py-1 shadow-md"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-tea-ink">
                          The Discovery Selection
                        </span>
                      </motion.div>
                    </motion.div>

                    {/* 3. 3D HINGED LID (z-index 25)
                         Transform origin top center.
                         When closed: hangs down over top opening.
                         When open: rotates -125deg backwards into depth! */}
                    <motion.div
                      animate={{
                        rotateX: isOpen ? -122 : 0,
                        z: isOpen ? -10 : 15,
                        opacity: isOpen ? 0.65 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 65,
                        damping: 14,
                        mass: 0.8,
                      }}
                      style={{
                        transformOrigin: "top center",
                        transformStyle: "preserve-3d",
                      }}
                      className="absolute inset-x-0 top-[20%] h-[125px] sm:h-[145px] rounded-t-3xl border-2 border-b-0 border-[#D8A62A]/60 bg-gradient-to-b from-[#146247] via-[#0E513B] to-[#0A3D2E] shadow-[0_16px_32px_rgba(0,0,0,0.45)] z-25 overflow-hidden"
                    >
                      <div className="relative h-full w-full p-3 sm:p-4 flex flex-col justify-between">
                        {/* Gold pinstripe & seal ribbon on lid */}
                        <div className="flex items-center justify-between border-b border-gold/30 pb-1.5">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#EFC65E]">
                            ★ SEALED RESERVE ★
                          </span>
                          <span className="text-[8px] font-bold text-cream/75 tracking-wider">
                            EST. 2026
                          </span>
                        </div>

                        {/* Gold Wax Seal Sticker on Lid Face */}
                        <div className="flex items-center justify-center py-1">
                          <div className="flex items-center gap-2 rounded-full border border-gold/70 bg-gradient-to-r from-tea-dark via-[#0E513B] to-tea-dark px-3.5 py-1.5 shadow-inner">
                            <span className="text-[9px] font-black uppercase tracking-wider text-gold">
                              TMUG BOTANICAL GIFT BOX
                            </span>
                          </div>
                        </div>

                        {/* Lid bottom gold bevel reflection */}
                        <div className="h-1 w-full rounded-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                      </div>
                    </motion.div>

                    {/* 4. BOX FRONT FACE WALL (z-index 20)
                         Covers bottom portion so products lift up out of it when open */}
                    <div className="absolute inset-x-0 bottom-0 h-[170px] sm:h-[190px] rounded-b-3xl rounded-t-xl border-2 border-t-0 border-[#D8A62A]/60 bg-gradient-to-b from-[#0B4030] via-[#083023] to-[#051F17] p-3 sm:p-4 text-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.15)] z-20 flex flex-col justify-between">
                      {/* Gold corner filigree marks */}
                      <div className="absolute left-2.5 top-2.5 h-2.5 w-2.5 border-l border-t border-gold/60" />
                      <div className="absolute right-2.5 top-2.5 h-2.5 w-2.5 border-r border-t border-gold/60" />
                      <div className="absolute left-2.5 bottom-2.5 h-2.5 w-2.5 border-l border-b border-gold/60" />
                      <div className="absolute right-2.5 bottom-2.5 h-2.5 w-2.5 border-r border-b border-gold/60" />

                      {/* TMUG Logo Stamp in Gold */}
                      <div className="pt-1 flex items-center justify-center">
                        <Image
                          src="/logo/tmug-logo.png"
                          alt="TMUG Logo"
                          width={95}
                          height={48}
                          className="h-8 sm:h-9 w-auto brightness-200 invert drop-shadow-[0_2px_8px_rgba(216,166,42,0.45)]"
                        />
                      </div>

                      {/* Gold Foil Typography */}
                      <div>
                        <p className="font-display text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.24em] text-gold drop-shadow-xs">
                          THE DISCOVERY COLLECTION
                        </p>
                        <p className="mt-0.5 text-[9px] sm:text-[10px] font-medium tracking-wide text-cream/80">
                          Handcrafted Whole Leaves & Flowers · India
                        </p>
                      </div>

                      {/* Bottom gold seal ribbon */}
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-0.5 text-[8px] font-black uppercase tracking-widest text-[#EFC65E]">
                          ★ 100% WHOLE BOTANICALS ★
                        </span>
                      </div>
                    </div>

                    {/* Interactive state helper badge below box */}
                    <div className="absolute -bottom-8 inset-x-0 text-center z-30">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-tea-green/20 bg-white/75 px-3.5 py-1 text-[10px] font-bold text-tea-ink/80 shadow-xs backdrop-blur-xs transition-colors hover:bg-white hover:text-tea-green">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isOpen ? "bg-tea-green animate-pulse" : "bg-gold"
                          }`}
                        />
                        {isOpen ? "Box Open · Tap to Close" : "✨ Tap to Open Box"}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
