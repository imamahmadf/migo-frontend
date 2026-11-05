import { PhotoAdmin } from "@/components/photo-admin";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Foto",
  description: "Unggah foto beserta judul dan deskripsi untuk galeri situs.",
  path: "/admin/foto",
  index: false,
});

export default function AdminPhotoPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Foto</h1>
      <p className="mt-2 text-sm text-muted">Setiap foto punya judul dan deskripsi, lalu tampil di galeri situs publik.</p>
      <div className="mt-8">
        <PhotoAdmin />
      </div>
    </main>
  );
}
