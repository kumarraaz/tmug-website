"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import { DEMO_REVIEWS } from "@/data/reviews";
import Reveal from "./motion/Reveal";
import { ColorButterflyPea, ColorChamomile, ColorHibiscus, ColorLeaf, ColorLemongrass } from "./BotanicalArt";

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

const ITEMS: Testimonial[] =
  TESTIMONIALS.length > 0 ? TESTIMONIALS : DEMO_REVIEWS.map((r) => ({ ...r, placeholder: true }));

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-[#F2A900]" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill={i < n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M10 1.8l2.4 5 5.4.7-4 3.8 1 5.4L10 14l-4.8 2.7 1-5.4-4-3.8 5.4-.7z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

function perViewFor(width: number) {
  return width >= 1024 ? 3 : width >= 640 ? 2 : 1;
}

export default function Testimonials() {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => setPerView(perViewFor(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pages = Math.max(1, ITEMS.length - perView + 1);
  const current = Math.min(index, pages - 1);
  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(pages - 1, i))), [pages]);

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#144E25] shadow-md transition-all sm:flex";

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-[#EAF2DF] py-10 sm:py-12"
    >
      {/* Full-colour botanicals around the outer edges only, behind the content */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <ColorButterflyPea className="absolute -left-2 top-2 h-24 w-24 -rotate-12 lg:left-[2%] lg:h-28 lg:w-28" />
        <ColorChamomile className="absolute left-[11%] top-1 h-14 w-14 lg:h-[4.5rem] lg:w-[4.5rem]" />
        <ColorLeaf tone="#6FA84A" className="absolute left-[17%] top-6 h-12 w-6 -rotate-[70deg] lg:h-14 lg:w-7" />
        <ColorLeaf tone="#4E8F3F" className="absolute left-[19%] top-14 h-10 w-5 -rotate-[100deg] lg:h-12 lg:w-6" />
        <ColorLeaf tone="#4E8F3F" className="absolute -left-3 bottom-4 h-28 w-14 rotate-[20deg] lg:left-0 lg:h-36 lg:w-[4.5rem]" />
        <ColorLeaf tone="#6FA84A" className="absolute left-6 bottom-0 h-20 w-10 rotate-[-25deg] lg:left-[3%] lg:h-24 lg:w-12" />
        <ColorLeaf tone="#6FA84A" className="absolute right-[18%] top-4 h-14 w-7 rotate-[60deg] lg:h-16 lg:w-8" />
        <ColorHibiscus className="absolute -right-2 -top-2 h-28 w-28 lg:right-[2%] lg:h-32 lg:w-32" />
        <ColorChamomile className="absolute right-[10%] top-8 h-14 w-14 lg:h-[4.5rem] lg:w-[4.5rem]" />
        <ColorLemongrass className="absolute -right-1 bottom-0 h-40 w-24 lg:right-[1%] lg:h-48 lg:w-28" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#144E25]">
            Real people. Real experiences.
          </span>
          <h2 id="testimonials-heading" style={SERIF} className="mt-1.5 text-3xl font-bold text-[#0F3D1F] sm:text-4xl">
            What Our Tea Lovers Say
            <ColorLeaf tone="#4E8F3F" className="ml-2 inline-block h-6 w-3 rotate-[35deg] align-top" />
          </h2>
          <p className="mt-1.5 text-sm text-[#2B3A2E]/80 sm:text-[15px]">Stories brewed with love, from our happy customers.</p>
        </Reveal>

        <div className="relative mt-8 sm:px-14">
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => go(current - 1)}
            disabled={current === 0}
            className={`${arrow} left-0 ${current === 0 ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-[#FBBF24]"}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => go(current + 1)}
            disabled={current >= pages - 1}
            className={`${arrow} right-0 ${current >= pages - 1 ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-[#FBBF24]"}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            className="overflow-hidden py-2"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
            }}
          >
            <ul
              className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${(current * 100) / perView}%)` }}
            >
              {ITEMS.map((t, i) => (
                <li key={`${t.name}-${i}`} className="shrink-0 px-2" style={{ width: `${100 / perView}%` }}>
                  <figure className="relative flex h-full min-h-[150px] gap-4 rounded-2xl bg-[#FFFDF7] p-5 shadow-[0_10px_30px_-16px_rgba(20,78,37,0.35)]">
                    {t.photo ? (
                      <Image src={t.photo} alt={t.name} width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover" />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#B9D4A5] text-xl font-bold text-[#144E25]"
                      >
                        {t.name.trim().charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      {t.rating ? <Stars n={Math.max(1, Math.min(5, Math.round(t.rating)))} /> : null}
                      <blockquote className="mt-1 text-[14px] leading-relaxed text-[#2B3A2E]">“{t.quote}”</blockquote>
                      <figcaption className="mt-auto flex items-center gap-2 pb-1 pl-10 pt-3 text-sm font-bold text-[#0F3D1F]">
                        {t.name}
                        {t.placeholder && (
                          <span className="rounded-full bg-[#E7EFD9] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#144E25]">
                            Sample
                          </span>
                        )}
                      </figcaption>
                    </div>
                    <span aria-hidden="true" style={SERIF} className="pointer-events-none absolute bottom-0 left-5 text-6xl font-bold leading-none text-[#144E25]/15">
                      ”
                    </span>
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2" role="group" aria-label="Review pages">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show reviews ${i + 1} of ${pages}`}
                aria-current={i === current}
                onClick={() => go(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${i === current ? "w-6 bg-[#144E25]" : "w-2.5 bg-[#144E25]/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
