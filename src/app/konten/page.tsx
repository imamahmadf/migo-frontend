import { CatalogSection } from "@/components/profile-sections";
import { SitePage } from "@/components/site-page";
import { getSitePage } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";

const page = getSitePage("/konten");

export const metadata = createPageMetadata({
  title: page.label,
  description: page.description,
  path: page.path,
});

export default function KontenPage() {
  return <SitePage path="/konten">{() => <CatalogSection heading="h1" />}</SitePage>;
}
