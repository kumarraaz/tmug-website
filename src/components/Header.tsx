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

/** Slim promo strip above the header. */
export function AnnouncementBar() {
  const { promo } = siteConfig;
  if (!promo.enabled) return null;
  return (
    <div className="relative z-50 bg-tea-ink text-cream">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[13px] font-semibold tracking-wide">
        <span className="inline-block rounded-full bg-gold px-2 py-0.5 text-[11px] font-extrabold text-tea-ink">
          {promo.discountPercent}% OFF
        </span>
        <span>
          Festive offer — apply code <span className="font-extrabold text-gold-soft">{promo.code}</span> in
          your cart
        </span>
      </p>
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
    return () => {
      document.body.style.overflow = "";
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
            scrolled ? "py-1.5" : "py-3"
          }`}
        >
          <Link href="/" aria-label="TMUG — home" className="shrink-0">
            <Image
              src="/logo/tmug-logo.png"
              alt="TMUG logo"
              width={300}
              height={153}
              priority
              className={`h-auto w-auto transition-all duration-300 ${scrolled ? "max-h-8" : "max-h-11"}`}
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
              className="fixed inset-0 z-40 bg-tea-ink/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              aria-label="Mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-tea-deep text-cream shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4">
                <Image src="/logo/tmug-logo.png" alt="TMUG logo" width={140} height={72} className="h-9 w-auto" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full bg-white/10 p-2.5"
                >
                  <IconClose />
                </button>
              </div>
              <div className="nice-scroll flex-1 overflow-y-auto px-5 pb-8">
                <ul className="space-y-1">
                  {[{ label: "Shop", href: "/#shop" }, ...NAV.slice(1)].map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-2xl px-4 py-3.5 font-display text-2xl font-extrabold transition-colors hover:bg-white/10"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <p className="mt-6 px-4 text-xs font-bold uppercase tracking-[0.2em] text-cream/50">
                  Collections
                </p>
                <ul className="mt-2 space-y-1">
                  {COLLECTION_NAV.map((node, i) => (
                    <motion.li
                      key={node.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.04 }}
                    >
                      <Link
                        href={node.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-bold"
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: node.accent ?? "#176B4D" }}
                          aria-hidden="true"
                        />
                        {node.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/10 p-5">
                <Link
                  href="/#shop"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full bg-gold py-3.5 text-center font-extrabold text-tea-ink"
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
