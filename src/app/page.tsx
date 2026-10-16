import HomeClient from "@/components/HomeClient";
import { getCatalog } from "@/server/catalog";
import { siteConfig } from "@/config/site";
import { jsonLdString } from "@/lib/json-ld";

/**
 * One-page TMUG storefront.
 * Prices in structured data are included only when siteConfig.pricesAreReal
 * is true (real MRP confirmed). Never fabricate ratings/reviews.
 */
export default async function Home() {
  const PRODUCTS = await getCatalog();
  const includePrices = siteConfig.pricesAreReal;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TMUG Teas",
    itemListElement: PRODUCTS.map((p, i) => {
      const v = p.variants[0];
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          description: p.metaDescription,
          brand: { "@type": "Brand", name: "TMUG" },
          image: `${siteConfig.url}${v.images[0].src}`,
          url: `${siteConfig.url}/#shop`,
          ...(includePrices
            ? {
                offers: {
                  "@type": "Offer",
                  priceCurrency: "INR",
                  price: v.price,
                  availability: v.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                  url: `${siteConfig.url}/#shop`,
                },
              }
            : {}),
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(itemList) }}
      />
      <HomeClient />
    </>
  );
}
