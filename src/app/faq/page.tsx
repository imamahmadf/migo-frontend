import { Suspense } from "react";
import { connection } from "next/server";
import { JsonLd } from "@/components/json-ld";
import { MarketingPage } from "@/components/marketing-page";
import { FaqSection } from "@/components/profile-sections";
import { getSitePage, siteConfig } from "@/config/site";
import { getPublicFaqs } from "@/lib/faq";
import { getPublicProfile } from "@/lib/profile";
import { createPageMetadata, faqPageJsonLd } from "@/lib/seo";

const page = getSitePage("/faq");

export const metadata = createPageMetadata({
  title: page.label,
  description: page.description,
  path: page.path,
});

export default function FaqPage() {
  return (
    <Suspense
      fallback={
        <MarketingPage
          path={page.path}
          title={page.label}
          description={page.description}
          legalName={siteConfig.legalName}
          locality={siteConfig.locality}
        >
          <FaqSection faqs={[]} heading="h1" />
        </MarketingPage>
      }
    >
      <FaqContent />
    </Suspense>
  );
}

async function FaqContent() {
  await connection();
  const [profile, faqs] = await Promise.all([getPublicProfile(), getPublicFaqs()]);

  return (
    <MarketingPage
      path={page.path}
      title={page.label}
      description={page.description}
      legalName={profile.legalName}
      locality={profile.locality}
    >
      {faqs.length > 0 ? <JsonLd data={faqPageJsonLd(faqs)} /> : null}
      <FaqSection faqs={faqs} heading="h1" />
    </MarketingPage>
  );
}
