"use client";

import { AnnouncementBar } from "./Header";
import Header from "./Header";
import Footer from "./Footer";
import SiteOverlays from "./SiteOverlays";
import Hero from "./Hero";
import ValueStrip from "./ValueStrip";
import ProductRail from "./ProductRail";
import CollectionsShowcase from "./CollectionsShowcase";
import FeaturedProduct from "./FeaturedProduct";
import ProductGrid from "./ProductGrid";
import Editorial from "./Editorial";
import StorySection from "./StorySection";
import WhyTmug from "./WhyTmug";
import TrustBand from "./TrustBand";
import FinalCta from "./FinalCta";
import { PRODUCTS } from "@/data/products";

/**
 * Homepage composition — Phase 1.5 D2C redesign:
 * hero → bestseller rail → collections → featured product →
 * flower rail → editorial → full grid → story → trust → CTA.
 */
export default function HomeClient() {
  const bestsellers = PRODUCTS.filter((p) => p.featured);
  const flowerTeas = ["butterfly-pea", "chamomile", "hibiscus"]
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <ValueStrip />
        <ProductRail
          title="Bestsellers, obviously."
          subtitle="Everyone's favourite cups"
          products={bestsellers}
          accent="#D8A62A"
        />
        <CollectionsShowcase />
        <FeaturedProduct />
        <ProductRail
          title="Flower power."
          subtitle="Caffeine-free & colourful"
          products={flowerTeas}
          accent="#D84F6D"
        />
        <Editorial />
        <ProductGrid />
        <StorySection />
        <WhyTmug />
        <TrustBand />
        <FinalCta />
      </main>
      <Footer />
      <SiteOverlays />
    </>
  );
}
