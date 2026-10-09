"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { COLLECTION_NAV } from "@/data/collections";
import { useShop } from "@/lib/store";
import { useSiteControls } from "@/lib/site-controls-context";
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
  const { controls } = useSiteControls();
  const header = controls?.header;

  if (header?.showAnnouncement === false) return null;
  if (!promo.enabled && !header?.announcementText) return null;

  const defaultItems = [
    `Festive offer — ${promo.discountPercent}% off with code ${promo.code}`,
    "Whole flowers & leaves, never dust",
    "Ships across India",
    "Order easily on WhatsApp",
  ];
  const items = header?.announcementText ? [header.announcementText, ...defaultItems.slice(1)] : defaultItems;
  const row = [...items, ...items, ...items, ...items]; // 4 copies; -50% loop stays seamless

  return (
    <div
      className="relative z-50 overflow-hidden border-b border-white/5 py-1.5 transition-colors duration-300"
      style={{
        backgroundColor: header?.announcementBg || "#3A3438",
        color: header?.announcementTextColor || "#FFF7EF",
      }}
      aria-label="Announcements"
    >
      <div className="flex w-max animate-marquee items-center gap-8 pr-8 motion-reduce:animate-none">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap text-[12px] font-semibold tracking-wide"
            aria-hidden={i >= items.length}
          >
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
  const { controls } = useSiteControls();
  const header = controls?.header;

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
        style={{
          fontSize: header?.navFontSize ? `${header.navFontSize}px` : undefined,
        }}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[16px] xl:text-[17px] font-semibold tracking-normal transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold ${
          open
            ? "bg-white/15 text-tea-gold ring-1 ring-white/20"
            : "text-warm-ivory/90 hover:bg-white/10 hover:text-tea-gold"
        }`}
      >
        Collections
        <motion.svg
          viewBox="0 0 24 24"
          animate={{ rotate: open ? 180 : 0 }}
          className="h-4 w-4 fill-none stroke-current stroke-2"
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
            className="absolute left-1/2 top-full z-50 w-[580px] -translate-x-1/2 pt-3"
          >
            <div
              className="overflow-hidden rounded-3xl p-4 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] ring-1 ring-charcoal/10"
              style={{
                backgroundColor: header?.dropdownBg || "#FFFFFF",
                color: header?.dropdownTextColor || "#3A3438",
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                {COLLECTION_NAV.map((node) => (
                  <div key={node.label} className="rounded-2xl p-2.5 transition-colors hover:bg-warm-surface/60">
                    <Link
                      href={node.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: node.accent ?? "#D8A33E" }}
                        aria-hidden="true"
                      />
                      <span className="text-[15px] font-extrabold text-charcoal">{node.label}</span>
                      <IconArrowRight className="ml-auto h-4 w-4 text-charcoal/40" />
                    </Link>
                    {node.children && (
                      <ul className="ml-5 mt-1 space-y-0.5 border-l-2 border-charcoal/10 pl-3">
                        {node.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-2 py-1 text-[13px] font-semibold text-charcoal/70 transition-colors hover:bg-white hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold"
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
  const { controls } = useSiteControls();
  const h = controls?.header;

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    setScrolled(window.scrollY > 12);
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
        style={{
          backgroundColor: h?.background || "#3A3438",
          color: h?.textColor || "#FFF7EF",
        }}
        className={`${
          h?.sticky !== false ? "sticky top-0 z-40" : "relative z-40"
        } backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
          scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.25)]" : "shadow-none"
        }`}
      >
        <div
          style={{
            minHeight: scrolled
              ? `${h?.heightMobile || 60}px`
              : `${h?.heightDesktop || 72}px`,
          }}
          className={`mx-auto grid w-full max-w-7xl grid-cols-2 items-center px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:px-10 xl:px-12 transition-all duration-300 ${
            scrolled ? "py-2 sm:py-2.5" : "py-3.5 sm:py-4"
          }`}
        >
          {/* Left Zone: TMUG Brand Logo */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              aria-label="TMUG — home"
              className="shrink-0 flex items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold rounded-lg"
            >
              <Image
                src="/logo/tmug-logo.png"
                alt="TMUG logo"
                width={300}
                height={153}
                priority
                style={{
                  maxHeight: scrolled
                    ? `${Math.max(28, (h?.logoHeight || 44) - 6)}px`
                    : `${h?.logoHeight || 44}px`,
                }}
                className="h-auto w-auto object-contain transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
              />
            </Link>
          </div>

          {/* Centre Zone: Balanced Desktop Navigation */}
          <nav
            aria-label="Primary"
            style={{
              gap: h?.navGap ? `${h.navGap}px` : undefined,
            }}
            className="hidden items-center justify-center gap-6 xl:gap-8 lg:flex"
          >
            <Link
              href="/#shop"
              style={{
                fontSize: h?.navFontSize ? `${h.navFontSize}px` : undefined,
              }}
              className="rounded-full px-3.5 py-1.5 text-[16px] xl:text-[17px] font-semibold tracking-normal text-warm-ivory/90 transition-colors hover:bg-white/10 hover:text-tea-gold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold"
            >
              Shop
            </Link>
            <CollectionsDropdown />
            {NAV.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: h?.navFontSize ? `${h.navFontSize}px` : undefined,
                }}
                className={`rounded-full px-3.5 py-1.5 text-[16px] xl:text-[17px] font-semibold tracking-normal transition-colors hover:bg-white/10 hover:text-tea-gold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold ${
                  pathname === item.href
                    ? "bg-white/10 text-tea-gold ring-1 ring-white/15"
                    : "text-warm-ivory/90"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Zone: Search, Shopping Cart & Mobile Menu */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search teas"
              className="rounded-full p-2.5 text-warm-ivory/90 transition-colors hover:bg-white/10 hover:text-tea-gold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold"
            >
              <IconSearch className="h-5 w-5" />
            </button>
            <button
              id="cart-button"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${count} items`}
              className="relative rounded-full p-2.5 text-warm-ivory/90 transition-colors hover:bg-white/10 hover:text-tea-gold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold"
            >
              <motion.span
                key={cartPulse}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="block"
              >
                <IconCart className="h-5 w-5" />
              </motion.span>
              <AnimatePresence>
                {mounted && count > 0 && (
                  <motion.span
                    key={`badge-${count}`}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    style={{
                      backgroundColor: h?.cartBadgeBg || "#FFF183",
                      color: h?.cartBadgeText || "#3A3438",
                    }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-black shadow-xs"
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
              className="rounded-full p-2.5 text-warm-ivory/90 transition-colors hover:bg-white/10 hover:text-tea-gold lg:hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold"
            >
              {menuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-charcoal/70 backdrop-blur-xs lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              aria-label="Mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                backgroundColor: h?.background || "#3A3438",
                color: h?.textColor || "#FFF7EF",
              }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-[85%] max-w-sm flex-col shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <Image
                  src="/logo/tmug-logo.png"
                  alt="TMUG logo"
                  width={140}
                  height={72}
                  className="h-9 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full bg-white/10 p-2.5 text-warm-ivory transition-colors hover:bg-white/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold"
                >
                  <IconClose className="h-5 w-5" />
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
                        className="block rounded-2xl px-4 py-3 font-display text-[20px] font-extrabold transition-colors hover:bg-white/10 hover:text-tea-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <p className="mt-6 px-4 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
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
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] font-bold transition-colors hover:border-tea-gold hover:text-tea-gold shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-gold"
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: node.accent ?? "#D8A33E" }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{node.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/10 p-5">
                <Link
                  href="/#shop"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full bg-tea-gold py-3.5 text-center text-sm font-black text-charcoal shadow-md transition-all hover:bg-fawn hover:scale-[1.01] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
