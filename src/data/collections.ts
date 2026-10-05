import type { Collection } from "@/types";
import type { Product } from "@/types";
import { PRODUCTS } from "./products";

/**
 * Collection catalog — the single source of truth for collection pages,
 * the header dropdown and homepage collection cards.
 */
export const COLLECTIONS: Collection[] = [
  {
    id: "all-teas",
    slug: "all-teas",
    name: "All Teas",
    tagline: "The full lineup",
    description: "Every TMUG tea in one place — flower herbals, green tea and kadak chai.",
    image: "/products/butterfly-pea-50g-jar-front.jpg",
    imageAlt: "TMUG butterfly pea flower tea 50g jar with dried blue flowers",
    productIds: ["butterfly-pea", "chamomile", "hibiscus", "lemongrass", "darjeeling-green", "premium-tea", "gold-tea"],
    accent: "#D8A62A",
  },
  {
    id: "flower-teas",
    slug: "flower-teas",
    name: "Flower Teas",
    tagline: "Caffeine-free & colourful",
    description: "Whole dried flowers that brew beautiful — blue, golden and ruby cups.",
    image: "/products/hibiscus-50g-jar-front.jpg",
    imageAlt: "TMUG hibiscus flower tea 50g jar with dried red hibiscus petals",
    productIds: ["butterfly-pea", "chamomile", "hibiscus"],
    accent: "#D84F6D",
  },
  {
    id: "herbal-fresh",
    slug: "herbal-fresh",
    name: "Herbal & Fresh",
    tagline: "Bright everyday cups",
    description: "Lemongrass — citrusy, light and endlessly sippable.",
    image: "/products/lemongrass-50g-jar-front.jpg",
    imageAlt: "TMUG lemongrass tea 50g jar with dried lemongrass",
    productIds: ["lemongrass"],
    accent: "#8FC93A",
  },
  {
    id: "green-tea",
    slug: "green-tea",
    name: "Green Tea",
    tagline: "Long leaf, light cup",
    description: "Darjeeling long leaf — delicate, floral and smooth.",
    image: "/products/darjeeling-100g-jar-front.jpg",
    imageAlt: "TMUG Darjeeling green tea 100g jar with loose long leaf green tea",
    productIds: ["darjeeling-green"],
    accent: "#2E7D4F",
  },
  {
    id: "chai",
    slug: "chai",
    name: "Chai",
    tagline: "Kadak & comforting",
    description: "Premium and Gold CTC — strong, malty chai for proper doodh chai mornings.",
    image: "/products/gold-250g-pouch-front.jpg",
    imageAlt: "TMUG Gold chai patti tea 250g pouch",
    productIds: ["premium-tea", "gold-tea"],
    accent: "#0E513B",
  },
  {
    id: "premium",
    slug: "premium",
    name: "Premium Chai",
    tagline: "Your everyday kadak",
    description: "Strong CTC chai patti for the perfect doodh chai, every morning.",
    image: "/products/premium-250g-pouch-front.jpg",
    imageAlt: "TMUG Premium chai patti tea 250g pouch",
    productIds: ["premium-tea"],
    accent: "#0E513B",
  },
  {
    id: "gold",
    slug: "gold",
    name: "Gold Chai",
    tagline: "Bold & malty",
    description: "Assam-style CTC with depth and character. For serious chai people.",
    image: "/products/gold-250g-pouch-front.jpg",
    imageAlt: "TMUG Gold chai patti tea 250g pouch",
    productIds: ["gold-tea"],
    accent: "#D8A62A",
  },
  {
    id: "best-sellers",
    slug: "best-sellers",
    name: "Best Sellers",
    tagline: "Crowd favourites",
    description: "The teas everyone keeps reordering.",
    image: "/products/butterfly-pea-100g-pouch-front.jpg",
    imageAlt: "TMUG blue butterfly pea flower tea 100g pouch",
    productIds: ["butterfly-pea", "hibiscus", "darjeeling-green", "gold-tea"],
    accent: "#4A6FD4",
  },
];

export function getCollection(idOrSlug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}

export function collectionProducts(c: Collection): Product[] {
  return c.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

/** Header dropdown tree structure. */
export interface CollectionNavNode {
  label: string;
  href: string;
  accent?: string;
  children?: { label: string; href: string }[];
}

export const COLLECTION_NAV: CollectionNavNode[] = [
  { label: "All Teas", href: "/collections?c=all-teas", accent: "#D8A62A" },
  {
    label: "Flower Teas",
    href: "/collections?c=flower-teas",
    accent: "#D84F6D",
    children: [
      { label: "Butterfly Pea Flower Tea", href: "/products/butterfly-pea-flower-tea" },
      { label: "Chamomile Flower Tea", href: "/products/chamomile-flower-tea" },
      { label: "Hibiscus Flower Tea", href: "/products/hibiscus-flower-tea" },
    ],
  },
  {
    label: "Herbal & Fresh",
    href: "/collections?c=herbal-fresh",
    accent: "#8FC93A",
    children: [{ label: "Lemongrass Tea", href: "/products/lemongrass-tea" }],
  },
  {
    label: "Green Tea",
    href: "/collections?c=green-tea",
    accent: "#2E7D4F",
    children: [{ label: "Darjeeling Green Tea", href: "/products/darjeeling-green-tea" }],
  },
  {
    label: "Chai",
    href: "/collections?c=chai",
    accent: "#0E513B",
    children: [
      { label: "TMUG Premium Tea", href: "/products/tmug-premium-tea" },
      { label: "TMUG Gold Tea", href: "/products/tmug-gold-tea" },
    ],
  },
  { label: "Best Sellers", href: "/collections?c=best-sellers", accent: "#4A6FD4" },
];
