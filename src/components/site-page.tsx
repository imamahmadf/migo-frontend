import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { MarketingPage } from "@/components/marketing-page";
import { getSitePage, siteConfig, type SiteNavPath } from "@/config/site";
import { defaultProfile, type CompanyProfileContent } from "@/content/profile";
import { getPublicProfile } from "@/lib/profile";

export function SitePage({
  path,
  children,
}: {
  path: SiteNavPath;
  children: (profile: CompanyProfileContent) => ReactNode;
}) {
  const page = getSitePage(path);

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
          {children(defaultProfile)}
        </MarketingPage>
      }
    >
      <SitePageContent path={path}>{children}</SitePageContent>
    </Suspense>
  );
}

async function SitePageContent({
  path,
  children,
}: {
  path: SiteNavPath;
  children: (profile: CompanyProfileContent) => ReactNode;
}) {
  await connection();
  const profile = await getPublicProfile();
  const page = getSitePage(path);

  return (
    <MarketingPage
      path={page.path}
      title={page.label}
      description={page.description}
      legalName={profile.legalName}
      locality={profile.locality}
    >
      {children(profile)}
    </MarketingPage>
  );
}
