"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "./motion/Reveal";
import { VIDEO_CARDS, VIDEO_SECTION, type VideoCard } from "@/config/video";

const YT_ID = /^[A-Za-z0-9_-]{11}$/;

/** Faithful YouTube play badge (red rounded rectangle + white triangle). */
function YouTubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 68 48" aria-hidden="true" className={className}>
      <path
        d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
        fill="#FF0000"
      />
      <path d="M45 24 27 14v20" fill="#FFFFFF" />
    </svg>
  );
}

function CardFace({ card, ready }: { card: VideoCard; ready: boolean }) {
  return (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ backgroundColor: card.bg }}>
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-105 motion-reduce:group-hover:scale-100 ${
            card.fit === "contain" ? "object-contain" : "object-cover"
          }`}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <YouTubeIcon className="h-12 w-[4.25rem] drop-shadow-lg transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100 sm:h-14 sm:w-20" />
        </div>
        {!ready && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FBBF24] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#144E25] shadow-xs">
            Coming soon
          </span>
        )}
      </div>
      <div className="p-4 text-left sm:p-5">
        <h3 className="font-display text-[16px] font-black leading-snug text-[#33243A] sm:text-[17px]">{card.title}</h3>
        {card.description && <p className="mt-1 text-[13px] text-[#3A3438]/75">{card.description}</p>}
      </div>
    </>
  );
}

export default function VideoSection() {
  const [active, setActive] = useState<VideoCard | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section id="tmug-videos" aria-labelledby="tmug-videos-heading" className="relative bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <h2 id="tmug-videos-heading" className="text-section font-display font-black text-[#33243A]">
            {VIDEO_SECTION.heading}
          </h2>
          <p className="mx-auto mt-1.5 max-w-xl text-[13px] text-[#3A3438]/80 sm:text-[14px]">
            {VIDEO_SECTION.subheading}
          </p>
        </Reveal>

        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {VIDEO_CARDS.map((card) => {
            const ready = YT_ID.test(card.youtubeId);
            const cls =
              "group block w-full overflow-hidden rounded-2xl border border-[#3A3438]/10 bg-white text-left shadow-[0_10px_28px_-16px_rgba(51,36,58,0.25)] transition-shadow duration-300 hover:shadow-[0_22px_44px_-18px_rgba(51,36,58,0.35)]";
            return (
              <li key={card.id} className="min-w-0">
                {ready ? (
                  <button
                    type="button"
                    onClick={() => setActive(card)}
                    aria-label={`Play video: ${card.title}`}
                    className={`${cls} cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144E25]`}
                  >
                    <CardFace card={card} ready />
                  </button>
                ) : (
                  <div className={cls} role="group" aria-label={`${card.title} — video coming soon`}>
                    <CardFace card={card} ready={false} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {active && YT_ID.test(active.youtubeId) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
              title={active.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close video"
            className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-black text-[#144E25] cursor-pointer"
          >
            Close ✕
          </button>
        </div>
      )}
    </section>
  );
}
