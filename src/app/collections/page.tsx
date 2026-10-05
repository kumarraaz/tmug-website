import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import CollectionsPage from "@/components/CollectionsPage";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse TMUG tea collections — flower teas, green tea, premium chai and gold chai. Find your perfect cup.",
  alternates: { canonical: `${siteConfig.url}/collections` },
  openGraph: {
    title: "TMUG Collections",
    description: "Flower teas, green tea, premium & gold chai — shop by mood.",
    url: `${siteConfig.url}/collections`,
    type: "website",
  },
};

export default function CollectionsRoute() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Collections"
        title={<>Shop by <span className="text-tea-green">mood.</span></>}
        copy="Seven collections, each with its own colour and character. Pick a vibe, find your tea."
        accent="#D8A62A"
      />
      <CollectionsPage />
    </PageShell>
  );
}
