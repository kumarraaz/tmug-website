import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "TMUG privacy policy — what data we collect and how we use it.",
  alternates: { canonical: `${siteConfig.url}/privacy` },
  robots: "index,follow",
};

const SECTIONS = [
  {
    h: "What we collect",
    p: "When you browse TMUG, your cart is stored locally in your own browser (localStorage) — we don't see it until you send us an order on WhatsApp. If you message us, we receive whatever you share in that chat: your name, phone number and order details.",
  },
  {
    h: "How we use it",
    p: "We use your details only to confirm and fulfil your order, arrange delivery and payment, and respond to your questions. We don't sell your data, and we don't share it with third parties for marketing.",
  },
  {
    h: "Cookies & analytics",
    p: "This site may use basic, privacy-friendly analytics to understand which pages are visited. No advertising trackers are used to follow you around the web.",
  },
  {
    h: "Your choices",
    p: "You can clear your cart any time from the cart drawer — it lives only in your browser. To ask us to delete any order details you've shared on WhatsApp or email, just message us at hello@tmug.in.",
  },
  {
    h: "Changes",
    p: "If this policy changes, the updated version will be posted here with a revised date.",
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Privacy Policy" title={<>Privacy, <span className="text-tea-green">plainly.</span></>} copy="Last updated: October 2026" />
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
