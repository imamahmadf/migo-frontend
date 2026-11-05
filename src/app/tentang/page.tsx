import { AboutSection } from "@/components/profile-sections";
import { SitePage } from "@/components/site-page";
import { getSitePage } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";

const page = getSitePage("/tentang");

export const metadata = createPageMetadata({
  title: page.label,
  description: page.description,
  path: page.path,
});

export default function TentangPage() {
  return <SitePage path="/tentang">{() => <AboutSection heading="h1" />}</SitePage>;
}
