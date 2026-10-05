import Image from "next/image";
import { COLLECTIONS, PRODUCTS } from "@/data/products";
import { siteConfig, whatsappLink } from "@/config/site";
import { IconWhatsApp } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-cream/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Image
              src="/logo/tmug-logo.png"
              alt="TMUG logo"
              width={220}
              height={112}
              className="h-auto w-40"
              loading="lazy"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Modern Indian tea — whole-flower herbals, Darjeeling green and kadak CTC chai.
              Packed fresh, shipped across India.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-extrabold text-white transition-transform hover:scale-[1.03]"
            >
              <IconWhatsApp className="h-4 w-4" /> {siteConfig.whatsapp.display}
            </a>
          </div>

          {/* Shop */}
          <nav aria-label="Shop">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-cream">Shop</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="#shop" className="transition-colors hover:text-gold-soft">All teas</a></li>
              {PRODUCTS.map((p) => (
                <li key={p.id}>
                  <a href="#shop" className="transition-colors hover:text-gold-soft">{p.name}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Collections */}
          <nav aria-label="Collections">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-cream">Collections</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COLLECTIONS.map((c) => (
                <li key={c.id}>
                  <a href="#collections" className="transition-colors hover:text-gold-soft">{c.name}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-cream">TMUG</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="#about" className="transition-colors hover:text-gold-soft">Our story</a></li>
              <li><a href="#why" className="transition-colors hover:text-gold-soft">Why TMUG</a></li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-gold-soft">
                  {siteConfig.email}
                </a>
              </li>
              <li><a href="/admin/seo" className="transition-colors hover:text-gold-soft">Admin</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>© {year} TMUG. All rights reserved.</p>
          <p>Made with real tea in India 🍵</p>
        </div>
      </div>
    </footer>
  );
}
