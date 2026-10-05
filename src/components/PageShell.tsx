"use client";

import type { ReactNode } from "react";
import { AnnouncementBar } from "./Header";
import Header from "./Header";
import Footer from "./Footer";
import SiteOverlays from "./SiteOverlays";

/**
 * Standard page shell for multi-page routes: announcement bar, header,
 * footer and all global overlays. Homepage uses HomeClient instead.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <SiteOverlays />
    </>
  );
}
