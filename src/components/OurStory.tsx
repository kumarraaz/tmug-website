import Image from "next/image";
import Link from "next/link";
import Reveal from "./motion/Reveal";

export default function OurStory() {
  return (
    <section id="our-story" aria-labelledby="our-story-heading" className="bg-white py-12 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-[#FBE7DC] shadow-[0_24px_60px_-24px_rgba(20,78,37,0.45)] lg:max-w-none">
            <Image
              src="/shop/gold-poster.jpg"
              alt="TMUG Gold Tea pouch on a table in front of rolling tea gardens, with a steaming cup of tea"
              fill
              sizes="(max-width: 1024px) 90vw, 520px"
              className="object-cover object-center"
            />
          </div>
        </Reveal>

        <Reveal>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#144E25]">Our Story</span>
          <h2 id="our-story-heading" className="text-section mt-2 font-display font-black text-[#33243A]">
            Tea, made to be shared.
          </h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#3A3438]/85">
            <p>
              At TMUG, we believe a cup of tea is more than a drink — it is a pause, a conversation and a small ritual
              you look forward to.
            </p>
            <p>
              Our range brings together whole-flower herbal teas and everyday chai, chosen for their aroma and taste,
              and packed to be brewed, poured and shared with the people who matter to you.
            </p>
          </div>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#144E25] px-7 py-3 text-sm font-black text-[#FBBF24] shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            Read Our Story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
