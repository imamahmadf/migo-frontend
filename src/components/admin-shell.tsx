"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { useAuth } from "@/components/auth-provider";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready } = useAuth();
  const isAdmin = user?.role?.id === "admin";

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/masuk?next=${pathname}`);
      return;
    }
    if (!isAdmin) router.replace("/akun");
  }, [ready, user, isAdmin, router, pathname]);

  if (!ready || !isAdmin) {
    return <p className="px-6 py-14 text-sm text-muted">Memuat panel admin...</p>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader />
      {children}
    </div>
  );
}
