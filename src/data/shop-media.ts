/** "Shop by Product" imagery: clean pouch by default, lifestyle poster on hover (for the listed pack weight). */
export interface ShopMedia {
  /** Weight of the pouch variant these images belong to (e.g. "100g"). */
  weight: string;
  pouch: string;
  poster: string;
  pouchAlt: string;
  /** Image-stage colour behind the pouch (matches the supplied JPG background). Default white. */
  stageBg?: string;
}

export const SHOP_MEDIA: Record<string, ShopMedia> = {
  lemongrass: {
    weight: "100g",
    pouch: "/shop/lemongrass-pouch.jpg",
    poster: "/shop/lemongrass-poster.jpg",
    pouchAlt: "TMUG Lemongrass Tea 100g pouch",
  },
  "butterfly-pea": {
    weight: "100g",
    pouch: "/shop/butterfly-pea-pouch.jpg",
    poster: "/shop/butterfly-pea-poster.jpg",
    pouchAlt: "TMUG Butterfly Pea Flower Tea 100g pouch",
  },
  chamomile: {
    weight: "100g",
    pouch: "/shop/chamomile-pouch.jpg",
    poster: "/shop/chamomile-poster.jpg",
    pouchAlt: "TMUG Chamomile Flower Tea 100g pouch",
  },
  hibiscus: {
    weight: "100g",
    pouch: "/shop/hibiscus-pouch.jpg",
    poster: "/shop/hibiscus-poster.jpg",
    pouchAlt: "TMUG Hibiscus Flower Tea 100g pouch",
  },
  "premium-tea": {
    weight: "500g",
    pouch: "/shop/premium-pouch.jpg",
    poster: "/shop/premium-poster.jpg",
    pouchAlt: "TMUG Premium Tea 500g pouch",
    stageBg: "#F7F7F7",
  },
  "gold-tea": {
    weight: "500g",
    pouch: "/shop/gold-pouch.jpg",
    poster: "/shop/gold-poster.jpg",
    pouchAlt: "TMUG Gold Tea 500g pouch",
    stageBg: "#F7F7F7",
  },
};
