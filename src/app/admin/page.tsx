import { AdminDashboard } from "@/components/admin-dashboard";
import { AccountPanel } from "@/components/account-panel";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Dasbor",
  description: "Ringkasan pengguna, konten, dan status situs untuk administrator.",
  path: "/admin",
  index: false,
});

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-14 px-6 py-14">
      <AdminDashboard />
      <section id="keamanan" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight">Keamanan akun</h2>
        <p className="mt-2 text-sm text-muted">Profil Anda dan penggantian kata sandi.</p>
        <div className="mt-8">
          <AccountPanel />
        </div>
      </section>
    </main>
  );
}
