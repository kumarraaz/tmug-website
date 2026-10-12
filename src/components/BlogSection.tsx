import Image from "next/image";
import Link from "next/link";
import Reveal from "./motion/Reveal";
import { BLOG_POSTS, type BlogPost } from "@/data/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#3A3438]/10 bg-white shadow-[0_10px_28px_-16px_rgba(51,36,58,0.25)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF7EF]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {!post.published && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FBBF24] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#144E25]">
            Coming soon
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#144E25]">{post.category}</p>
        <h3 className="mt-1 font-display text-[16px] font-black leading-snug text-[#33243A]">{post.title}</h3>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#3A3438]/75">{post.excerpt}</p>
        {post.published && (
          <Link href={`/blog/${post.slug}`} className="mt-4 text-sm font-black text-[#144E25] hover:underline">
            Read more →
          </Link>
        )}
      </div>
    </article>
  );
}

/** Homepage journal teaser: first four posts from data/blog.ts, plus a link to the full journal page. */
export default function BlogSection() {
  return (
    <section id="journal" aria-labelledby="journal-heading" className="bg-[#FFF7EF] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#144E25]">Tea stories &amp; guides</span>
          <h2 id="journal-heading" className="text-section mt-1.5 font-display font-black text-[#33243A]">
            From the TMUG Journal
          </h2>
        </Reveal>

        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BLOG_POSTS.slice(0, 4).map((post) => (
            <li key={post.slug} className="min-w-0">
              <BlogCard post={post} />
            </li>
          ))}
        </ul>

        <div className="mt-9 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#144E25] px-8 py-3 text-sm font-black text-[#144E25] transition-colors hover:bg-[#144E25] hover:text-[#FBBF24]"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}
