import Link from "next/link";
import { contentSections } from "@/content/content-sections";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Konten",
  description: "Pilih bagian konten profil perusahaan yang ingin diubah.",
  path: "/admin/konten",
  index: false,
});

export default function AdminContentPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Konten situs</h1>
      <p className="mt-2 text-sm text-muted">Setiap bagian profil disimpan di halamannya sendiri.</p>
      <div className="mt-8 grid gap-4">
        {contentSections.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="rounded-3xl border border-line bg-card p-6 transition duration-200 hover:-translate-y-0.5 hover:border-brand/40"
          >
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
