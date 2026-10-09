"use client";

import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS } from "@/data/collections";
import { PRODUCTS } from "@/data/products";
import { siteConfig, whatsappLink } from "@/config/site";
import { IconWhatsApp } from "./icons";
import FloatingLogo from "./motion/FloatingLogo";
import { useSiteControls } from "@/lib/site-controls-context";

export default function Footer() {
  const { controls } = useSiteControls();
  const f = controls?.sectionsVisual?.footer;
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: f?.bgColor || undefined,
        color: f?.textColor || undefined,
        paddingTop: f?.paddingTop !== undefined ? `${f.paddingTop}px` : undefined,
        paddingBottom: f?.paddingBottom !== undefined ? `${f.paddingBottom}px` : undefined,
      }}
      className="relative overflow-hidden bg-charcoal text-warm-ivory/80"
    >
      <FloatingLogo opacity={0.04} size="90%" className="opacity-100" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/logo/tmug-logo.png"
              alt="TMUG logo"
              width={220}
              height={112}
              style={{
                height: f?.logoHeight ? `${f.logoHeight}px` : undefined,
                width: "auto",
              }}
              className="w-36"
              loading="lazy"
            />
            <p className="mt-4 max-w-xs font-display text-lg font-bold leading-snug text-cream">
              {f?.tagline || (
                <>
                  Tea, but make it <span className="text-gold">TMUG.</span>
                </>
              )}
            </p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-cream/60">
              Whole-flower herbals, Darjeeling green and kadak CTC chai — packed fresh, shipped
              across India.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4.5 py-2.5 text-[13px] font-extrabold text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              <IconWhatsApp className="h-4 w-4" /> {siteConfig.whatsapp.display}
            </a>
            {f?.showSocials !== false && (
              <div className="mt-5 flex gap-2">
                {[
                  { label: "Instagram", href: siteConfig.socials.instagram },
                  { label: "Facebook", href: siteConfig.socials.facebook },
                  { label: "YouTube", href: siteConfig.socials.youtube },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`TMUG on ${s.label}`}
                    className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-cream/70 transition-colors hover:border-gold hover:text-gold"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Shop">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">Shop</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/#shop" className="transition-colors hover:text-gold-soft">All teas</Link></li>
              <li>
                <a
                  href={siteConfig.amazonStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gold transition-colors hover:text-gold-soft"
                >
                  Amazon Store <span className="text-xs">↗</span>
                </a>
              </li>
              {PRODUCTS.map((p) => (
                <li key={p.id}>
                  <Link href={`/products/${p.slug}`} className="transition-colors hover:text-gold-soft">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Collections">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">Collections</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COLLECTIONS.map((c) => (
                <li key={c.id}>
                  <Link href={`/collections?c=${c.id}`} className="transition-colors hover:text-gold-soft">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">TMUG</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/about" className="transition-colors hover:text-gold-soft">About us</Link></li>
              <li><Link href="/faq" className="transition-colors hover:text-gold-soft">FAQ</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-gold-soft">Contact</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-gold-soft">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-gold-soft">Terms of Service</Link></li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-gold-soft">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream/45 sm:flex-row">
          <p>© {year} TMUG. All rights reserved.</p>
          <p className="font-display font-bold tracking-wide">BREW BOLD · SIP HAPPY 🍵</p>
        </div>
      </div>
    </footer>
  );
}
