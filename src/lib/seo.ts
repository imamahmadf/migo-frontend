import type { Metadata } from "next";
import { absoluteUrl, siteConfig, siteNav } from "@/config/site";
import type { FaqItem } from "@/content/faq";

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  index?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path = "/",
  index = true,
}: PageSeo): Metadata {
  const canonical = absoluteUrl(path);
  const isHome = path === "/";
  const documentTitle = isHome ? title : `${title} | ${siteConfig.name}`;

  return {
    title: isHome ? { absolute: documentTitle } : title,
    description,
    alternates: {
      canonical,
      languages: {
        "id-ID": canonical,
      },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: documentTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: documentTitle,
      description,
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

export function organizationJsonLd(profile?: {
  legalName?: string;
  description?: string;
  locality?: string;
}) {
  const organizationId = absoluteUrl("/#organization");
  const websiteId = absoluteUrl("/#website");
  const legalName = profile?.legalName || siteConfig.legalName;
  const description = profile?.description || siteConfig.description;
  const locality = profile?.locality || siteConfig.locality;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        legalName,
        url: siteConfig.url,
        description,
        address: {
          "@type": "PostalAddress",
          addressLocality: locality,
          addressCountry: "ID",
        },
        ...(siteConfig.socialProfiles.length > 0 ? { sameAs: siteConfig.socialProfiles } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.url,
        name: siteConfig.name,
        description,
        inLanguage: "id-ID",
        publisher: { "@id": organizationId },
        hasPart: siteNav.map((item) => ({
          "@type": "WebPage",
          name: item.label,
          description: item.description,
          url: absoluteUrl(item.path),
        })),
      },
      {
        "@type": "ItemList",
        "@id": absoluteUrl("/#menu"),
        name: "Menu Migo",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: siteNav.length,
        itemListElement: siteNav.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          description: item.description,
          url: absoluteUrl(item.path),
        })),
      },
    ],
  };
}

export function webPageJsonLd({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(`${path}#webpage`),
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#organization") },
    inLanguage: "id-ID",
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
