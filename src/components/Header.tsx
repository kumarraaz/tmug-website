"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/lib/store";
import { siteConfig } from "@/config/site";

// ── SVG Icons ───────────────────────────────────────────────────────────────

function IconLeaf({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3C11.5 3 4 10.5 4 20c3.5-1 7-3 9.5-5.5 3.5-3.5 5.5-8 7.5-11.5z" />
      <path d="M4 20c2-5 6-9 11-12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function IconGift({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function IconDeliveryTruck({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8h3m-3 4h2" />
      <rect x="5" y="6" width="10" height="10" rx="1" />
      <path d="M15 9h4l3 3.5V16h-7V9z" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function IconShoppingCart({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2.5l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h9.2a1.5 1.5 0 0 0 1.5-1.2L21.5 8H6" />
    </svg>
  );
}

function IconUserCircle({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="9" r="3" />
      <path d="M6.5 18.5a6.5 6.5 0 0 1 11 0" />
    </svg>
  );
}

function IconClose({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function IconMenu({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

// ── Announcement Bar ─────────────────────────────────────────────────────────

export function AnnouncementBar() {
  const marqueeItems = [
    {
      icon: "leaf",
      content: (
        <>
          Get <strong className="font-extrabold">10% OFF</strong> on your first order
        </>
      ),
    },
    {
      icon: "gift",
      content: (
        <>
          <strong className="font-extrabold">Free Shipping</strong> on orders above ₹499
        </>
      ),
    },
    {
      icon: "leaf",
      content: <strong className="font-bold">Pure. Natural. Refreshing.</strong>,
    },
    {
      icon: "gift",
      content: (
        <>
          <strong className="font-extrabold">Special Offers</strong> on Tea Combos
        </>
      ),
    },
    {
      icon: "leaf",
      content: (
        <>
          Get <strong className="font-extrabold">10% OFF</strong> on your first order
        </>
      ),
    },
  ];

  // Quadruple items to ensure seamless infinite looping with -50% CSS keyframe
  const repeatedItems = [
    ...marqueeItems,
    ...marqueeItems,
    ...marqueeItems,
    ...marqueeItems,
  ];

  return (
    <aside
      aria-label="Announcements"
      className="relative z-50 flex h-8 w-full items-center overflow-hidden border-b border-[#E8D47A]/40 bg-[#F6E596] text-[#144E25]"
    >
      {/* Decorative Left Arrow Button */}
      <div className="absolute left-2 z-10 hidden sm:flex items-center text-[#144E25]/80 pointer-events-none">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      {/* Continuous Marquee Rail */}
      <div className="flex w-max animate-marquee items-center gap-7 px-4 motion-reduce:animate-none">
        {repeatedItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 whitespace-nowrap text-[11px] sm:text-[12px] font-medium tracking-wide text-[#144E25]"
          >
            {item.icon === "leaf" ? (
              <IconLeaf className="h-3.5 w-3.5 shrink-0 text-[#144E25]" />
            ) : (
              <IconGift className="h-3.5 w-3.5 shrink-0 text-[#144E25]" />
            )}
            <span>{item.content}</span>
            <span className="mx-2 text-[#144E25]/40 select-none font-light">|</span>
          </div>
        ))}
      </div>

      {/* Decorative Right Arrow Button */}
      <div className="absolute right-2 z-10 hidden sm:flex items-center text-[#144E25]/80 pointer-events-none">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </aside>
  );
}

// ── Bestseller Dropdown ──────────────────────────────────────────────────────

interface BestsellerItem {
  id: string;
  name: string;
  price: number;
  weight: string;
  slug: string;
  image: string;
}

const BESTSELLER_PRODUCTS: BestsellerItem[] = [
  {
    id: "butterfly-pea",
    name: "Butterfly Pea Flower Tea",
    price: 99,
    weight: "50g Jar",
    slug: "butterfly-pea-flower-tea",
    image: "/hero/butterfly-pea-50g-jar-front.png",
  },
  {
    id: "chamomile",
    name: "Chamomile Flower Tea",
    price: 129,
    weight: "50g Jar",
    slug: "chamomile-flower-tea",
    image: "/products/chamomile-50g-jar-front.png",
  },
  {
    id: "hibiscus",
    name: "Hibiscus Flower Tea",
    price: 119,
    weight: "50g Jar",
    slug: "hibiscus-flower-tea",
    image: "/hero/hibiscus-50g-jar-front.png",
  },
  {
    id: "gold-tea",
    name: "Assam Gold CTC Tea",
    price: 399,
    weight: "250g Pouch",
    slug: "gold-tea",
    image: "/hero/gold-250g-pouch-front.png",
  },
];

function BestsellerDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute left-1/2 top-full z-50 w-[640px] max-w-[94vw] -translate-x-1/2 pt-3"
        >
          <div className="overflow-hidden rounded-2xl border border-[#FBBF24]/30 bg-[#0E3A1A] p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="inline-block rounded-full bg-[#FBBF24] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#144E25]">
                  Top Bestsellers
                </span>
                <p className="mt-1 text-sm font-extrabold text-white">
                  Our Community&apos;s Favorite Blends
                </p>
              </div>
              <Link
                href="/#shop"
                onClick={onClose}
                className="text-xs font-bold text-[#FBBF24] hover:underline"
              >
                View all in Shop →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BESTSELLER_PRODUCTS.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  onClick={onClose}
                  className="group flex flex-col items-center rounded-xl bg-white p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-20 w-20 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="mt-2 line-clamp-1 text-[11px] font-bold text-[#144E25] group-hover:text-[#D97706]">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-charcoal/60">{item.weight}</p>
                  <p className="mt-1 text-xs font-black text-charcoal">₹{item.price}</p>
                  <span className="mt-2 inline-block rounded-full bg-[#144E25] px-2.5 py-0.5 text-[9px] font-extrabold text-[#FBBF24] transition-colors group-hover:bg-[#FBBF24] group-hover:text-[#144E25]">
                    Order →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Track Order Modal ───────────────────────────────────────────────────────

function TrackOrderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [orderQuery, setOrderQuery] = useState("");

  if (!isOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = orderQuery
      ? `Hi TMUG, I would like to track my order: ${orderQuery}`
      : "Hi TMUG, I would like to track my recent tea order.";
    const url = `https://wa.me/918130707344?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-1.5 text-charcoal/60 hover:bg-gray-100"
        >
          <IconClose className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#144E25]/10 text-[#144E25]">
            <IconDeliveryTruck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-black text-[#144E25]">Track Your Shipment</h3>
            <p className="text-xs text-charcoal/70">Real-time dispatch &amp; courier tracking</p>
          </div>
        </div>

        <form onSubmit={handleTrackSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/70">
              Order ID or Phone Number
            </label>
            <input
              type="text"
              placeholder="e.g. TMUG-10842 or 9876543210"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="mt-1 w-full rounded-xl border border-charcoal/20 px-3.5 py-2 text-sm font-medium focus:border-[#144E25] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#144E25] py-2.5 text-xs font-black uppercase tracking-wider text-[#FBBF24] shadow-md transition-all hover:bg-[#0E3A1A] cursor-pointer"
          >
            Track with WhatsApp Concierge →
          </button>
        </form>

        <p className="mt-3 text-center text-[10px] text-charcoal/50">
          Orders are delivered across India within 3–5 business days.
        </p>
      </div>
    </div>
  );
}

// ── Customer Account Popover ────────────────────────────────────────────────

function AccountPopover({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0E3A1A] p-3 text-white shadow-2xl">
      <p className="border-b border-white/10 pb-2 text-[11px] font-black uppercase tracking-widest text-[#FBBF24]">
        Account &amp; Assistance
      </p>
      <div className="mt-2 space-y-1">
        <Link
          href="/admin/login"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 hover:text-[#FBBF24]"
        >
          <span>Admin Portal</span>
          <span className="text-[10px] text-[#FBBF24]">→</span>
        </Link>
        <Link
          href="/contact"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 hover:text-[#FBBF24]"
        >
          <span>Help &amp; Support</span>
        </Link>
        <a
          href="https://wa.me/918130707344?text=Hi%20TMUG%2C%20I%20need%20help%20with%20my%20order."
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 hover:text-[#FBBF24]"
        >
          <span>WhatsApp Concierge</span>
        </a>
      </div>
    </div>
  );
}

// ── Main Header Navbar ──────────────────────────────────────────────────────

export default function Header() {
  const { count, setCartOpen } = useShop();
  const [mounted, setMounted] = useState(false);
  const [bestsellerOpen, setBestsellerOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileBestsellerAccordion, setMobileBestsellerAccordion] = useState(false);
  const bestsellerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleBestsellerEnter = () => {
    if (bestsellerTimer.current) clearTimeout(bestsellerTimer.current);
    setBestsellerOpen(true);
  };

  const handleBestsellerLeave = () => {
    bestsellerTimer.current = setTimeout(() => {
      setBestsellerOpen(false);
    }, 150);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full shadow-md">
        {/* 1. Main Navbar */}
        <nav
          aria-label="Main Navigation"
          className="relative z-40 w-full bg-[#144E25] text-white"
        >
          <div className="mx-auto flex h-[68px] sm:h-[74px] max-w-[1560px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
            {/* ── Left: TMUG Brand Logo ─────────────────────────────────── */}
            <div className="flex shrink-0 items-center">
              <Link
                href="/"
                aria-label="TMUG Homepage"
                className="flex items-center transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24]"
              >
                <Image
                  src="/logo/tmug-logo.png"
                  alt="TMUG logo"
                  width={240}
                  height={120}
                  priority
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </Link>
            </div>

            {/* ── Middle: Exact Navigation Links (Desktop) ─────────────── */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-8 text-[12px] xl:text-[13px] font-bold uppercase tracking-[0.08em]">
              {/* BESTSELLER with active indicator and dropdown */}
              <div
                className="relative"
                onMouseEnter={handleBestsellerEnter}
                onMouseLeave={handleBestsellerLeave}
              >
                <button
                  type="button"
                  onClick={() => setBestsellerOpen((v) => !v)}
                  aria-expanded={bestsellerOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1 text-[#FBBF24] hover:text-[#FDE047] transition-colors cursor-pointer py-1"
                >
                  <span>BESTSELLER</span>
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      bestsellerOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {/* Active Underline matching reference */}
                <div className="h-[2.5px] w-full bg-[#FBBF24] rounded-full mt-0.5" />

                <BestsellerDropdown
                  isOpen={bestsellerOpen}
                  onClose={() => setBestsellerOpen(false)}
                />
              </div>

              {/* NEW ARRIVALS */}
              <Link
                href="/collections"
                className="text-white hover:text-[#FBBF24] transition-colors py-1"
              >
                NEW ARRIVALS
              </Link>

              {/* COMBO */}
              <Link
                href="/#shop"
                className="text-white hover:text-[#FBBF24] transition-colors py-1"
              >
                COMBO
              </Link>

              {/* CORPORATE GIFTING */}
              <Link
                href="/contact?topic=corporate"
                className="text-white hover:text-[#FBBF24] transition-colors py-1"
              >
                CORPORATE GIFTING
              </Link>

              {/* ABOUT US */}
              <Link
                href="/about"
                className="text-white hover:text-[#FBBF24] transition-colors py-1"
              >
                ABOUT US
              </Link>

              {/* BLOG */}
              <Link
                href="/about#story"
                className="text-white hover:text-[#FBBF24] transition-colors py-1"
              >
                BLOG
              </Link>

              {/* CONTACT */}
              <Link
                href="/contact"
                className="text-white hover:text-[#FBBF24] transition-colors py-1"
              >
                CONTACT
              </Link>
            </div>

            {/* ── Right: Actions in Exact Order ───────────────────────── */}
            <div className="flex items-center gap-3 sm:gap-4.5 xl:gap-6">
              {/* 1. Shipment Tracking / Delivery Truck Icon */}
              <button
                type="button"
                onClick={() => setTrackModalOpen(true)}
                title="Track Shipment"
                aria-label="Track Shipment"
                className="text-white hover:text-[#FBBF24] transition-colors cursor-pointer p-1"
              >
                <IconDeliveryTruck className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
              </button>

              {/* 2. Shopping Cart Icon */}
              <button
                type="button"
                id="cart-button"
                onClick={() => setCartOpen(true)}
                title="Open Cart"
                aria-label={mounted ? `Open Cart (${count} items)` : "Open Cart"}
                className="relative text-white hover:text-[#FBBF24] transition-colors cursor-pointer p-1"
              >
                <IconShoppingCart className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                {mounted && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#FBBF24] px-1 text-[10px] font-black text-[#144E25] shadow-xs">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>

              {/* 3. Customer Account / Profile Icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  title="My Account"
                  aria-label="Customer Account"
                  className="text-white hover:text-[#FBBF24] transition-colors cursor-pointer p-1"
                >
                  <IconUserCircle className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </button>
                <AccountPopover
                  isOpen={accountOpen}
                  onClose={() => setAccountOpen(false)}
                />
              </div>

              {/* 4. Thin Vertical Separator */}
              <div className="hidden sm:block h-5 w-px bg-white/30 select-none" aria-hidden="true" />

              {/* 5. SHOP ALL Yellow Pill Button */}
              <Link
                href="/#shop"
                className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] px-5 py-2 text-xs font-black tracking-wider uppercase text-[#144E25] shadow-sm transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                SHOP ALL
              </Link>

              {/* Mobile Menu Hamburger Button */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="text-white hover:text-[#FBBF24] p-1 lg:hidden cursor-pointer"
              >
                {menuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Navigation Drawer ────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden"
            />
            <motion.nav
              aria-label="Mobile Navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-[85%] max-w-sm flex-col bg-[#144E25] text-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <Image
                  src="/logo/tmug-logo.png"
                  alt="TMUG"
                  width={140}
                  height={70}
                  className="h-9 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <IconClose className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {/* Mobile BESTSELLER Accordion */}
                <div className="rounded-xl border border-white/10 bg-black/15 p-3">
                  <button
                    type="button"
                    onClick={() => setMobileBestsellerAccordion((v) => !v)}
                    className="flex w-full items-center justify-between text-left text-sm font-black uppercase text-[#FBBF24]"
                  >
                    <span>BESTSELLER</span>
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        mobileBestsellerAccordion ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileBestsellerAccordion && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-white/10">
                      {BESTSELLER_PRODUCTS.map((item) => (
                        <Link
                          key={item.id}
                          href={`/products/${item.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
                        >
                          <div className="relative h-10 w-10 shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-white">{item.name}</p>
                            <p className="text-[10px] text-[#FBBF24]">₹{item.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/collections"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-[#FBBF24]"
                >
                  NEW ARRIVALS
                </Link>

                <Link
                  href="/#shop"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-[#FBBF24]"
                >
                  COMBO
                </Link>

                <Link
                  href="/contact?topic=corporate"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-[#FBBF24]"
                >
                  CORPORATE GIFTING
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-[#FBBF24]"
                >
                  ABOUT US
                </Link>

                <Link
                  href="/about#story"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-[#FBBF24]"
                >
                  BLOG
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-[#FBBF24]"
                >
                  CONTACT
                </Link>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setTrackModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"
                  >
                    <IconDeliveryTruck className="h-4 w-4 text-[#FBBF24]" />
                    <span>Track Shipment</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 p-5">
                <Link
                  href="/#shop"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-full bg-[#FBBF24] py-3 text-center text-xs font-black uppercase tracking-wider text-[#144E25] shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  SHOP ALL
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* ── Shipment Tracking Modal ─────────────────────────────────────────── */}
      <TrackOrderModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />
    </>
  );
}
