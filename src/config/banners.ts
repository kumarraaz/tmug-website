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
    id: "modern-indian-tea-garden",
    image: "/banners/modern-indian-tea-garden.png",
    alt: "Tea, but make it fun. Modern Indian Tea Co. — Full TMUG lineup in botanical garden setting",
    destination: "/#collections",
    cta: "Explore Collections",
    category: "Modern Indian Tea Co.",
    campaign: "Whole Leaf & Flower Teas",
    headline: "Tea, but make it fun.",
    subtitle: "Floral brews, fresh leaves & properly kadak chai — made for your everyday ritual.",
  },
  {
    id: "blue-tea-bloom",
    image: "/banners/blue-tea-ritual-in-bloom.png",
    alt: "Blue Tea Ritual in Bloom — Aparajita flowers and brewed blue cup with TMUG 50g jar",
    destination: "/products/butterfly-pea-flower-tea",
    cta: "Shop Blue Tea",
    category: "Flower Tea",
    campaign: "100% Natural Flowers",
    headline: "Meet Your Blue Tea Ritual.",
    subtitle: "Naturally vibrant butterfly pea flowers, brewed into a beautiful everyday cup.",
  },
  {
    id: "properly-kadak-chai-gold",
    image: "/banners/properly-kadak-chai-3.png",
    alt: "Properly Kadak TMUG Chai — Assam CTC & Assam Orthodox blend in Gold Tea jar and pouch",
    destination: "/products/tmug-gold-tea",
    cta: "Shop Gold Chai",
    category: "Signature Chai",
    campaign: "Rich Aroma • Bold Taste",
    headline: "Properly Kadak TMUG Chai",
    subtitle: "A blend of Assam CTC & Assam Orthodox tea for full-bodied character.",
  },
];
