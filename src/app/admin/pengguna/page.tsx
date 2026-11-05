import { UserAdmin } from "@/components/user-admin";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Pengguna",
  description: "Kelola akun dan peran pengguna perusahaan.",
  path: "/admin/pengguna",
  index: false,
});

export default function AdminUsersPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Pengguna</h1>
      <p className="mt-2 text-sm text-muted">Akses mengikuti peran yang diberikan administrator.</p>
      <div className="mt-8">
        <UserAdmin />
      </div>
    </main>
  );
}
