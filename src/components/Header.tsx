"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { COLLECTION_NAV } from "@/data/collections";
import { useShop } from "@/lib/store";
import { IconArrowRight, IconCart, IconClose, IconMenu, IconSearch } from "./icons";

const NAV = [
  { label: "Shop", href: "/#shop" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/** Slim promo ticker above the header — gentle continuous marquee. */
export function AnnouncementBar() {
  const { promo } = siteConfig;
  if (!promo.enabled) return null;
  const items = [
    `Festive offer — ${promo.discountPercent}% off with code ${promo.code}`,
    "Whole flowers & leaves, never dust",
    "Ships across India",
    "Order easily on WhatsApp",
  ];
  const row = [...items, ...items, ...items, ...items]; // 4 copies; -50% loop stays seamless
  return (
    <div className="relative z-50 overflow-hidden bg-tea-ink py-1.5 text-cream" aria-label="Announcements">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8 motion-reduce:animate-none">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap text-[12px] font-semibold tracking-wide" aria-hidden={i >= items.length}>
            <span>
              {t.includes(promo.code) ? (
                <>
                  Festive offer — {promo.discountPercent}% off with code{" "}
                  <span className="font-extrabold text-gold-soft">{promo.code}</span>
                </>
              ) : (
                t
              )}
            </span>
            <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Collections mega-dropdown (desktop). */
function CollectionsDropdown() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        onFocus={enter}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
          open ? "bg-white/15 text-cream" : "text-cream/85 hover:bg-white/10 hover:text-cream"
        }`}
      >
        Collections
        <motion.svg
          viewBox="0 0 24 24"
          animate={{ rotate: open ? 180 : 0 }}
          className="h-3.5 w-3.5 fill-none stroke-current stroke-2"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-3xl bg-cream-light p-3 shadow-[0_30px_70px_-15px_rgba(8,42,32,0.5)] ring-1 ring-ink/10">
              <div className="grid grid-cols-2 gap-1">
                {COLLECTION_NAV.map((node) => (
                  <div key={node.label} className="rounded-2xl p-2 transition-colors hover:bg-tea-green/5">
                    <Link
                      href={node.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2 py-1.5"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: node.accent ?? "#176B4D" }}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-extrabold text-ink">{node.label}</span>
                      <IconArrowRight className="ml-auto h-3.5 w-3.5 text-ink/30" />
                    </Link>
                    {node.children && (
                      <ul className="ml-5 mt-0.5 space-y-0.5 border-l-2 border-ink/8 pl-3">
                        {node.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-2 py-1.5 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-white hover:text-tea-green"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const { count, cartPulse, setCartOpen, setSearchOpen } = useShop();
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 12,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onDesktop);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-tea-deep/95 text-cream backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-[0_10px_40px_rgba(8,42,32,0.45)]" : "shadow-none"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 ${
            scrolled ? "py-1" : "py-2"
          }`}
        >
          <Link href="/" aria-label="TMUG — home" className="shrink-0">
            <Image
              src="/logo/tmug-logo.png"
              alt="TMUG logo"
              width={300}
              height={153}
              priority
              className={`h-auto w-auto transition-all duration-300 ${scrolled ? "max-h-7" : "max-h-9"}`}
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            <Link
              href="/#shop"
              className="rounded-full px-4 py-2 text-sm font-bold text-cream/85 transition-colors hover:bg-white/10 hover:text-cream"
            >
              Shop
            </Link>
            <CollectionsDropdown />
            {NAV.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors hover:bg-white/10 hover:text-cream ${
                  pathname === item.href ? "bg-white/15 text-cream" : "text-cream/85"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search teas"
              className="rounded-full p-2.5 text-cream/90 transition-all hover:rotate-12 hover:bg-white/10 hover:text-cream"
            >
              <IconSearch />
            </button>
            <button
              id="cart-button"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${count} items`}
              className="relative rounded-full p-2.5 text-cream/90 transition-colors hover:bg-white/10 hover:text-cream"
            >
              <motion.span
                key={cartPulse}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="block"
              >
                <IconCart />
              </motion.span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={`badge-${count}`}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-extrabold text-tea-ink"
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
              className="rounded-full p-2.5 text-cream/90 transition-colors hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-tea-ink/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              aria-label="Mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-[85%] max-w-sm flex-col bg-cream-light text-ink shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3.5">
                <Image src="/logo/tmug-logo.png" alt="TMUG logo" width={140} height={72} className="h-8 w-auto rounded-lg bg-tea-deep px-2 py-1" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full bg-ink/5 p-2.5 text-ink transition-colors hover:bg-ink/10"
                >
                  <IconClose />
                </button>
              </div>
              <div className="nice-scroll flex-1 overflow-y-auto px-5 pb-6 pt-2">
                <ul className="space-y-0.5">
                  {[{ label: "Shop", href: "/#shop" }, ...NAV.slice(1)].map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.04, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-2xl px-4 py-3 font-display text-[22px] font-extrabold text-tea-ink transition-colors hover:bg-tea-green/5"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <p className="mt-5 px-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-soft">
                  Collections
                </p>
                <ul className="mt-2 grid grid-cols-2 gap-1.5">
                  {COLLECTION_NAV.map((node, i) => (
                    <motion.li
                      key={node.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18 + i * 0.03, duration: 0.25 }}
                    >
                      <Link
                        href={node.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-2xl border border-ink/8 bg-white px-3 py-2.5 text-[13px] font-bold text-ink"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: node.accent ?? "#176B4D" }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{node.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-ink/8 p-4">
                <Link
                  href="/#shop"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full bg-tea-green py-3 text-center text-[15px] font-extrabold text-cream transition-transform duration-200 active:scale-[0.98]"
                >
                  Shop Tea
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
