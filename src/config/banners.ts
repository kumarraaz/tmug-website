export interface HeroBanner {
  id: string;
  image: string;
  mobileImage?: string;
  alt: string;
  destination: string;
  cta: string;
  category: string;
  campaign?: string;
  headline: string;
  subtitle: string;
}

/**
 * Data-driven configuration for Homepage Hero Banners.
 * All banner artwork assets are user-supplied high-resolution campaign visuals
 * mapped to verified TMUG product and collection routes.
 */
export const HERO_BANNERS: HeroBanner[] = [
  {
    id: "s1-butterfly-pea",
    image: "/banners/s1.png",
    mobileImage: "/banners/s1.png",
    alt: "Butterfly Pea Flower Tea — Brew Something Beautiful. A little blue. A beautiful pause by TMUG",
    destination: "/products/butterfly-pea-flower-tea",
    cta: "Shop Butterfly Pea",
    category: "Flower Tea",
    campaign: "Butterfly Pea Flower Tea",
    headline: "Brew Something Beautiful.",
    subtitle: "A little blue. A beautiful pause.",
  },
  {
    id: "s2-lemongrass",
    image: "/banners/s2.png",
    mobileImage: "/banners/s2.png",
    alt: "Lemongrass Tea — Steeped in simple pleasures. A lovely addition to your tea ritual by TMUG",
    destination: "/products/lemongrass-tea",
    cta: "Shop Lemongrass",
    category: "Herbal & Fresh",
    campaign: "Lemongrass Tea",
    headline: "Steeped in simple pleasures.",
    subtitle: "A lovely addition to your tea ritual.",
  },
  {
    id: "s3-chamomile",
    image: "/banners/s3.png",
    mobileImage: "/banners/s3.png",
    alt: "Chamomile Flower Tea — A cup of golden moments. Make room for your tea ritual by TMUG",
    destination: "/products/chamomile-flower-tea",
    cta: "Shop Chamomile",
    category: "Flower Tea",
    campaign: "Chamomile Flower Tea",
    headline: "A cup of golden moments.",
    subtitle: "Make room for your tea ritual.",
  },
  {
    id: "s4-the-tea-lineup",
    image: "/banners/s4.png",
    mobileImage: "/banners/s4.png",
    alt: "TMUG Herbal Teas — sip happens. Pick your mood. Lemongrass, Butterfly Pea, Chamomile, Hibiscus",
    destination: "/#collections",
    cta: "Shop your sip",
    category: "The Tea Lineup",
    campaign: "Pick Your Mood",
    headline: "sip happens.",
    subtitle: "Pick your mood.",
  },
];


