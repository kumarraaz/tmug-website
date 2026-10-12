import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { BlogCard } from "@/components/BlogSection";
import { BLOG_POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "Journal",
  description: "Tea stories, recipes and guides from TMUG.",
  alternates: { canonical: `${siteConfig.url}/blog` },
};

export default function BlogPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Journal"
        title="From the TMUG Journal"
        copy="Tea stories, recipes and guides. Our articles are on the way — here is a preview of what is coming."
      />
      <section className="bg-cream pb-16 pt-2">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug} className="min-w-0">
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
