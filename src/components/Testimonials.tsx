"use client";

import { TESTIMONIALS } from "@/data/testimonials";
import { FEEDBACK_MESSAGE } from "@/data/reviews";
import { whatsappLink } from "@/config/site";
import Reveal from "./motion/Reveal";
import { ButterflyPeaArt, HibiscusArt, LemongrassArt, TeaLeafArt } from "./BotanicalArt";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-[#D9A441]" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M10 1.8l2.4 5 5.4.7-4 3.8 1 5.4L10 14l-4.8 2.7 1-5.4-4-3.8 5.4-.7z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

/** "Loved by Tea Lovers": shows real testimonials from data/testimonials.ts, or a feedback invitation while none exist. */
export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] to-[#FBF3E6] py-14 sm:py-20"
    >
      {/* Subtle botanical line-art — edges only, low opacity, never behind the text column */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-[#144E25]">
        <LemongrassArt className="absolute -left-4 bottom-0 hidden h-64 w-32 opacity-[0.09] sm:block lg:left-6 lg:h-80 lg:w-40" />
        <HibiscusArt className="absolute -right-6 -top-6 h-36 w-36 opacity-[0.09] sm:h-48 sm:w-48 lg:right-8 lg:top-4" />
        <ButterflyPeaArt className="absolute -bottom-6 -right-4 hidden h-40 w-40 opacity-[0.08] sm:block lg:right-10 lg:h-48 lg:w-48" />
        <TeaLeafArt className="absolute -left-6 -top-4 h-32 w-32 opacity-[0.09] sm:h-44 sm:w-44 lg:left-8 lg:top-6" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#144E25]">What our customers say</span>
          <h2 id="testimonials-heading" className="text-section mt-1.5 font-display font-black text-[#33243A]">
            Loved by Tea Lovers
          </h2>
        </Reveal>

        {TESTIMONIALS.length > 0 ? (
          <ul className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <li
                key={`${t.name}-${i}`}
                className="flex h-full flex-col rounded-2xl border border-[#144E25]/10 bg-white/90 p-6 shadow-[0_10px_30px_-18px_rgba(51,36,58,0.3)]"
              >
                {t.rating ? <Stars n={Math.max(1, Math.min(5, Math.round(t.rating)))} /> : null}
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-[#33243A]">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm font-bold text-[#144E25]">
                  {t.name}
                  {t.product && <span className="block text-xs font-medium text-[#3A3438]/60">{t.product}</span>}
                </figcaption>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto mt-9 max-w-2xl rounded-3xl border border-[#144E25]/10 bg-white/90 p-8 text-center shadow-[0_14px_40px_-22px_rgba(51,36,58,0.35)] sm:p-10">
            <p className="font-display text-xl font-black text-[#33243A] sm:text-2xl">Tried a TMUG tea? We’d love to hear about it.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#3A3438]/75">
              Customer stories will appear here. Share your cup and your favourite blend with us on WhatsApp.
            </p>
            <a
              href={whatsappLink(FEEDBACK_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#144E25] px-7 py-3 text-sm font-black text-[#FBBF24] shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Share your feedback
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
