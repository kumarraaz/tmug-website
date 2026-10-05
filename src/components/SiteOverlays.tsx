"use client";

import ProductQuickView from "./ProductQuickView";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import PromoModal from "./PromoModal";
import WhatsAppButton from "./WhatsAppButton";
import SupportChat from "./SupportChat";
import FlyToCart from "./motion/FlyToCart";
import Toast from "./cart/Toast";

/** All global overlays — mounted inside ShopProvider on every page. */
export default function SiteOverlays() {
  return (
    <>
      <ProductQuickView />
      <CartDrawer />
      <SearchOverlay />
      <PromoModal />
      <WhatsAppButton />
      <SupportChat />
      <FlyToCart />
      <Toast />
    </>
  );
}
