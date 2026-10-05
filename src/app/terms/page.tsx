import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "TMUG terms of service — ordering, pricing, delivery and returns.",
  alternates: { canonical: `${siteConfig.url}/terms` },
  robots: "index,follow",
};

const SECTIONS = [
  {
    h: "Ordering",
    p: "Orders are placed by adding items to your cart and confirming on WhatsApp (+91 81307 07344). Your order is confirmed only after we acknowledge it in chat — the cart itself is not a completed purchase.",
  },
  {
    h: "Pricing",
    p: "All prices are in Indian Rupees (INR) and are as shown on the product at the time of ordering. Promotional codes (like TMUG10) apply only when entered in the cart before ordering, and can't be combined unless we say so.",
  },
  {
    h: "Payment & delivery",
    p: "Payment and delivery details are arranged with you directly on WhatsApp when you order. Delivery timelines and charges are confirmed before dispatch.",
  },
  {
    h: "Returns",
    p: "If your order arrives damaged or incorrect, tell us on WhatsApp within 48 hours of delivery with a photo and we'll make it right — replacement or refund, your choice.",
  },
  {
    h: "Fair use",
    p: "Please don't misuse the site, the WhatsApp ordering flow or promotional codes. We may decline orders that look fraudulent or abusive.",
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Terms of Service" title={<>The <span className="text-tea-green">fine print,</span><br />minus the headache.</>} copy="Last updated: October 2026" />
      <section className="bg-cream-light pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.h} delay={0.04 * i}>
              <div className="rounded-2xl bg-white p-6 ring-1 ring-ink/5">
                <h2 className="font-display text-lg font-extrabold text-tea-ink">{s.h}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
