"use client";

import { useSiteControls } from "@/lib/site-controls-context";
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
import TeaRitualsAndRecipes from "./TeaRitualsAndRecipes"; // 11. Rituals & Creative Recipes
import LifestyleGallery from "./LifestyleGallery"; // 12. Lifestyle Gallery ("Made for moments that linger")
import BrandProof from "./BrandProof"; // 13. Honest Quality & Community Proof
import CustomerLove from "./CustomerLove"; // 14. Customer Love / Reviews
import AvailableInStores from "./AvailableInStores"; // 15. Available Where You Shop (Amazon & WhatsApp)
import FinalCta from "./FinalCta"; // 16. Final Conversion CTA

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
        {sv?.hero?.enabled !== false && <Hero />}

        {/* 04. Value-prop highlights strip */}
        {sv?.trustStrip?.enabled !== false && <TrustStrip />}

        {/* 05. SHOP BY PRODUCT / COLLECTIONS (Horizontal Product Carousel) */}
        {sv?.collections?.enabled !== false && <ShopCollections />}

        {/* 06. BEST SELLERS & HALF-SCREEN 50/50 EXPERIENCE */}
        {sv?.bestSellers?.enabled !== false && <BestSellers />}

        {/* 07. OPEN / REVEAL EXPERIENCE (3D Box, Flower Shower, Emoji Feedback) */}
        {sv?.openReveal?.enabled !== false && <OpenRevealSection />}

        {/* 08. WHY TMUG? (Redesigned, large packs, flower watermark, zero green UI) */}
        {sv?.whyTmug?.enabled !== false && <WhyTmug />}

        {/* 09. Made with real tea / real botanical ingredients */}
        {sv?.madeWithRealTea?.enabled !== false && <MadeWithRealTea />}

        {/* 10. Product / Tea story rituals */}
        {sv?.teaStory?.enabled !== false && <TeaStory />}

        {/* 11. Community rituals & creative recipe showcase */}
        {sv?.ritualsRecipes?.enabled !== false && <TeaRitualsAndRecipes />}

        {/* 12. Lifestyle Gallery ("Made for moments that linger") */}
        {sv?.lifestyleGallery?.enabled !== false && <LifestyleGallery />}

        {/* 13. Honest Quality / Social proof */}
        {sv?.brandProof?.enabled !== false && <BrandProof />}

        {/* 14. Customer love / reviews */}
        {sv?.customerLove?.enabled !== false && <CustomerLove />}

        {/* 15. Available where you shop (Amazon Brand Store & WhatsApp Concierge) */}
        {sv?.availableInStores?.enabled !== false && <AvailableInStores />}

        {/* 16. Final conversion CTA */}
        {sv?.finalCta?.enabled !== false && <FinalCta />}
      </main>

      {/* 17. Footer */}
      {sv?.footer?.enabled !== false && <Footer />}

      {/* 18. Existing functional overlays: CartDrawer, SearchOverlay, PromoModal, WhatsAppButton */}
      <SiteOverlays />
    </>
  );
}
