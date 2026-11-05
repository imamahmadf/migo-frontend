import { Suspense } from "react";
import { connection } from "next/server";
import { CompanyProfile } from "@/components/company-profile";
import { JsonLd } from "@/components/json-ld";
import { defaultProfile } from "@/content/profile";
import { siteConfig } from "@/config/site";
import { getPublicFaqs } from "@/lib/faq";
import { getPublicPhotos } from "@/lib/photos";
import { getPublicProfile } from "@/lib/profile";
import { createPageMetadata, organizationJsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

function ProfileDocument({
  profile,
  faqs,
  photos,
}: {
  profile: Awaited<ReturnType<typeof getPublicProfile>>;
  faqs: Awaited<ReturnType<typeof getPublicFaqs>>;
  photos: Awaited<ReturnType<typeof getPublicPhotos>>;
}) {
  return (
    <>
      <JsonLd
        data={organizationJsonLd({
          legalName: profile.legalName,
          description: profile.description,
          locality: profile.locality,
        })}
      />
      <JsonLd
        data={webPageJsonLd({
          title: `${profile.legalName} | Profil Perusahaan`,
          description: profile.description,
          path: "/",
        })}
      />
      <CompanyProfile profile={profile} faqs={faqs} photos={photos} />
    </>
  );
}

async function PublishedProfile() {
  await connection();
  const [profile, faqs, photos] = await Promise.all([getPublicProfile(), getPublicFaqs(), getPublicPhotos()]);
  return <ProfileDocument profile={profile} faqs={faqs} photos={photos} />;
}

export default function Home() {
  return (
    <Suspense fallback={<ProfileDocument profile={defaultProfile} faqs={[]} photos={[]} />}>
      <PublishedProfile />
    </Suspense>
  );
}
