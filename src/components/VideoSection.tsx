"use client";

import { useRef, useState } from "react";
import Reveal from "./motion/Reveal";
import { HOME_VIDEO } from "@/config/video";

/** Large rounded video panel. Plays inline with accessible play/pause + mute; lazy-loads (metadata only) until played. */
export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const hasVideo = Boolean(HOME_VIDEO.src);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <section id="tmug-film" aria-label="TMUG video" className="relative bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#144E25]">{HOME_VIDEO.eyebrow}</span>
          <h2 className="text-section mt-1.5 font-display font-black text-[#33243A]">{HOME_VIDEO.heading}</h2>
          <p className="mx-auto mt-1 max-w-xl text-[13px] text-[#3A3438]/80 sm:text-[14px]">{HOME_VIDEO.subheading}</p>
        </Reveal>

        <div className="relative mt-7 aspect-video w-full overflow-hidden rounded-3xl bg-[#144E25] shadow-[0_25px_60px_-20px_rgba(20,78,37,0.45)]">
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={HOME_VIDEO.src}
                poster={HOME_VIDEO.poster || undefined}
                preload="none"
                playsInline
                muted={muted}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                className="h-full w-full object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/50 to-transparent p-3 sm:p-4">
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? "Pause video" : "Play video"}
                  className="rounded-full bg-[#FBBF24] px-5 py-2 text-xs font-black uppercase tracking-wider text-[#144E25] shadow-md cursor-pointer"
                >
                  {playing ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-pressed={muted}
                  aria-label={muted ? "Unmute video" : "Mute video"}
                  className="rounded-full bg-white/90 px-4 py-2 text-xs font-black text-[#144E25] cursor-pointer"
                >
                  {muted ? "Unmute" : "Mute"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center text-white">
              <span className="rounded-full bg-[#FBBF24] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#144E25]">
                Coming soon
              </span>
              <p className="font-display text-xl font-black sm:text-3xl">The TMUG film is brewing.</p>
              <p className="max-w-md text-xs text-white/80 sm:text-sm">
                Our brand video will play right here once it is added.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
