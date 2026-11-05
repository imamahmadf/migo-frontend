import { ContactAdmin } from "@/components/contact-admin";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Pesan",
  description: "Pesan yang dikirim pengunjung lewat formulir hubungi kami.",
  path: "/admin/pesan",
  index: false,
});

export default function AdminMessagesPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Pesan</h1>
      <p className="mt-2 text-sm text-muted">Pesan dari bagian Hubungi kami, beserta status tindak lanjutnya.</p>
      <div className="mt-8">
        <ContactAdmin />
      </div>
    </main>
  );
}
