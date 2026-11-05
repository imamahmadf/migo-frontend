import { StepsSection } from "@/components/profile-sections";
import { SitePage } from "@/components/site-page";
import { getSitePage } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";

const page = getSitePage("/cara-kerja");

export const metadata = createPageMetadata({
  title: page.label,
  description: page.description,
  path: page.path,
});

export default function CaraKerjaPage() {
  return <SitePage path="/cara-kerja">{(profile) => <StepsSection profile={profile} heading="h1" />}</SitePage>;
}
