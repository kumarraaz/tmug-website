"use client";

import { AnnouncementBar } from "./Header";
import Header from "./Header";
import Footer from "./Footer";
import SiteOverlays from "./SiteOverlays";
import Hero from "./Hero";
import ValueStrip from "./ValueStrip";
import CollectionsShowcase from "./CollectionsShowcase";
import ProductRail from "./ProductRail";
import FlowerGrid from "./FlowerGrid";
import StorySection from "./StorySection";
import WhyTmug from "./WhyTmug";
import FeaturedProduct from "./FeaturedProduct";
import ProductGrid from "./ProductGrid";
import TrustBand from "./TrustBand";
import FinalCta from "./FinalCta";
import { PRODUCTS } from "@/data/products";

/**
 * Homepage composition — editorial rhythm, alternating section designs:
 * hero → ticker → mood grid → bestseller rail → flower grid →
 * brand story → why → spotlight → full grid → trust → CTA.
 */
export default function HomeClient() {
  const bestsellers = PRODUCTS.filter((p) => p.featured);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <ValueStrip />
        <CollectionsShowcase />
        <ProductRail
          title="Bestsellers"
          subtitle="Most reordered cups"
          products={bestsellers}
          accent="#D8A62A"
        />
        <FlowerGrid />
        <StorySection />
        <WhyTmug />
        <FeaturedProduct />
        <ProductGrid />
        <TrustBand />
        <FinalCta />
      </main>
      <Footer />
      <SiteOverlays />
    </>
  );
}
