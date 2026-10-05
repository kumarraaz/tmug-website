import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { seoStore } from "@/lib/seo-store";
import { siteConfig } from "@/config/site";
import { ShopProvider } from "@/lib/store";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoStore.get();
  const robots = `${seo.robotsIndex ? "index" : "noindex"},${seo.robotsFollow ? "follow" : "nofollow"}`;
  return {
    title: {
      default: seo.metaTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: seo.metaDescription,
    alternates: { canonical: seo.canonicalUrl },
    robots,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: seo.canonicalUrl,
      images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [seo.ogImage],
    },
    icons: { icon: "/icon.svg" },
  };
}

function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "TMUG",
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo/tmug-logo.png`,
      description: siteConfig.description,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: `+${siteConfig.whatsapp.number}`,
        contactType: "customer service",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "TMUG",
      url: siteConfig.url,
      description: siteConfig.description,
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>
        <JsonLd />
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
