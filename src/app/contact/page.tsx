import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, whatsappLink } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import { IconWhatsApp, IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact TMUG — WhatsApp support, email and FAQs. We're here to help with orders, brewing and everything tea.",
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: {
    title: "Contact TMUG",
    description: "WhatsApp support, email and FAQs — we're here to help.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

const CARDS = [
  {
    title: "WhatsApp support",
    copy: "Fastest way to reach us — orders, delivery questions, brew help.",
    cta: "Chat on WhatsApp",
    href: whatsappLink(),
    external: true,
    accent: "#25D366",
    icon: <IconWhatsApp className="h-6 w-6" />,
  },
  {
    title: "Email us",
    copy: "For anything detailed — bulk orders, feedback, partnerships.",
    cta: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    external: false,
    accent: "#4A6FD4",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Browse FAQs",
    copy: "Ordering, brewing, variants, the TMUG10 offer — answered.",
    cta: "Read the FAQ",
    href: "/faq",
    external: false,
    accent: "#D8A62A",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.8.3-.9 1-.9 1.7" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title={<>Say hello.<br /><span className="text-tea-green">We reply fast.</span></>}
        copy="Orders, brewing questions, bulk enquiries — pick whichever channel suits you."
        accent="#25D366"
      />
      <section className="bg-cream-light pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Stagger className="grid gap-5 md:grid-cols-3" gap={0.08}>
            {CARDS.map((c) => (
              <RevealItem key={c.title}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group block h-full rounded-[1.75rem] bg-white p-7 shadow-[0_16px_45px_-18px_rgba(11,61,46,0.3)] ring-1 ring-ink/5 transition-all hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-18px_rgba(11,61,46,0.4)]"
                >
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: c.accent }}
                  >
                    {c.icon}
                  </span>
                  <h2 className="mt-5 font-display text-xl font-extrabold text-tea-ink">{c.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.copy}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-tea-green">
                    {c.cta} <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </RevealItem>
            ))}
          </Stagger>

          <Reveal className="mt-12">
            <div className="overflow-hidden rounded-[2rem] bg-tea-deep p-8 text-center sm:p-12">
              <h2 className="font-display text-2xl font-black text-cream sm:text-4xl">
                Prefer to talk while you shop?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-cream/70">
                Use the chat bubble at the bottom-right of any page — it answers common questions
                instantly.
              </p>
              <Link
                href="/#shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-extrabold text-tea-ink transition-transform hover:scale-[1.04]"
              >
                Back to the teas <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
