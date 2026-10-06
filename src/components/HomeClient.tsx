"use client";

import { AnnouncementBar } from "./Header";
import Header from "./Header";
import Footer from "./Footer";
import SiteOverlays from "./SiteOverlays";

// 14-Section Homepage Sequence
import Hero from "./Hero"; // 03. Hero Experience
import TrustStrip from "./TrustStrip"; // 04. Trust / Highlights Strip
import ShopCollections from "./ShopCollections"; // 05. Shop Our Collections (Product Slider)
import BrandProof from "./BrandProof"; // 06. Brand / Social Proof
import WhyTmug from "./WhyTmug"; // 08. Why TMUG?
import MadeWithRealTea from "./MadeWithRealTea"; // 09. Made With Real Tea / Ingredients
import TeaStory from "./TeaStory"; // 10. Product / Tea Story
import LifestyleGallery from "./LifestyleGallery"; // 11. Lifestyle / Collaboration Gallery
import AvailableInStores from "./AvailableInStores"; // 12. Available Where You Shop
import CustomerLove from "./CustomerLove"; // 13. Customer Love / Reviews
import FinalCta from "./FinalCta"; // 14. Newsletter / Final CTA

/**
 * TMUG Homepage Visual Redesign
 *
 * Sequence:
 * 01. Announcement / top strip
 * 02. Premium navigation
 * 03. HERO EXPERIENCE (3D Discovery Box, Kulhad Cup & Steaming Leaves, Surrounding Tea packs)
 * 04. Trust / highlights strip (Sticker icons)
 * 05. FEATURED PRODUCT SLIDER (Meet Your New Favourite Tea)
 * 06. SHOP OUR COLLECTIONS (Interactive tabs, full packshots)
 * 07. BRAND / PRESS / SOCIAL PROOF (Tea worth talking about)
 * 08. WHY TMUG? (5-Pack lineup arc & core pillars)
 * 09. MADE WITH REAL TEA / INGREDIENTS (Verified botanical layers)
 * 10. PRODUCT / TEA STORY (More than just a cup of tea - rituals)
 * 11. LIFESTYLE / COLLABORATION GALLERY (Editorial collage)
 * 12. AVAILABLE WHERE YOU SHOP (Official Amazon Brand Store + WhatsApp Concierge)
 * 13. REVIEWS / CUSTOMER LOVE (Real feedback preview & direct chat)
 * 14. FINAL CTA (Ready to make tea more fun?)
 * 15. Footer (Complete links & official store)
 */
export default function HomeClient() {
  return (
    <>
      {/* 01. Announcement / top strip */}
      <AnnouncementBar />

      {/* 02. Premium navigation */}
      <Header />

      <main className="relative">
        {/* 03. Hero Experience */}
        <Hero />

        {/* 04. Trust / highlights strip */}
        <TrustStrip />

        {/* 05. Shop our collections (Interactive Product Slider) */}
        <ShopCollections />

        {/* 07. Brand / Social proof */}
        <BrandProof />

        {/* 08. Why TMUG? */}
        <WhyTmug />

        {/* 09. Made with real tea / real ingredients */}
        <MadeWithRealTea />

        {/* 10. Product / Tea story */}
        <TeaStory />

        {/* 11. Lifestyle / Collaboration gallery */}
        <LifestyleGallery />

        {/* 12. Available where you shop */}
        <AvailableInStores />

        {/* 13. Customer love / reviews */}
        <CustomerLove />

        {/* 14. Final conversion CTA */}
        <FinalCta />
      </main>

      {/* 15. Footer */}
      <Footer />

      {/* Existing functional overlays: Cart, Search, Promo, WhatsApp */}
      <SiteOverlays />
    </>
  );
}
