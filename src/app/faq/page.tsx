import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "TMUG FAQs — how to order, WhatsApp ordering, brew guides, variant selection and the TMUG10 offer.",
  alternates: { canonical: `${siteConfig.url}/faq` },
  openGraph: {
    title: "TMUG FAQ",
    description: "Ordering, brewing, variants, WhatsApp support and the TMUG10 offer.",
    url: `${siteConfig.url}/faq`,
    type: "website",
  },
};

const FAQS = [
  {
    q: "How do I order?",
    a: "Add teas to your cart, then tap the WhatsApp order button. Your message is pre-filled with every item, pack size, quantity and total — just hit send and we'll confirm your order on WhatsApp.",
  },
  {
    q: "What payment methods are available?",
    a: "Right now orders are confirmed on WhatsApp (+91 81307 07344), where we arrange payment and delivery with you directly. Online checkout is coming soon.",
  },
  {
    q: "How do I choose a variant?",
    a: "Every tea comes in at least one pack size. Jars (50g/100g) are airtight and great for daily use; pouches (100g–500g) are better value for refills. Same tea inside — pick what suits your shelf.",
  },
  {
    q: "How should I brew the tea?",
    a: "Flower and green teas: water just off the boil, steep 2–3 minutes. Butterfly pea + a squeeze of lemon turns from blue to violet. CTC chai (Premium & Gold): rolling boil with milk and sugar for a proper kadak cup. Each product page has its own brew guide.",
  },
  {
    q: "Can I order through WhatsApp?",
    a: "Yes — that's our main way to order right now. Tap any WhatsApp button on the site, or message us directly at +91 81307 07344.",
  },
  {
    q: "What is the TMUG10 offer?",
    a: "TMUG10 gives you 10% off your cart. Add it in the coupon box inside the cart drawer — the discount applies instantly to your subtotal.",
  },
  {
    q: "How can I contact TMUG?",
    a: "WhatsApp us at +91 81307 07344, email hello@tmug.in, or use the chat bubble at the bottom-right of this site.",
  },
  {
    q: "Do you ship across India?",
    a: "Yes, we ship across India. Delivery timelines and charges are confirmed with you on WhatsApp when you place your order.",
  },
];

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PageHero
        eyebrow="FAQ"
        title={<>Questions?<br /><span className="text-tea-green">Answered.</span></>}
        copy="Everything about ordering, brewing, variants and support."
        accent="#4A6FD4"
      />
      <section className="bg-cream-light pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Stagger className="space-y-3" gap={0.06}>
            {FAQS.map((f) => (
              <RevealItem key={f.q}>
                <details className="group rounded-2xl bg-white px-5 py-4 shadow-[0_10px_30px_-14px_rgba(11,61,46,0.25)] ring-1 ring-ink/5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-extrabold text-tea-ink sm:text-lg">
                    {f.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-dark text-xl text-tea-green transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">{f.a}</p>
                </details>
              </RevealItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 text-center">
            <p className="text-ink-soft">Still stuck?</p>
            <Link
              href="/contact"
              className="mt-3 inline-block rounded-full bg-tea-green px-8 py-3.5 text-sm font-extrabold text-cream transition-transform hover:scale-[1.04]"
            >
              Contact support →
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
