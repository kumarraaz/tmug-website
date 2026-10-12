/**
 * Homepage video showcase ("A Little More About Your Tea").
 *
 * To make a card play a real video, set `youtubeId` to the 11-character YouTube video ID
 * (the part after `v=` in a watch URL, e.g. "dQw4w9WgXcQ"). Until it is set the card shows a
 * "Coming soon" badge and is not clickable. Edit `title` / `description` freely.
 * `image` is any file under /public; `fit: "contain"` shows wide banners whole on the `bg` colour.
 */
export interface VideoCard {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  image: string;
  fit: "cover" | "contain";
  bg: string;
}

export const VIDEO_SECTION = {
  heading: "A Little More About Your Tea",
  subheading: "Short films to help you pick, brew and enjoy your cup.",
};

export const VIDEO_CARDS: VideoCard[] = [
  {
    id: "discover-tmug",
    title: "Discover TMUG",
    description: "Meet the brand and the teas behind it.",
    youtubeId: "",
    image: "/shop/chamomile-poster.jpg",
    fit: "cover",
    bg: "#144E25",
  },
  {
    id: "art-of-brewing",
    title: "The Art of Brewing Tea",
    description: "A closer look at the brewing ritual.",
    youtubeId: "",
    image: "/shop/lemongrass-poster.jpg",
    fit: "cover",
    bg: "#8A4B2A",
  },
  {
    id: "tea-collection",
    title: "Meet Our Tea Collection",
    description: "A walk through the TMUG lineup.",
    youtubeId: "",
    image: "/banners/tmug-sip-happens.png",
    fit: "contain",
    bg: "#E9DDFB",
  },
  {
    id: "perfect-ritual",
    title: "Your Perfect Tea Ritual",
    description: "Make room for a moment that is yours.",
    youtubeId: "",
    image: "/shop/butterfly-pea-poster.jpg",
    fit: "cover",
    bg: "#4B2E83",
  },
  {
    id: "perfect-cup",
    title: "How to Brew the Perfect Cup",
    description: "Simple steps for a better cup.",
    youtubeId: "",
    image: "/shop/hibiscus-poster.jpg",
    fit: "cover",
    bg: "#A3162B",
  },
  {
    id: "favourite-tea",
    title: "Find Your Favourite Tea",
    description: "Pick the tea that suits your mood.",
    youtubeId: "",
    image: "/banners/tmug-pick-your-sip.png",
    fit: "contain",
    bg: "#B9A4F5",
  },
];
