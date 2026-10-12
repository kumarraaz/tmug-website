import Image from "next/image";
import Link from "next/link";
import Reveal from "./motion/Reveal";

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

export default function OurStory() {
  return (
    <section id="our-story" aria-labelledby="our-story-heading" className="overflow-hidden bg-[#FBF6EA]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-stretch md:grid-cols-2">
        {/* Text */}
        <Reveal className="flex flex-col justify-center px-5 py-10 sm:px-8 md:py-16 lg:pl-[max(2.5rem,calc((100vw-76rem)/2))] lg:pr-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#144E25]">More than just tea</span>
          <h2 id="our-story-heading" style={SERIF} className="mt-2 text-4xl font-bold text-[#0F3D1F] sm:text-5xl">
            Our Story
          </h2>
          <p className="mt-3 text-base text-[#2B3A2E] sm:text-lg">A journey brewed with passion, purity and people.</p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#2B3A2E]/85">
            At TMUG, we believe tea is more than just a drink—it&apos;s a moment of calm, a ritual of care and a connection
            to nature. Our journey began with a simple idea: to bring you natural, flavorful and thoughtfully crafted teas
            that fit beautifully into your everyday life.
          </p>
          <div>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0F3D1F] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Know more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>

        {/* Image with an organic curved left edge on larger screens */}
        <div className="relative mx-5 mb-8 aspect-[4/3] overflow-hidden rounded-3xl sm:mx-8 md:mx-0 md:mb-0 md:aspect-auto md:min-h-[460px] md:rounded-none md:[border-bottom-left-radius:48%_42%] md:[border-top-left-radius:48%_42%]">
          <Image
            src="/shop/gold-poster.jpg"
            alt="Rolling tea gardens at sunrise with a TMUG Gold Tea pouch and a steaming cup of tea"
            fill
            sizes="(max-width: 768px) 90vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
