"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccountPanel } from "@/components/account-panel";
import { useAuth } from "@/components/auth-provider";

export function AccountHome() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const isAdmin = user?.role?.id === "admin";

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/masuk");
      return;
    }
    if (isAdmin) router.replace("/admin");
  }, [ready, user, isAdmin, router]);

  if (!ready || !user || isAdmin) {
    return <p className="text-sm text-muted">Memuat akun...</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Akun</h1>
      <p className="mt-2 text-sm text-muted">Kelola profil dan kata sandi Anda.</p>
      <div className="mt-8">
        <AccountPanel />
      </div>
    </>
  );
}
