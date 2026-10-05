import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, getProductBySlug } from "@/data/products";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import ProductDetail from "@/components/ProductDetail";
import ProductRail from "@/components/ProductRail";
import Reveal from "@/components/motion/Reveal";

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const url = `${siteConfig.url}/products/${product.slug}`;
  return {
    title: product.seoTitle,
    description: product.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: product.seoTitle,
      description: product.metaDescription,
      url,
      type: "website",
      images: [{ url: `${siteConfig.url}${product.variants[0].images[0].src}`, alt: product.variants[0].images[0].alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle,
      description: product.metaDescription,
    },
  };
}

const PRODUCT_FAQS = [
  {
    q: "How do I choose between the jar and the pouch?",
    a: "Jars are airtight and gift-friendly — great for daily use on the counter. Pouches are lighter on the wallet and perfect for refills or trying a tea for the first time. Same tea inside.",
  },
  {
    q: "How do I order this tea?",
    a: "Add it to your cart and check out via WhatsApp — your order message is pre-filled with the product, pack size, quantity and total. You can also apply the TMUG10 code in the cart for 10% off.",
  },
  {
    q: "How should I brew it?",
    a: "Each product page includes a brew guide. As a rule of thumb: flower and green teas like water just off the boil and 2–3 minutes of steeping; CTC chai loves a proper rolling boil with milk.",
  },
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  const url = `${siteConfig.url}/products/${product.slug}`;
  const defaultVariant = product.variants[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription,
    brand: { "@type": "Brand", name: "TMUG" },
    image: product.variants.flatMap((v) => v.images.map((i) => `${siteConfig.url}${i.src}`)),
    sku: defaultVariant.sku,
    url,
    ...(siteConfig.pricesAreReal
      ? {
          offers: product.variants.map((v) => ({
            "@type": "Offer",
            priceCurrency: "INR",
            price: v.price,
            availability: "https://schema.org/InStock",
            sku: v.sku,
            url,
          })),
        }
      : {}),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRODUCT_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <ProductDetail product={product} />

      {/* Product FAQ */}
      <section aria-label="Product FAQs" className="bg-cream-light py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="mb-6 text-center">
            <h2 className="font-display text-2xl font-extrabold text-tea-ink sm:text-3xl">
              Quick questions
            </h2>
          </Reveal>
          <div className="space-y-3">
            {PRODUCT_FAQS.map((f, i) => (
              <Reveal key={f.q} delay={0.05 * i}>
                <details className="group rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-ink/5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-extrabold text-tea-ink">
                    {f.q}
                    <span className="text-xl text-ink-soft transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href="/faq" className="text-sm font-bold text-tea-green underline decoration-2 underline-offset-4">
              See all FAQs →
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="bg-cream-light">
        <ProductRail title="You may also like" subtitle="Keep exploring" products={related} accent={product.accent} />
      </div>
    </PageShell>
  );
}
