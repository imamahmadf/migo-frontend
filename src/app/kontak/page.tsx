import { ContactSection } from "@/components/profile-sections";
import { SitePage } from "@/components/site-page";
import { getSitePage } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";

const page = getSitePage("/kontak");

export const metadata = createPageMetadata({
  title: page.label,
  description: page.description,
  path: page.path,
});

export default function KontakPage() {
  return <SitePage path="/kontak">{(profile) => <ContactSection profile={profile} heading="h1" />}</SitePage>;
}
