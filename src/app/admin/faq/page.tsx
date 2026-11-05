import { FaqAdmin } from "@/components/faq-admin";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "FAQ",
  description: "Kelola pertanyaan yang tampil di profil perusahaan.",
  path: "/admin/faq",
  index: false,
});

export default function AdminFaqPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>
      <p className="mt-2 text-sm text-muted">Pertanyaan ini tampil di bagian FAQ pada situs publik.</p>
      <div className="mt-8">
        <FaqAdmin />
      </div>
    </main>
  );
}
