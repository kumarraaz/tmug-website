/** "Shop by Product" imagery for the 100g pouches: clean pouch by default, lifestyle poster on hover. */
export interface ShopMedia {
  pouch: string;
  poster: string;
  pouchAlt: string;
}

export const SHOP_MEDIA: Record<string, ShopMedia> = {
  lemongrass: {
    pouch: "/shop/lemongrass-pouch.jpg",
    poster: "/shop/lemongrass-poster.jpg",
    pouchAlt: "TMUG Lemongrass Tea 100g pouch",
  },
  "butterfly-pea": {
    pouch: "/shop/butterfly-pea-pouch.jpg",
    poster: "/shop/butterfly-pea-poster.jpg",
    pouchAlt: "TMUG Butterfly Pea Flower Tea 100g pouch",
  },
  chamomile: {
    pouch: "/shop/chamomile-pouch.jpg",
    poster: "/shop/chamomile-poster.jpg",
    pouchAlt: "TMUG Chamomile Flower Tea 100g pouch",
  },
  hibiscus: {
    pouch: "/shop/hibiscus-pouch.jpg",
    poster: "/shop/hibiscus-poster.jpg",
    pouchAlt: "TMUG Hibiscus Flower Tea 100g pouch",
  },
};
