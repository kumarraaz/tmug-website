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
    id: "the-tea-lineup",
    image: "/banners/the-tea-lineup-pick-your-sip.png",
    alt: "The Tea Lineup — Pick Your Sip. Five teas. Your kind of ritual by TMUG",
    destination: "/#collections",
    cta: "Find Your Tea",
    category: "The Tea Lineup",
    campaign: "Five Teas • Your Kind of Ritual",
    headline: "Pick Your Sip.",
    subtitle: "Five teas. Your kind of ritual.",
  },
  {
    id: "sip-happens",
    image: "/banners/sip-happens-pick-your-mood.png",
    alt: "Sip Happens — Pick your mood. TMUG Herbal Teas: Lemongrass, Butterfly Pea, Chamomile, Hibiscus",
    destination: "/#collections",
    cta: "Find Your Blend",
    category: "Mood Discovery",
    campaign: "Sip Club • Daily Reset",
    headline: "Sip Happens. Pick Your Mood.",
    subtitle: "From afternoon ice brews to bedtime floral resets, pick your mood.",
  },
  {
    id: "butterfly-pea-bloom",
    image: "/banners/butterfly-pea-bloom-in-every-sip.png",
    alt: "Bloom in Every Sip — Butterfly Pea Flower Tea by TMUG",
    destination: "/products/butterfly-pea-flower-tea",
    cta: "Explore The Tea",
    category: "Flower Tea",
    campaign: "100% Natural • Caffeine-Free",
    headline: "Bloom in Every Sip.",
    subtitle: "Turn your tea break into something beautiful.",
  },
  {
    id: "hibiscus-beautiful",
    image: "/banners/hibiscus-make-time-for-beautiful.png",
    alt: "Hibiscus Flower Tea — Make time for a little beautiful by TMUG",
    destination: "/products/hibiscus-flower-tea",
    cta: "Shop Hibiscus Tea",
    category: "Flower Tea",
    campaign: "100% Natural • Tangy Ruby Sip",
    headline: "Make Time for a Little Beautiful.",
    subtitle: "A floral moment, made for you.",
  },
  {
    id: "lemongrass-less-scroll",
    image: "/banners/lemongrass-less-scroll-more-sip.png",
    alt: "Lemongrass Tea — Less Scroll. More Sip by TMUG",
    destination: "/products/lemongrass-tea",
    cta: "Shop Lemongrass",
    category: "Herbal Detox",
    campaign: "Citrus Calm • Less Scroll, More Sip",
    headline: "Less Scroll. More Sip.",
    subtitle: "Make a little space for tea.",
  },
  {
    id: "properly-kadak-chai",
    image: "/banners/properly-kadak-chai-1.png",
    alt: "Properly Kadak. Properly TMUG. Everyday Chai — TMUG Premium and Gold Tea packs with steaming chai cup",
    destination: "/collections?c=chai",
    cta: "Shop Chai",
    category: "Everyday Chai",
    campaign: "Bold Taste • Everyday Chai",
    headline: "Properly Kadak. Properly TMUG.",
    subtitle: "Bold everyday chai for mornings, breaks and everything in between.",
  },
  {
    id: "wellness-seven-herbals",
    image: "/banners/wellness-seven-herbal-teas.png",
    alt: "Wellness, Wrapped in 7 Herbal Teas — TMUG whole flower jars including Rose, Hibiscus, Butterfly Pea and Chamomile",
    destination: "/collections?c=flower-teas",
    cta: "Explore Herbal Teas",
    category: "Botanical Wellness",
    campaign: "Pure Flowers • Daily Wellness",
    headline: "Wellness, Wrapped in 7 Herbal Teas",
    subtitle: "Pure flowers. Real flavour. A happier you, one cup at a time.",
  },
  {
    id: "butterfly-pea-ritual",
    image: "/banners/butterfly-pea-tea-ritual.png",
    alt: "Meet Your Blue Tea Ritual — Butterfly Pea Flower Tea by TMUG with brewed sapphire cup and jar",
    destination: "/products/butterfly-pea-flower-tea",
    cta: "Shop Butterfly Pea Tea",
    category: "Flower Tea",
    campaign: "Naturally Blue • Caffeine-Free",
    headline: "Meet Your Blue Tea Ritual.",
    subtitle: "Naturally vibrant butterfly pea flowers, brewed into a beautiful everyday cup.",
  },
];

