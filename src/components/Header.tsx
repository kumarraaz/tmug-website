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
    <div className="relative z-50 overflow-hidden bg-charcoal py-1.5 text-warm-ivory" aria-label="Announcements">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8 motion-reduce:animate-none">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap text-[12px] font-semibold tracking-wide" aria-hidden={i >= items.length}>
            <span>
              {t.includes(promo.code) ? (
                <>
                  Festive offer — {promo.discountPercent}% off with code{" "}
                  <span className="font-extrabold text-tea-gold">{promo.code}</span>
                </>
              ) : (
                t
              )}
            </span>
            <span className="h-1 w-1 rounded-full bg-tea-gold" aria-hidden="true" />
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
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
          open
            ? "bg-warm-surface text-charcoal ring-1 ring-charcoal/15"
            : "text-charcoal/85 hover:bg-warm-surface/80 hover:text-coral"
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
            <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-[0_30px_70px_-15px_rgba(39,35,41,0.25)] ring-1 ring-charcoal/10">
              <div className="grid grid-cols-2 gap-1">
                {COLLECTION_NAV.map((node) => (
                  <div key={node.label} className="rounded-2xl p-2 transition-colors hover:bg-warm-surface/60">
                    <Link
                      href={node.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2 py-1.5"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: node.accent ?? "#D9A441" }}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-extrabold text-charcoal">{node.label}</span>
                      <IconArrowRight className="ml-auto h-3.5 w-3.5 text-charcoal/30" />
                    </Link>
                    {node.children && (
                      <ul className="ml-5 mt-0.5 space-y-0.5 border-l-2 border-charcoal/10 pl-3">
                        {node.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-2 py-1.5 text-[13px] font-semibold text-charcoal/70 transition-colors hover:bg-white hover:text-coral"
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
        className={`sticky top-0 z-40 bg-warm-ivory/95 lg:bg-white/95 text-charcoal backdrop-blur-md border-b border-charcoal/8 transition-all duration-300 ${
          scrolled ? "shadow-[0_8px_30px_rgba(39,35,41,0.08)]" : "shadow-none"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 ${
            scrolled ? "py-1.5" : "py-2.5"
          }`}
        >
          <Link href="/" aria-label="TMUG — home" className="shrink-0">
            <Image
              src="/logo/tmug-logo.png"
              alt="TMUG logo"
              width={300}
              height={153}
              priority
              className={`h-auto w-auto transition-all duration-300 ${scrolled ? "max-h-8" : "max-h-10"}`}
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <Link
              href="/#shop"
              className="rounded-full px-4 py-2 text-sm font-bold text-charcoal/85 transition-colors hover:bg-warm-surface/80 hover:text-coral"
            >
              Shop
            </Link>
            <CollectionsDropdown />
            {NAV.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors hover:bg-warm-surface/80 hover:text-coral ${
                  pathname === item.href ? "bg-warm-surface text-charcoal ring-1 ring-charcoal/10" : "text-charcoal/85"
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
              className="rounded-full p-2.5 text-charcoal/90 transition-all hover:bg-warm-surface hover:text-coral cursor-pointer"
            >
              <IconSearch />
            </button>
            <button
              id="cart-button"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${count} items`}
              className="relative rounded-full p-2.5 text-charcoal/90 transition-colors hover:bg-warm-surface hover:text-coral cursor-pointer"
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
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-tea-gold px-1 text-[11px] font-black text-charcoal shadow-xs"
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
              className="rounded-full p-2.5 text-charcoal/90 transition-colors hover:bg-warm-surface lg:hidden cursor-pointer"
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
              className="fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-xs lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              aria-label="Mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-[85%] max-w-sm flex-col bg-warm-ivory text-charcoal shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
                <Image src="/logo/tmug-logo.png" alt="TMUG logo" width={140} height={72} className="h-8 w-auto" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full bg-charcoal/5 p-2.5 text-charcoal transition-colors hover:bg-charcoal/10 cursor-pointer"
                >
                  <IconClose />
                </button>
              </div>
              <div className="nice-scroll flex-1 overflow-y-auto px-5 pb-6 pt-3">
                <ul className="space-y-1">
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
                        className="block rounded-2xl px-4 py-3 font-display text-[20px] font-extrabold text-charcoal transition-colors hover:bg-warm-surface hover:text-coral"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <p className="mt-6 px-4 text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/60">
                  Collections
                </p>
                <ul className="mt-2 grid grid-cols-2 gap-2">
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
                        className="flex items-center gap-2 rounded-2xl border border-charcoal/10 bg-white px-3 py-2.5 text-[13px] font-bold text-charcoal transition-colors hover:border-tea-gold hover:text-coral shadow-xs"
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: node.accent ?? "#D9A441" }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{node.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-charcoal/10 p-5">
                <Link
                  href="/#shop"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full bg-charcoal py-3.5 text-center text-sm font-black text-white shadow-md transition-all hover:bg-tea-gold hover:text-charcoal active:scale-[0.98]"
                >
                  Shop Pure Teas
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
