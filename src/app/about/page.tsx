import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import FloatingLogo from "@/components/motion/FloatingLogo";
import { IconArrowRight, IconLeaf, IconCup, IconShield, IconTruck } from "@/components/icons";

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
  { icon: IconLeaf, title: "Quality ingredients", copy: "Whole dried flowers, long-leaf green tea and honest CTC — sourced with care, packed fresh." },
  { icon: IconCup, title: "Simple brewing", copy: "No ceremony, no equipment list. Hot water, a couple of minutes, and you're done." },
  { icon: IconShield, title: "Modern presentation", copy: "Airtight jars and resealable pouches designed to look good on your shelf — and gift well too." },
  { icon: IconTruck, title: "Everyday rituals", copy: "From the first kadak of the morning to a calm chamomile at night — tea for every hour." },
];

const SOURCE_STEPS = [
  { title: "Select", copy: "We taste widely and pick a small, focused range — seven teas we genuinely love." },
  { title: "Pack fresh", copy: "Airtight jars and resealable pouches, sealed to lock in aroma and colour." },
  { title: "Label honestly", copy: "Ingredients, brew steps and FSSAI/packer details printed on every pack." },
  { title: "Ship direct", copy: "From us to you — no warehouses of mystery stock, no stale shelves." },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About us"
        title={<>Tea, reimagined<br />for the <span className="text-tea-green">everyday.</span></>}
        copy="TMUG is a modern tea brand built around approachable, flavourful and visually beautiful tea experiences."
      />

      {/* Our story */}
      <section className="relative overflow-hidden bg-cream-light py-12 sm:py-16">
        <FloatingLogo opacity={0.03} size="60%" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-tea-green">Our story</p>
            <h2 className="text-section mt-2 font-display font-extrabold text-tea-ink">
              Boring tea made us do it.
            </h2>
            <div className="mt-4 space-y-3.5 text-[15px] leading-relaxed text-ink-soft">
              <p>
                Great tea in India was either boring or overpriced. Supermarket chai all tasted
                the same, and the &ldquo;fancy&rdquo; stuff came with a lecture.
              </p>
              <p>
                So we built the tea brand we wanted to drink from — whole flowers that brew
                blue, hibiscus that glows ruby red, Darjeeling green that&rsquo;s genuinely
                delicate, and CTC chai that&rsquo;s properly kadak. Packed fresh, priced honestly.
              </p>
            </div>
          </Reveal>
          <Reveal kind="scale" delay={0.08}>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[480px] overflow-hidden rounded-[1.75rem] border border-ink/8 shadow-[0_24px_55px_-24px_rgba(11,61,46,0.4)]">
              <Image
                src="/products/butterfly-pea-100g-pouch-front.jpg"
                alt="TMUG butterfly pea flower tea 100g pouch"
                fill
                sizes="(max-width: 768px) 85vw, 480px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What TMUG means */}
      <section className="bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold">What TMUG means</p>
            <h2 className="text-section mt-2 font-display font-extrabold text-tea-ink">
              Your mug. Your moment.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              TMUG is the mug you reach for without thinking — morning kadak, afternoon reset,
              midnight chamomile. We make the tea worthy of that habit: expressive, honest and
              just a little bit fun.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-tea-deep py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-soft">Our tea philosophy</p>
            <h2 className="text-section mt-2 font-display font-extrabold text-cream">
              Simple ideas, done well.
            </h2>
          </Reveal>
          <Stagger className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
            {PHILOSOPHY.map((p, i) => (
              <RevealItem key={p.title}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:bg-white/10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-display text-3xl font-extrabold text-cream/25">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 font-display text-base font-bold text-cream">{p.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-cream/65">{p.copy}</p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Quality + sourcing */}
      <section className="bg-cream-light py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-tea-green">Quality</p>
              <h2 className="text-section mt-2 font-display font-extrabold text-tea-ink">
                Nothing to hide.
              </h2>
              <ul className="mt-5 space-y-3">
                {[
                  "Whole flowers & leaves — never dust",
                  "Ingredients printed on every pack",
                  "FSSAI-registered packaging",
                  "No added colours or flavours",
                  "No miracle health claims, ever",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[15px] font-semibold text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tea-green text-cream">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <div>
              <Reveal className="mb-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-tea-green">How we source</p>
                <h2 className="text-section mt-2 font-display font-extrabold text-tea-ink">
                  Short chain, fresh tea.
                </h2>
              </Reveal>
              <Stagger className="grid gap-3 sm:grid-cols-2" gap={0.06}>
                {SOURCE_STEPS.map((s, i) => (
                  <RevealItem key={s.title}>
                    <div className="h-full rounded-3xl border border-ink/8 bg-white p-5">
                      <p className="font-display text-sm font-extrabold uppercase tracking-widest text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1.5 font-display text-base font-bold text-tea-ink">{s.title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{s.copy}</p>
                    </div>
                  </RevealItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* Why we exist */}
      <section className="bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-tea-green">Why we exist</p>
            <h2 className="text-section mt-2 font-display font-extrabold text-tea-ink">
              Make the everyday ritual worth it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              India runs on chai — and deserves better than stale dust in shiny packets.
              TMUG exists to make every cup a small upgrade: more colour, more aroma,
              more care. One mug at a time.
            </p>
            <Link
              href="/#shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-tea-green px-7 py-3.5 text-[15px] font-extrabold text-cream transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Taste the difference <IconArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
