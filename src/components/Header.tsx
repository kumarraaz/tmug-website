"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useShop } from "@/lib/store";
import { IconCart, IconClose, IconMenu, IconSearch } from "./icons";

/** Slim promo strip above the header. */
export function AnnouncementBar() {
  const { promo } = siteConfig;
  if (!promo.enabled) return null;
  return (
    <div className="bg-tea-dark text-cream">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[13px] font-semibold tracking-wide">
        <span className="inline-block rounded bg-gold px-1.5 py-0.5 text-[11px] font-extrabold text-tea-dark">
          {promo.discountPercent}% OFF
        </span>
        <span>
          Festive offer — apply code <span className="font-extrabold text-gold-soft">{promo.code}</span> in
          your cart for {promo.discountPercent}% off
        </span>
      </p>
    </div>
  );
}

export default function Header() {
  const { count, setCartOpen, setSearchOpen } = useShop();
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 12,
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-tea-green text-cream transition-all duration-300 ${
        scrolled ? "shadow-[0_8px_30px_rgba(18,43,15,0.35)]" : "shadow-none"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        {/* Logo */}
        <a href="#top" aria-label="TMUG — home" className="shrink-0">
          <Image
            src="/logo/tmug-logo.png"
            alt="TMUG logo"
            width={300}
            height={153}
            priority
            className={`h-auto w-auto transition-all duration-300 ${scrolled ? "max-h-9" : "max-h-11"}`}
          />
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-cream/85 transition-colors hover:bg-white/10 hover:text-cream"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search teas"
            className="rounded-full p-2.5 text-cream/90 transition-colors hover:bg-white/10 hover:text-cream"
          >
            <IconSearch />
          </button>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${count} items`}
            className="relative rounded-full p-2.5 text-cream/90 transition-colors hover:bg-white/10 hover:text-cream"
          >
            <IconCart />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-extrabold text-tea-dark"
                >
                  {count > 99 ? "99+" : count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="rounded-full p-2.5 text-cream/90 transition-colors hover:bg-white/10 md:hidden"
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <ul className="space-y-1 px-4 py-4">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-cream/90 transition-colors hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
