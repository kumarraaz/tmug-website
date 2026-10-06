"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import FloatingLogo from "./motion/FloatingLogo";
import { IconArrowRight } from "./icons";

/**
 * TMUG brand visual — an original editorial tea-ritual illustration.
 *
 * No product packs. A hand-drawn style kulhad cup with rising steam that
 * dissolves into botanical leaves and tiny flowers, floating sprigs, gold
 * accents and a whisper-quiet TMUG watermark. All motion is slow and
 * continuous (steam 7s, float 6–11s, dots 5s) — no spin, no bounce, no 3D.
 */
function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative mx-auto w-[50vw] max-w-[280px] sm:max-w-[340px] lg:w-full lg:max-w-[400px]"
      aria-hidden="true"
    >
      {/* ambient glow behind the cup */}
      <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,166,42,0.18),rgba(23,107,77,0.08)_55%,transparent_70%)] blur-2xl" />
      {/* soft ground shadow */}
      <div className="absolute bottom-[2%] left-1/2 h-[4%] w-[62%] -translate-x-1/2 rounded-[100%] bg-tea-ink/15 blur-xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className={reduce ? undefined : "animate-cup-float"}>
        <svg
          viewBox="0 0 420 470"
          className="h-auto w-full drop-shadow-[0_20px_30px_rgba(8,42,32,0.15)]"
          role="presentation"
          focusable="false"
        >
          <defs>
            {/* Single leaf motif, reused across the composition */}
            <g id="tmug-leaf">
              <path d="M0 0 C 12 -8, 26 -8, 38 2 C 26 10, 12 10, 0 0 Z" fill="#176b4d" />
              <path d="M5 -0.5 C 15 -2.5, 26 -2.5, 33 0.5" stroke="#fff8ea" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </g>
          </defs>

          {/* soft organic green shape behind the illustration */}
          <path
            d="M 215 55 C 305 55, 372 140, 360 245 C 350 340, 285 425, 200 418 C 115 411, 48 335, 58 235 C 68 135, 125 55, 215 55 Z"
            fill="#176b4d"
            opacity="0.07"
          />

          {/* oversized TMUG watermark — very subtle slow drift */}
          <g className={reduce ? undefined : "animate-float-slow"}>
            <text
              x="210"
              y="252"
              textAnchor="middle"
              fontFamily="Bricolage Grotesque, sans-serif"
              fontWeight="800"
              fontSize="74"
              letterSpacing="10"
              fill="#0e513b"
              opacity="0.055"
            >
              TMUG
            </text>
          </g>

          {/* gold accent dots */}
          <g fill="#d8a62a" className={reduce ? undefined : "animate-dot-pulse"}>
            <circle cx="88" cy="150" r="3.5" />
            <circle cx="332" cy="118" r="3" style={{ animationDelay: "1.2s" }} />
            <circle cx="352" cy="300" r="4" style={{ animationDelay: "2.1s" }} />
            <circle cx="70" cy="322" r="3" style={{ animationDelay: "0.6s" }} />
            <circle cx="300" cy="428" r="3" style={{ animationDelay: "3s" }} />
            <circle cx="122" cy="424" r="2.5" style={{ animationDelay: "1.7s" }} />
          </g>

          {/* ── steam: slow continuous rise, staggered ── */}
          <g
            stroke="#176b4d"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className={reduce ? undefined : "animate-steam"}
          >
            <path d="M 188 278 C 180 246, 196 226, 188 196 C 182 174, 190 156, 186 138" />
            <path d="M 212 280 C 220 248, 204 228, 212 198 C 218 176, 210 158, 214 140" style={{ animationDelay: "2.3s" }} />
            <path d="M 234 276 C 228 248, 242 230, 236 202 C 231 182, 238 164, 234 148" style={{ animationDelay: "4.6s" }} />
          </g>

          {/* ── steam dissolving into botanicals ── */}
          <g className={reduce ? undefined : "animate-float-slow"}>
            <use href="#tmug-leaf" transform="translate(148,118) rotate(-24) scale(0.9)" opacity="0.85" />
          </g>
          <g className={reduce ? undefined : "animate-float-slow"} style={{ animationDelay: "1.8s" }}>
            <use href="#tmug-leaf" transform="translate(272,98) rotate(20) scale(0.75)" opacity="0.7" />
          </g>
          <g className={reduce ? undefined : "animate-float"} style={{ animationDelay: "0.9s" }}>
            <use href="#tmug-leaf" transform="translate(214,74) rotate(8) scale(0.6)" opacity="0.6" />
          </g>

          {/* tiny hibiscus-pink blossom */}
          <g
            transform="translate(308,168)"
            className={reduce ? undefined : "animate-float-slow"}
            style={{ animationDelay: "1.2s" }}
          >
            <g fill="#d84f6d" opacity="0.72">
              <ellipse cx="0" cy="-11" rx="6.5" ry="11" />
              <ellipse cx="0" cy="-11" rx="6.5" ry="11" transform="rotate(72)" />
              <ellipse cx="0" cy="-11" rx="6.5" ry="11" transform="rotate(144)" />
              <ellipse cx="0" cy="-11" rx="6.5" ry="11" transform="rotate(216)" />
              <ellipse cx="0" cy="-11" rx="6.5" ry="11" transform="rotate(288)" />
            </g>
            <circle r="4.5" fill="#d8a62a" />
          </g>

          {/* tiny butterfly-pea blue blossom */}
          <g
            transform="translate(112,198) scale(0.7)"
            className={reduce ? undefined : "animate-float"}
            style={{ animationDelay: "2.6s" }}
          >
            <g fill="#4a6fd4" opacity="0.7">
              <ellipse cx="0" cy="-9" rx="5.5" ry="9" />
              <ellipse cx="0" cy="-9" rx="5.5" ry="9" transform="rotate(90)" />
              <ellipse cx="0" cy="-9" rx="5.5" ry="9" transform="rotate(180)" />
              <ellipse cx="0" cy="-9" rx="5.5" ry="9" transform="rotate(270)" />
            </g>
            <circle r="3.5" fill="#d8a62a" />
          </g>

          {/* tiny chamomile daisy */}
          <g
            transform="translate(258,52) scale(0.62)"
            className={reduce ? undefined : "animate-float-slow"}
            style={{ animationDelay: "3.4s" }}
          >
            <g fill="#fffdf7" stroke="#d8a62a" strokeWidth="1.4">
              <ellipse cx="0" cy="-10" rx="4.5" ry="10" />
              <ellipse cx="0" cy="-10" rx="4.5" ry="10" transform="rotate(60)" />
              <ellipse cx="0" cy="-10" rx="4.5" ry="10" transform="rotate(120)" />
              <ellipse cx="0" cy="-10" rx="4.5" ry="10" transform="rotate(180)" />
              <ellipse cx="0" cy="-10" rx="4.5" ry="10" transform="rotate(240)" />
              <ellipse cx="0" cy="-10" rx="4.5" ry="10" transform="rotate(300)" />
            </g>
            <circle r="4" fill="#d8a62a" />
          </g>

          {/* ── floating botanical sprigs flanking the cup ── */}
          <g stroke="#0e513b" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M 96 330 C 92 300, 96 272, 108 250" />
            <path d="M 342 344 C 346 318, 342 296, 332 278" />
          </g>
          <g className={reduce ? undefined : "animate-float-slow"} style={{ animationDelay: "0.5s" }}>
            <use href="#tmug-leaf" transform="translate(97,308) rotate(-52) scale(0.7)" opacity="0.8" />
            <use href="#tmug-leaf" transform="translate(100,284) rotate(-128) scale(0.62)" opacity="0.65" />
            <use href="#tmug-leaf" transform="translate(106,262) rotate(-42) scale(0.55)" opacity="0.6" />
          </g>
          <g className={reduce ? undefined : "animate-float-slow"} style={{ animationDelay: "2.2s" }}>
            <use href="#tmug-leaf" transform="translate(341,322) rotate(52) scale(0.7)" opacity="0.8" />
            <use href="#tmug-leaf" transform="translate(339,300) rotate(128) scale(0.62)" opacity="0.65" />
          </g>
          <circle cx="330" cy="272" r="3.5" fill="#d8a62a" className={reduce ? undefined : "animate-dot-pulse"} />

          {/* ── the kulhad cup ── */}
          <g>
            {/* saucer */}
            <ellipse cx="210" cy="398" rx="118" ry="22" fill="#fffdf7" stroke="#0e513b" strokeWidth="3" />
            <ellipse cx="210" cy="398" rx="78" ry="13" fill="none" stroke="#d8a62a" strokeWidth="2" opacity="0.7" />
            {/* body */}
            <path
              d="M 136 300 C 138 342, 162 380, 210 382 C 258 380, 282 342, 284 300 Z"
              fill="#fffdf7"
              stroke="#0e513b"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* gold band */}
            <path d="M 141 332 C 172 344, 248 344, 279 332" stroke="#d8a62a" strokeWidth="2.5" fill="none" />
            <path d="M 146 346 C 175 357, 245 357, 274 346" stroke="#d8a62a" strokeWidth="2" fill="none" opacity="0.55" />
            {/* tiny sprig motif on the cup */}
            <path d="M 210 372 C 210 364, 210 358, 210 352" stroke="#176b4d" strokeWidth="2" strokeLinecap="round" />
            <use href="#tmug-leaf" transform="translate(208,356) rotate(-32) scale(0.42)" />
            <use href="#tmug-leaf" transform="translate(210,362) rotate(148) scale(0.38)" opacity="0.85" />
            {/* handle */}
            <path d="M 284 316 C 316 318, 320 356, 290 364" stroke="#0e513b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* rim + tea */}
            <ellipse cx="210" cy="300" rx="74" ry="17" fill="#fffdf7" stroke="#0e513b" strokeWidth="3.5" />
            <ellipse cx="210" cy="300" rx="60" ry="12.5" fill="#e8a93d" opacity="0.9" />
          </g>
        </svg>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  // gentle parallax — barely-there drift, never excessive
  const textY = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 48]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_20%_10%,rgba(216,166,42,0.12),transparent),radial-gradient(ellipse_55%_45%_at_85%_85%,rgba(23,107,77,0.08),transparent)]" />
      <FloatingLogo opacity={0.04} size="95%" />

      {/* compact editorial hero: text + visual side-by-side on desktop */}
      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-8 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.78fr] lg:gap-6 lg:pb-14 lg:pt-12">
        <motion.div style={reduce ? undefined : { y: textY }} className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-tea-green/20 bg-white/70 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-tea-green">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              Modern Indian Tea Co.
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-hero-xl mt-5 font-display font-extrabold text-tea-ink"
          >
            Tea, but
            <br />
            make it <span className="text-tea-green">fun.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-base lg:mx-0"
          >
            Colour-changing blue teas, tangy ruby reds and properly kadak chai —
            packed fresh for your everyday ritual.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#shop"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-tea-green px-7 py-3.5 text-[15px] font-extrabold text-cream shadow-[0_14px_30px_-12px_rgba(23,107,77,0.6)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[180%] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-[380%]"
              />
              Shop Tea <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="/collections"
              className="inline-flex items-center gap-2 rounded-full border border-tea-green/25 bg-white/60 px-7 py-3.5 text-[15px] font-bold text-tea-green transition-colors duration-200 hover:border-tea-green/50"
            >
              Explore Collections
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft"
          >
            7 teas · 13 packs · Ships across India
          </motion.p>
        </motion.div>

        <motion.div style={reduce ? undefined : { y: visualY }} className="lg:pl-2">
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
