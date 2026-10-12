"use client";

import { useSiteControls } from "@/lib/site-controls-context";
import { AnnouncementBar } from "./Header";
import Header from "./Header";
import Footer from "./Footer";
import SiteOverlays from "./SiteOverlays";
import TrustStrip from "./TrustStrip"; // 04. Trust / Highlights Strip
import SectionStyle from "./SectionStyle";
import VideoSection from "./VideoSection";
import NewArrivals from "./NewArrivals";
import Testimonials from "./Testimonials";
import OurStory from "./OurStory";
import BlogSection from "./BlogSection";
import ImageOverrides from "./ImageOverrides";

// TMUG Homepage Sequence (Hero → Collections → Best Sellers → Open/Reveal → Why TMUG → Brand/Story)
import Hero from "./Hero"; // 03. Hero Banner Slider (Storefront Campaign Window)
import ShopCollections from "./ShopCollections"; // 05. Shop by Product / Collections (Product Slider)
import BestSellers from "./BestSellers"; // 06. Best Sellers & Half-Screen 50/50 Showcase

export default function HomeClient() {
  const { controls } = useSiteControls();
  const sv = controls?.sectionsVisual;

  return (
    <>
      {/* 01. Announcement / top promotional strip */}
      <AnnouncementBar />

      {/* 02. Premium navigation (Warm Charcoal / Ivory, Zero Green UI) */}
      <Header />

      <main className="relative">
        {/* 03. HERO BANNER SLIDER (Large Promotional Storefront Campaign Window) */}
        {sv?.hero?.enabled !== false && (
          <SectionStyle k="hero">
            <Hero />
          </SectionStyle>
        )}

        {/* 04. Value-prop highlights strip */}
        {sv?.trustStrip?.enabled !== false && (
          <SectionStyle k="trustStrip">
            <TrustStrip />
          </SectionStyle>
        )}

        {/* 05. SHOP BY PRODUCT / COLLECTIONS (Horizontal Product Carousel) */}
        {sv?.collections?.enabled !== false && (
          <SectionStyle k="collections">
            <ShopCollections />
          </SectionStyle>
        )}

        {/* 05b. Brand video, directly below Shop by Product */}
        <VideoSection />

        {/* 05c. New Arrivals → Testimonials → Our Story → Journal */}
        <NewArrivals />
        <Testimonials />
        <OurStory />
        <BlogSection />

        {/* 06. BEST SELLERS & HALF-SCREEN 50/50 EXPERIENCE */}
        {sv?.bestSellers?.enabled !== false && (
          <SectionStyle k="bestSellers">
            <BestSellers />
          </SectionStyle>
        )}
      </main>

      {/* 17. Footer */}
      {sv?.footer?.enabled !== false && (
        <SectionStyle k="footer">
          <Footer />
        </SectionStyle>
      )}

      {/* 18. Existing functional overlays: CartDrawer, SearchOverlay, PromoModal, WhatsAppButton */}
      <SiteOverlays />
      <ImageOverrides />
    </>
  );
}
