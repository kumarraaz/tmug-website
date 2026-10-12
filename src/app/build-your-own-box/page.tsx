import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import BuildYourBox from "@/components/BuildYourBox";

export const metadata: Metadata = {
  title: "Build Your Own Box",
  description: "Pick your own TMUG teas, choose pack sizes and quantities, and add your custom box to the cart in one tap.",
  alternates: { canonical: `${siteConfig.url}/build-your-own-box` },
};

export default function BuildYourOwnBoxPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Build Your Own Box"
        title="Pick your teas. Make it yours."
        copy="Choose any TMUG teas, set the pack size and quantity for each, and add the whole box to your cart together."
      />
      <BuildYourBox />
    </PageShell>
  );
}
