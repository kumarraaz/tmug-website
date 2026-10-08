"use client";

import { AnnouncementBar } from "./Header";
import Header from "./Header";
import Footer from "./Footer";
import SiteOverlays from "./SiteOverlays";

// TMUG Homepage Sequence (Hero → Collections → Best Sellers → Open/Reveal → Why TMUG → Brand/Story)
import Hero from "./Hero"; // 03. Hero Banner Slider (Storefront Campaign Window)
import TrustStrip from "./TrustStrip"; // 04. Trust / Highlights Strip
import ShopCollections from "./ShopCollections"; // 05. Shop by Product / Collections (Product Slider)
import BestSellers from "./BestSellers"; // 06. Best Sellers & Half-Screen 50/50 Showcase
import OpenRevealSection from "./OpenRevealSection"; // 07. Open / Reveal Experience (3D Box & Flower Shower)
import WhyTmug from "./WhyTmug"; // 08. Why TMUG (Redesigned, large packaging, flower watermark)
import MadeWithRealTea from "./MadeWithRealTea"; // 09. Made With Real Tea / Ingredients Transparency
import TeaStory from "./TeaStory"; // 10. Tea Story / Daily Rituals
import LifestyleGallery from "./LifestyleGallery"; // 11. Lifestyle Gallery ("Made for moments that linger")
import BrandProof from "./BrandProof"; // 12. Honest Quality & Community Proof
import CustomerLove from "./CustomerLove"; // 13. Customer Love / Reviews
import AvailableInStores from "./AvailableInStores"; // 14. Available Where You Shop (Amazon & WhatsApp)
import FinalCta from "./FinalCta"; // 15. Final Conversion CTA

export default function HomeClient() {
  return (
    <>
      {/* 01. Announcement / top promotional strip */}
      <AnnouncementBar />

      {/* 02. Premium navigation (Warm Ivory / White, Zero Green UI) */}
      <Header />

      <main className="relative">
        {/* 03. HERO BANNER SLIDER (Large Promotional Storefront Campaign Window) */}
        <Hero />

        {/* 04. Value-prop highlights strip */}
        <TrustStrip />

        {/* 05. SHOP BY PRODUCT / COLLECTIONS (Horizontal Product Carousel) */}
        <ShopCollections />

        {/* 06. BEST SELLERS & HALF-SCREEN 50/50 EXPERIENCE */}
        <BestSellers />

        {/* 07. OPEN / REVEAL EXPERIENCE (3D Box, Flower Shower, Emoji Feedback) */}
        <OpenRevealSection />

        {/* 08. WHY TMUG? (Redesigned, large packs, flower watermark, zero green UI) */}
        <WhyTmug />

        {/* 09. Made with real tea / real botanical ingredients */}
        <MadeWithRealTea />

        {/* 10. Product / Tea story rituals */}
        <TeaStory />

        {/* 11. Lifestyle Gallery ("Made for moments that linger") */}
        <LifestyleGallery />

        {/* 12. Honest Quality / Social proof */}
        <BrandProof />

        {/* 13. Customer love / reviews */}
        <CustomerLove />

        {/* 14. Available where you shop (Amazon Brand Store & WhatsApp Concierge) */}
        <AvailableInStores />

        {/* 15. Final conversion CTA */}
        <FinalCta />
      </main>

      {/* 16. Footer */}
      <Footer />

      {/* 17. Existing functional overlays: CartDrawer, SearchOverlay, PromoModal, WhatsAppButton */}
      <SiteOverlays />
    </>
  );
}
