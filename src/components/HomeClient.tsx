"use client";

import { useState } from "react";
import type { Collection } from "@/types";
import { AnnouncementBar } from "./Header";
import Header from "./Header";
import Hero from "./Hero";
import ValueStrip from "./ValueStrip";
import Collections from "./Collections";
import ProductGrid from "./ProductGrid";
import ProductQuickView from "./ProductQuickView";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import PromoModal from "./PromoModal";
import WhatsAppButton from "./WhatsAppButton";
import SupportChat from "./SupportChat";
import Story from "./Story";
import WhyTmug from "./WhyTmug";
import TrustBand from "./TrustBand";
import FinalCta from "./FinalCta";
import Footer from "./Footer";

/** Client shell for the one-page storefront: section order + overlay state. */
export default function HomeClient() {
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  const handleSelectCollection = (c: Collection | null) => {
    setActiveCollection(c);
    // Give the grid a beat to filter, then scroll to it
    setTimeout(() => {
      document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <ValueStrip />
        <Collections onSelect={handleSelectCollection} activeId={activeCollection?.id ?? null} />
        <ProductGrid activeCollection={activeCollection} onClear={() => setActiveCollection(null)} />
        <Story />
        <WhyTmug />
        <TrustBand />
        <FinalCta />
      </main>
      <Footer />

      {/* Overlays */}
      <ProductQuickView />
      <CartDrawer />
      <SearchOverlay />
      <PromoModal />
      <WhatsAppButton />
      <SupportChat />
    </>
  );
}
