"use client";

import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS } from "@/data/collections";
import { PRODUCTS } from "@/data/products";
import { siteConfig } from "@/config/site";
import FloatingLogo from "./motion/FloatingLogo";
import { useSiteControls } from "@/lib/site-controls-context";

function SocialIcon({ name }: { name: "Instagram" | "Facebook" | "YouTube" | "LinkedIn" }) {
  const common = { className: "h-[18px] w-[18px]", viewBox: "0 0 24 24", "aria-hidden": true } as const;
  if (name === "Instagram")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "LinkedIn")
    return (
      <svg {...common} fill="currentColor">
        <path d="M6.9 8.9H3.8V20h3.1V8.9zM5.3 4a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM20.2 13.4c0-3-1.6-4.7-4.1-4.7-1.4 0-2.4.8-2.8 1.5V8.9h-3V20h3.1v-6c0-1.6.8-2.6 2.1-2.6s1.9.9 1.9 2.6V20h3.1l-.3-6.6z" />
      </svg>
    );
  if (name === "Facebook")
    return (
      <svg {...common} fill="currentColor">
        <path d="M13.5 21v-7.2h2.4l.4-2.9h-2.8V9.1c0-.8.3-1.4 1.5-1.4h1.4V5.2c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2.1H8.3v2.9h2.4V21h2.8z" />
      </svg>
    );
  return (
    <svg {...common} fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />
    </svg>
  );
}

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
            {f?.showSocials !== false && (
              <div className="mt-5 flex flex-nowrap items-center gap-2.5">
                {[
                  { label: "Instagram" as const, href: siteConfig.socials.instagram },
                  { label: "Facebook" as const, href: siteConfig.socials.facebook },
                  { label: "YouTube" as const, href: siteConfig.socials.youtube },
                  { label: "LinkedIn" as const, href: siteConfig.socials.linkedin },
                ].map((s) => {
                  const cls =
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-cream/70 transition-colors";
                  return s.href ? (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`TMUG on ${s.label}`}
                      className={`${cls} hover:border-gold hover:text-gold`}
                    >
                      <SocialIcon name={s.label} />
                    </a>
                  ) : (
                    <span key={s.label} role="img" aria-label={`TMUG on ${s.label} (link coming soon)`} className={`${cls} opacity-60`}>
                      <SocialIcon name={s.label} />
                    </span>
                  );
                })}
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
        <p className="mt-4 text-center text-[11px] tracking-wide text-cream/40">
          <a
            href="https://webdigitaldevelopment.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold"
          >
            Design by Web Digital Development
          </a>
        </p>
      </div>
    </footer>
  );
}
