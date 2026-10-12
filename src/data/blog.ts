/**
 * Journal / blog entries. There is no blog backend yet, so these are clearly marked placeholders:
 * `published: false` shows a "Coming soon" tag and no link. When an article is ready, set
 * `published: true` and add a real page at /blog/<slug> — the card then shows "Read more".
 */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  published: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ways-to-enjoy-butterfly-pea-tea",
    title: "Ways to Enjoy Butterfly Pea Tea",
    excerpt: "Hot, iced or with a squeeze of lemon — a few simple ways to make your blue cup your own.",
    category: "Recipes",
    image: "/recipes/butterfly-pea-ways-to-enjoy.jpg",
    published: false,
  },
  {
    slug: "chamomile-latte-panna-cotta",
    title: "Chamomile Latte Panna Cotta",
    excerpt: "A soft, creamy dessert idea for a calm evening, made with chamomile tea.",
    category: "Recipes",
    image: "/recipes/chamomile-latte-panna-cotta.png",
    published: false,
  },
  {
    slug: "hibiscus-sorbet-ice-pops",
    title: "Hibiscus Sorbet Ice Pops",
    excerpt: "Turn a pot of ruby hibiscus tea into a cool, tangy treat for warm afternoons.",
    category: "Recipes",
    image: "/recipes/hibiscus-sorbet-ice-pops.png",
    published: false,
  },
  {
    slug: "lemongrass-ginger-chai-soup",
    title: "Lemongrass Ginger Chai Soup",
    excerpt: "A warming idea that pairs lemongrass with ginger and a little chai spice.",
    category: "Recipes",
    image: "/recipes/lemongrass-ginger-chai-soup.png",
    published: false,
  },
];
