import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "TMUG FAQs — orders, shipping, products, brewing, storage, returns and wholesale.",
  alternates: { canonical: `${siteConfig.url}/faq` },
  openGraph: {
    title: "TMUG FAQ",
    description: "Ordering, shipping, brewing, storage, returns and wholesale.",
    url: `${siteConfig.url}/faq`,
    type: "website",
  },
};

interface Faq { q: string; a: string }
interface FaqCategory { id: string; name: string; faqs: Faq[] }

const CATEGORIES: FaqCategory[] = [
  {
    id: "orders",
    name: "Orders",
    faqs: [
      {
        q: "How do I place an order?",
        a: "Add teas to your cart, then tap the WhatsApp order button. Your message is pre-filled with every item, pack size, quantity and total — just hit send and we'll confirm on WhatsApp.",
      },
      {
        q: "What payment methods are available?",
        a: "Orders are confirmed on WhatsApp (+91 81307 07344), where we arrange payment and delivery with you directly. Online checkout is coming soon.",
      },
      {
        q: "What is the TMUG10 offer?",
        a: "TMUG10 gives you 10% off your cart. Enter it in the coupon box inside the cart drawer — the discount applies instantly to your subtotal.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Yes — message us on WhatsApp as soon as possible and we'll update or cancel it before dispatch, no questions asked.",
      },
    ],
  },
  {
    id: "shipping",
    name: "Shipping",
    faqs: [
      {
        q: "Do you ship across India?",
        a: "Yes, we ship across India. Delivery timelines and charges are confirmed with you on WhatsApp when you place your order.",
      },
      {
        q: "How long does delivery take?",
        a: "Typically 3–7 working days depending on your location. We'll share tracking details on WhatsApp once your order ships.",
      },
    ],
  },
  {
    id: "products",
    name: "Products",
    faqs: [
      {
        q: "How do I choose between the jar and the pouch?",
        a: "Jars are airtight and gift-friendly — great for daily use on the counter. Pouches are lighter on the wallet and perfect for refills or trying a tea for the first time. Same tea inside.",
      },
      {
        q: "Are your teas caffeinated?",
        a: "The flower teas (butterfly pea, chamomile, hibiscus) and lemongrass are naturally caffeine-free herbals. Darjeeling green has light caffeine; Premium and Gold chai (CTC) have the most — like a regular cup of chai.",
      },
      {
        q: "Do you add flavours or colours?",
        a: "No. What you see is the ingredient — whole dried flowers, leaves and CTC granules. The colours in your cup come from the plants themselves.",
      },
    ],
  },
  {
    id: "brewing",
    name: "Brewing",
    faqs: [
      {
        q: "How should I brew the teas?",
        a: "Flower and green teas: water just off the boil, steep 2–3 minutes. Butterfly pea + a squeeze of lemon turns from blue to violet. CTC chai (Premium & Gold): rolling boil with milk and sugar for a proper kadak cup. Each product page has its own brew guide.",
      },
      {
        q: "Can I re-steep the leaves or flowers?",
        a: "Yes — flower teas and Darjeeling green handle a second steep well. Use slightly hotter water and a minute longer the second time.",
      },
    ],
  },
  {
    id: "storage",
    name: "Storage",
    faqs: [
      {
        q: "How should I store my tea?",
        a: "Keep it airtight, cool, dry and away from strong smells. The jars seal well on their own; reseal pouches tightly after each use. Stored right, teas stay fresh for 6–9 months.",
      },
    ],
  },
  {
    id: "returns",
    name: "Returns",
    faqs: [
      {
        q: "What if my order arrives damaged or wrong?",
        a: "Tell us on WhatsApp within 48 hours of delivery with a photo and we'll make it right — replacement or refund, your choice.",
      },
    ],
  },
  {
    id: "wholesale",
    name: "Wholesale",
    faqs: [
      {
        q: "Do you offer bulk or wholesale pricing?",
        a: "Yes — for cafés, offices, gifting and resellers. Message us on WhatsApp or email hello@tmug.in with your requirements and we'll share wholesale pricing.",
      },
    ],
  },
];

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CATEGORIES.flatMap((c) =>
      c.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ),
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PageHero
        eyebrow="FAQ"
        title={<>Questions?<br /><span className="text-tea-green">Answered.</span></>}
        copy="Everything about ordering, shipping, brewing and more."
        accent="#4A6FD4"
      />
      <section className="bg-cream-light pb-12 sm:pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Category jump links */}
          <Reveal kind="fade-in" className="mb-8">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <a
                  key={c.id}
                  href={`#faq-${c.id}`}
                  className="rounded-full border border-ink/12 bg-white px-3.5 py-2 text-[13px] font-bold text-ink transition-colors hover:border-tea-green hover:text-tea-green"
                >
                  {c.name}
                </a>
              ))}
            </div>
          </Reveal>

          {CATEGORIES.map((cat) => (
            <div key={cat.id} id={`faq-${cat.id}`} className="mb-8 scroll-mt-32">
              <Reveal className="mb-3">
                <h2 className="font-display text-xl font-extrabold text-tea-ink">{cat.name}</h2>
              </Reveal>
              <Stagger className="space-y-2.5" gap={0.05}>
                {cat.faqs.map((f) => (
                  <RevealItem key={f.q}>
                    <details className="group rounded-2xl border border-ink/8 bg-white px-5 py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-bold text-tea-ink">
                        {f.q}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream-dark text-lg leading-none text-tea-green transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                    </details>
                  </RevealItem>
                ))}
              </Stagger>
            </div>
          ))}

          <Reveal className="mt-6 text-center">
            <p className="text-sm text-ink-soft">Still stuck?</p>
            <Link
              href="/contact"
              className="mt-3 inline-block rounded-full bg-tea-green px-7 py-3 text-sm font-extrabold text-cream transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Contact support →
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
