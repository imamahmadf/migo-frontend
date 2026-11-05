import { notFound } from "next/navigation";
import { ContentAdmin } from "@/components/content-admin";
import { findContentSection, type ContentSectionId } from "@/content/content-sections";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Konten",
  description: "Ubah satu bagian profil perusahaan.",
  path: "/admin/konten",
  index: false,
});

export default async function AdminContentSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const item = findContentSection(section);
  if (!item) notFound();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">{item.label}</h1>
      <p className="mt-2 text-sm text-muted">{item.description}</p>
      <div className="mt-8">
        <ContentAdmin section={item.id as ContentSectionId} />
      </div>
    </main>
  );
}
