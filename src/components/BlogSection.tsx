import Image from "next/image";
import Link from "next/link";
import Reveal from "./motion/Reveal";
import { BLOG_POSTS, type BlogPost } from "@/data/blog";

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#3A3438]/12 bg-white shadow-[0_8px_22px_-16px_rgba(51,36,58,0.3)]">
      <div className="relative aspect-[5/2] w-full overflow-hidden bg-[#FFF7EF]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {!post.published && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FBBF24] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#144E25]">
            Coming soon
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 style={SERIF} className="text-[19px] font-bold leading-snug text-[#0F3D1F]">{post.title}</h3>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#3A3438]/75">{post.excerpt}</p>
        <Link
          href={post.published ? `/blog/${post.slug}` : "/blog"}
          className="mt-4 text-sm font-semibold text-[#0F3D1F] hover:underline"
        >
          Read More <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

/** Homepage journal teaser: first four posts from data/blog.ts, plus a link to the full journal page. */
export default function BlogSection() {
  return (
    <section id="journal" aria-labelledby="journal-heading" className="bg-[#FEFCF7] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F3D1F]">Tea talks</span>
            <h2 id="journal-heading" style={SERIF} className="mt-1 text-3xl font-bold text-[#0F3D1F] sm:text-4xl">
              From Our Blog
            </h2>
            <p className="mt-1.5 text-sm text-[#3A3438]/80 sm:text-[15px]">Tips, stories and more to make your tea moments better.</p>
          </Reveal>
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#0F3D1F] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-md transition-transform hover:scale-105 active:scale-95 sm:self-auto"
          >
            View all blogs <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <li key={post.slug} className="min-w-0">
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
