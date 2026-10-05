import type { Collection, Product, ProductVariant } from "@/types";

/* ============================================================================
 * TMUG PRODUCT CATALOG — the single source of truth for all product data.
 *
 * ⚠️  PRICES ARE PLACEHOLDERS.
 * Real MRP has NOT been provided yet. Replace every `price` / `compareAtPrice`
 * below with the real selling price before launch, then set
 * `pricesAreReal: true` in src/config/site.ts.
 * ========================================================================== */

const img = (slug: string, kind: "front" | "back" | "fssai", alt: string) => ({
  src: `/products/${slug}.jpg`,
  alt,
  kind,
});

function variant(
  productId: string,
  weight: string,
  pack: "jar" | "pouch",
  price: number,
  compareAtPrice: number | undefined,
  images: ReturnType<typeof img>[],
): ProductVariant {
  const label = `${weight} ${pack === "jar" ? "Jar" : "Pouch"}`;
  return {
    id: `${productId}-${weight}-${pack}`,
    sku: `TMUG-${productId.toUpperCase()}-${weight.toUpperCase()}-${pack.toUpperCase()}`,
    label,
    weight,
    pack,
    price,
    compareAtPrice,
    images,
    inStock: true,
  };
}

export const PRODUCTS: Product[] = [
  {
    id: "butterfly-pea",
    slug: "butterfly-pea-flower-tea",
    name: "Butterfly Pea Flower Tea",
    tagline: "The blue tea that changes colour.",
    category: "herbal-flower",
    description:
      "Whole dried butterfly pea (aparajita) flowers. Brews a vivid natural blue — add a squeeze of lemon and watch it turn violet. Caffeine-free and endlessly fun to serve, hot or iced.",
    brewGuide:
      "Add 1 tsp of flowers to 200ml hot water (85–90°C). Steep 3–5 minutes, strain and sip. For iced tea, brew double-strength and pour over ice with lemon.",
    ingredients: "100% dried butterfly pea (aparajita) flowers. No added flavours or colours.",
    featured: true,
    seoTitle: "Butterfly Pea Flower Tea (Blue Tea) Online India | TMUG",
    metaDescription:
      "Buy TMUG Butterfly Pea Flower Tea online — whole dried aparajita flowers that brew natural blue. Available in 50g jar & 100g pouch.",
    variants: [
      variant("butterfly-pea", "50g", "jar", 349, 399, [
        img("butterfly-pea-50g-jar-front", "front", "TMUG butterfly pea flower tea 50g jar with dried blue flowers"),
        img("butterfly-pea-50g-jar-back", "back", "Back of TMUG butterfly pea flower tea 50g jar with ingredients and brewing steps"),
        img("butterfly-pea-50g-jar-fssai", "fssai", "TMUG butterfly pea flower tea 50g jar showing FSSAI and packer details"),
      ]),
      variant("butterfly-pea", "100g", "pouch", 449, 549, [
        img("butterfly-pea-100g-pouch-front", "front", "TMUG blue butterfly pea flower tea 100g pouch"),
        img("butterfly-pea-100g-pouch-back", "back", "Back of TMUG butterfly pea flower tea 100g pouch with brewing steps"),
      ]),
    ],
  },
  {
    id: "chamomile",
    slug: "chamomile-flower-tea",
    name: "Chamomile Flower Tea",
    tagline: "Slow evenings in a cup.",
    category: "herbal-flower",
    description:
      "Whole dried chamomile (babune ke phool) flowers with a soft, apple-like aroma. A gentle caffeine-free brew for winding down — no drama, just calm.",
    brewGuide:
      "Add 1 tsp of flowers to 200ml hot water (85–90°C). Steep 4–5 minutes, strain and sip. Lovely with a drizzle of honey.",
    ingredients: "100% dried chamomile flowers. No added flavours or colours.",
    seoTitle: "Chamomile Flower Tea Online India | TMUG",
    metaDescription:
      "Buy TMUG Chamomile Flower Tea online — whole dried babune ke phool, gentle caffeine-free brew. 50g jar & 100g pouch.",
    variants: [
      variant("chamomile", "50g", "jar", 349, 399, [
        img("chamomile-50g-jar-front", "front", "TMUG chamomile flower tea 50g jar with dried chamomile flowers"),
        img("chamomile-50g-jar-back", "back", "Back of TMUG chamomile flower tea 50g jar with ingredients and brewing steps"),
        img("chamomile-50g-jar-fssai", "fssai", "TMUG chamomile flower tea 50g jar showing FSSAI and packer details"),
      ]),
      variant("chamomile", "100g", "pouch", 449, 549, [
        img("chamomile-100g-pouch-front", "front", "TMUG chamomile flower tea 100g pouch"),
        img("chamomile-100g-pouch-back", "back", "Back of TMUG chamomile flower tea 100g pouch with brewing steps"),
      ]),
    ],
  },
  {
    id: "hibiscus",
    slug: "hibiscus-flower-tea",
    name: "Hibiscus Flower Tea",
    tagline: "Tangy, ruby-red, ice-ready.",
    category: "herbal-flower",
    description:
      "Dried red hibiscus (gudhal) petals that brew a bold ruby cup with a naturally tangy kick. Caffeine-free. Made for iced teas, coolers and slow summer afternoons.",
    brewGuide:
      "Add 1 tsp of petals to 200ml hot water (85–90°C). Steep 3–5 minutes and strain. For iced tea, brew double-strength, chill and serve over ice.",
    ingredients: "100% dried hibiscus petals. No added flavours or colours.",
    featured: true,
    seoTitle: "Hibiscus Flower Tea Online India | TMUG",
    metaDescription:
      "Buy TMUG Hibiscus Flower Tea online — dried red gudhal petals, tangy caffeine-free brew. 50g jar & 100g pouch.",
    variants: [
      variant("hibiscus", "50g", "jar", 349, 399, [
        img("hibiscus-50g-jar-front", "front", "TMUG hibiscus flower tea 50g jar with dried red hibiscus petals"),
        img("hibiscus-50g-jar-back", "back", "Back of TMUG hibiscus flower tea 50g jar with ingredients and brewing steps"),
        img("hibiscus-50g-jar-fssai", "fssai", "TMUG hibiscus flower tea 50g jar showing FSSAI and packer details"),
      ]),
      variant("hibiscus", "100g", "pouch", 449, 549, [
        img("hibiscus-100g-pouch-front", "front", "TMUG hibiscus flower tea 100g pouch"),
        img("hibiscus-100g-pouch-back", "back", "Back of TMUG hibiscus flower tea 100g pouch with brewing steps"),
      ]),
    ],
  },
  {
    id: "lemongrass",
    slug: "lemongrass-tea",
    name: "Lemongrass Tea",
    tagline: "Bright, citrusy, everyday fresh.",
    category: "herbal-flower",
    description:
      "Dried lemongrass (nimbu ghas) leaves with a clean citrus aroma. Light, refreshing and caffeine-free — the easy everyday cup that never gets boring.",
    brewGuide:
      "Add 1 tsp of leaves to 200ml hot water (90°C). Steep 3–5 minutes and strain. Also great blended with green tea or ginger.",
    ingredients: "100% dried lemongrass leaves. No added flavours or colours.",
    seoTitle: "Lemongrass Tea Online India | TMUG",
    metaDescription:
      "Buy TMUG Lemongrass Tea online — dried nimbu ghas leaves, fresh citrusy caffeine-free brew. 50g jar & 100g pouch.",
    variants: [
      variant("lemongrass", "50g", "jar", 329, 379, [
        img("lemongrass-50g-jar-front", "front", "TMUG lemongrass tea 50g jar with dried lemongrass"),
        img("lemongrass-50g-jar-back", "back", "Back of TMUG lemongrass tea 50g jar with ingredients and brewing steps"),
        img("lemongrass-50g-jar-fssai", "fssai", "TMUG lemongrass tea 50g jar showing FSSAI and packer details"),
      ]),
      variant("lemongrass", "100g", "pouch", 429, 499, [
        img("lemongrass-100g-pouch-front", "front", "TMUG lemongrass tea 100g pouch"),
        img("lemongrass-100g-pouch-back", "back", "Back of TMUG lemongrass tea 100g pouch with brewing steps"),
      ]),
    ],
  },
  {
    id: "darjeeling-green",
    slug: "darjeeling-green-tea",
    name: "Darjeeling Green Tea",
    tagline: "Long leaves, mountain character.",
    category: "green-tea",
    description:
      "Long loose-leaf green tea from Darjeeling gardens. Delicate, floral and smooth — the connoisseur’s everyday green, packed to keep the leaf whole.",
    brewGuide:
      "Add 1 tsp of leaves to 200ml water at 80–85°C (not boiling). Steep 2–3 minutes and strain. Re-steep the leaves once for a lighter second cup.",
    ingredients: "100% Darjeeling green tea, long loose leaf.",
    featured: true,
    seoTitle: "Darjeeling Green Tea (Loose Leaf) Online India | TMUG",
    metaDescription:
      "Buy TMUG Darjeeling Green Tea online — long loose-leaf green tea in a 100g jar. Delicate, floral, smooth.",
    variants: [
      variant("darjeeling-green", "100g", "jar", 499, 599, [
        img("darjeeling-100g-jar-front", "front", "TMUG Darjeeling green tea 100g jar with loose long leaf green tea"),
        img("darjeeling-100g-jar-back", "back", "Back of TMUG Darjeeling green tea 100g jar with ingredients and brewing steps"),
        img("darjeeling-100g-jar-fssai", "fssai", "TMUG Darjeeling green tea 100g jar showing FSSAI and packer details"),
      ]),
    ],
  },
  {
    id: "premium-tea",
    slug: "tmug-premium-tea",
    name: "TMUG Premium Tea",
    tagline: "Kadak chai, done right.",
    category: "chai",
    description:
      "A strong CTC chai patti blend for that proper kadak morning cup. Brews bold with milk and holds its own with masala — the workhorse of Indian kitchens.",
    brewGuide:
      "Boil 1 tsp per cup with water, add milk and simmer 2–3 minutes. Sweeten to taste. Add crushed ginger or cardamom for masala chai.",
    ingredients: "CTC black tea blend.",
    seoTitle: "TMUG Premium Chai Patti Online India",
    metaDescription:
      "Buy TMUG Premium Tea online — strong CTC chai patti for kadak doodh chai. 250g & 500g pouches.",
    variants: [
      variant("premium-tea", "250g", "pouch", 199, 249, [
        img("premium-250g-pouch-front", "front", "TMUG Premium chai patti tea 250g pouch"),
        img("premium-250g-pouch-back", "back", "Back of TMUG Premium tea 250g pouch"),
      ]),
      variant("premium-tea", "500g", "pouch", 379, 449, [
        img("premium-500g-pouch-front", "front", "TMUG Premium chai patti tea 500g pouch"),
        img("premium-500g-pouch-back", "back", "Back of TMUG Premium tea 500g pouch"),
      ]),
    ],
  },
  {
    id: "gold-tea",
    slug: "tmug-gold-tea",
    name: "TMUG Gold Tea",
    tagline: "Bold, malty, unapologetic.",
    category: "chai",
    description:
      "A rich Assam-style CTC blend with a malty depth and golden liquor. For chai lovers who like their cup strong, bright and full of character.",
    brewGuide:
      "Boil 1 tsp per cup with water, add milk and simmer 2–3 minutes. Sweeten to taste. Stands up beautifully to spices.",
    ingredients: "CTC black tea blend (Assam style).",
    featured: true,
    seoTitle: "TMUG Gold Chai Patti Online India",
    metaDescription:
      "Buy TMUG Gold Tea online — bold Assam-style CTC chai patti, rich and malty. 250g & 500g pouches.",
    variants: [
      variant("gold-tea", "250g", "pouch", 229, 279, [
        img("gold-250g-pouch-front", "front", "TMUG Gold chai patti tea 250g pouch"),
        img("gold-250g-pouch-back", "back", "Back of TMUG Gold tea 250g pouch"),
      ]),
      variant("gold-tea", "500g", "pouch", 429, 499, [
        img("gold-500g-pouch-front", "front", "TMUG Gold chai patti tea 500g pouch"),
        img("gold-500g-pouch-back", "back", "Back of TMUG Gold tea 500g pouch"),
      ]),
    ],
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "herbal-flower",
    slug: "herbal-flower-teas",
    name: "Herbal Flower Teas",
    tagline: "Caffeine-free & colourful",
    description: "Whole dried flowers that brew beautiful. Butterfly pea, chamomile, hibiscus and lemongrass.",
    image: "/products/butterfly-pea-50g-jar-front.jpg",
    imageAlt: "TMUG butterfly pea flower tea 50g jar with dried blue flowers",
    productIds: ["butterfly-pea", "chamomile", "hibiscus", "lemongrass"],
    accent: "#7C9A5B",
  },
  {
    id: "green-tea",
    slug: "green-tea",
    name: "Green Tea",
    tagline: "Long leaf, light cup",
    description: "Single-origin style Darjeeling long leaf — delicate, floral and smooth.",
    image: "/products/darjeeling-100g-jar-front.jpg",
    imageAlt: "TMUG Darjeeling green tea 100g jar with loose long leaf green tea",
    productIds: ["darjeeling-green"],
    accent: "#286021",
  },
  {
    id: "premium-chai",
    slug: "premium-chai",
    name: "Premium Chai",
    tagline: "Your everyday kadak",
    description: "Strong CTC chai patti for the perfect doodh chai, every single morning.",
    image: "/products/premium-250g-pouch-front.jpg",
    imageAlt: "TMUG Premium chai patti tea 250g pouch",
    productIds: ["premium-tea"],
    accent: "#B07C1F",
  },
  {
    id: "gold-chai",
    slug: "gold-chai",
    name: "Gold Chai",
    tagline: "Bold & malty",
    description: "Assam-style CTC with depth and character. For serious chai people.",
    image: "/products/gold-250g-pouch-front.jpg",
    imageAlt: "TMUG Gold chai patti tea 250g pouch",
    productIds: ["gold-tea"],
    accent: "#DBA51E",
  },
];

/* ---------- helpers ---------- */

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getVariant(product: Product, variantId: string): ProductVariant {
  return product.variants.find((v) => v.id === variantId) ?? product.variants[0];
}

export function frontImage(v: ProductVariant) {
  return v.images.find((i) => i.kind === "front") ?? v.images[0];
}

export function collectionProducts(c: Collection): Product[] {
  return c.productIds
    .map(getProduct)
    .filter((p): p is Product => Boolean(p));
}
