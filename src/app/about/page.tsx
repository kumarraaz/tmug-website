import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import FloatingLogo from "@/components/motion/FloatingLogo";
import { IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "About TMUG",
  description:
    "TMUG is a modern Indian tea brand — whole-flower herbals, Darjeeling green and kadak CTC chai, made for everyday rituals.",
  alternates: { canonical: `${siteConfig.url}/about` },
  openGraph: {
    title: "About TMUG",
    description: "Modern tea. Thoughtfully selected. Made for everyday rituals.",
    url: `${siteConfig.url}/about`,
    type: "website",
  },
};

const PHILOSOPHY = [
  { title: "Quality ingredients", copy: "Whole dried flowers, long-leaf green tea and honest CTC — sourced with care, packed fresh." },
  { title: "Simple brewing", copy: "No ceremony, no equipment list. Hot water, a couple of minutes, and you're done." },
  { title: "Modern presentation", copy: "Airtight jars and resealable pouches designed to look good on your shelf — and gift well too." },
  { title: "Everyday rituals", copy: "From the first kadak of the morning to a calm chamomile at night — tea for every hour." },
];

const WHY = [
  { title: "Carefully selected teas", copy: "Seven focused teas, not seventy confusing ones." },
  { title: "Convenient formats", copy: "Jars for the counter, pouches for refills — 50g to 500g." },
  { title: "Fresh, expressive flavours", copy: "Colour, aroma and taste you can actually notice." },
  { title: "Made for modern drinkers", copy: "Honest pricing, WhatsApp ordering, zero fuss." },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About us"
        title={<>Tea, reimagined<br />for the <span className="text-tea-green">everyday.</span></>}
        copy="TMUG is a modern tea brand built around approachable, flavourful and visually beautiful tea experiences."
      />

      {/* Brand story */}
      <section className="relative overflow-hidden bg-cream-light py-14 sm:py-20">
        <FloatingLogo opacity={0.03} size="60%" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-black tracking-tight text-tea-ink sm:text-4xl">
              Our story
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                TMUG started with a simple frustration: great tea in India was either boring or
                overpriced. Supermarket chai all tasted the same, and the &ldquo;fancy&rdquo; stuff came with
                a lecture.
              </p>
              <p>
                So we built the tea brand we wanted to drink from — whole flowers that brew
                blue, hibiscus that glows ruby red, Darjeeling green that&rsquo;s genuinely delicate,
                and CTC chai that&rsquo;s properly kadak. Packed fresh, priced honestly.
              </p>
              <p>
                This page is just the beginning — we&rsquo;re adding more of our story here soon.
              </p>
            </div>
          </Reveal>
          <Reveal kind="scale" delay={0.1}>
            <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-ink/10">
              <Image
                src="/products/butterfly-pea-100g-pouch-front.jpg"
                alt="TMUG butterfly pea flower tea 100g pouch"
                fill
                sizes="(max-width: 768px) 85vw, 440px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-tea-deep py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-gold-soft">Our philosophy</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-cream sm:text-5xl">
              Simple ideas, done well.
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
            {PHILOSOPHY.map((p, i) => (
              <RevealItem key={p.title}>
                <div className="h-full rounded-[1.75rem] bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-white/10">
                  <p className="font-display text-4xl font-black text-gold">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 font-display text-lg font-extrabold text-cream">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">{p.copy}</p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why TMUG */}
      <section className="bg-cream py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-tea-green">Why TMUG</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-tea-ink sm:text-5xl">
              Made for modern tea drinkers
            </h2>
          </Reveal>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
            {WHY.map((w) => (
              <RevealItem key={w.title}>
                <div className="h-full rounded-[1.75rem] bg-white p-6 shadow-[0_14px_40px_-16px_rgba(11,61,46,0.25)] ring-1 ring-ink/5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-lg font-extrabold text-tea-ink">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{w.copy}</p>
                </div>
              </RevealItem>
            ))}
          </Stagger>

          <Reveal className="mt-12 text-center">
            <h3 className="font-display text-2xl font-black text-tea-ink">Taste the difference.</h3>
            <Link
              href="/#shop"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-tea-green px-8 py-4 text-sm font-extrabold text-cream transition-transform hover:scale-[1.04]"
            >
              Shop TMUG teas <IconArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
