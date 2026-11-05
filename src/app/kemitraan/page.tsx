import { PartnerSection } from "@/components/profile-sections";
import { SitePage } from "@/components/site-page";
import { getSitePage } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";

const page = getSitePage("/kemitraan");

export const metadata = createPageMetadata({
  title: page.label,
  description: page.description,
  path: page.path,
});

export default function KemitraanPage() {
  return <SitePage path="/kemitraan">{() => <PartnerSection heading="h1" />}</SitePage>;
}
