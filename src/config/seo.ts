import type { SeoSettings } from "@/types";
import { siteConfig } from "@/config/site";

/** Default SEO values used when no admin override exists. */
export const defaultSeoSettings: SeoSettings = {
  pageTitle: "TMUG — Modern Indian Tea | Herbal Flower Teas, Green Tea & Chai",
  metaTitle: "TMUG — Modern Indian Tea | Herbal Flower Teas, Green Tea & Chai",
  metaDescription:
    "TMUG is a modern Indian tea brand. Shop butterfly pea, chamomile, hibiscus, lemongrass, Darjeeling green tea and kadak CTC chai — packed fresh, delivered across India.",
  canonicalUrl: siteConfig.url,
  robotsIndex: true,
  robotsFollow: true,
  h1: "Tea, but make it TMUG.",
  ogTitle: "TMUG — Modern Indian Tea",
  ogDescription:
    "Whole-flower herbal teas, Darjeeling green tea and kadak CTC chai. Shop the collection.",
  ogImage: `${siteConfig.url}/og-cover.jpg`,
  topics: "butterfly pea tea, chamomile tea, hibiscus tea, lemongrass tea, darjeeling green tea, ctc chai, buy tea online india",
};
