import { Suspense } from "react";
import { AdminShell } from "@/components/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-6 py-14 text-sm text-muted">Memuat panel admin...</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
