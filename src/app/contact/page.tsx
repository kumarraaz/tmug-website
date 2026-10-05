import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact TMUG — WhatsApp support, email and wholesale enquiries. We're here to help.",
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: {
    title: "Contact TMUG",
    description: "WhatsApp support, email and wholesale — we're here to help.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

export default function ContactRoute() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title={<>Say hello.<br /><span className="text-tea-green">We reply fast.</span></>}
        copy="Orders, brewing questions, bulk enquiries — pick whichever channel suits you."
        accent="#25D366"
      />
      <ContactPage />
    </PageShell>
  );
}
