"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/assets/logomigo.png";
import { apiFetch, useAuth } from "@/components/auth-provider";
import { contentSections } from "@/content/content-sections";

const links = [
  { href: "/admin", label: "Dasbor" },
  { href: "/admin/konten", label: "Konten" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/foto", label: "Foto" },
  { href: "/admin/pesan", label: "Pesan" },
  { href: "/admin/pengguna", label: "Pengguna" },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useAuth();

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const inContent = pathname.startsWith("/admin/konten");

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-night text-on-night">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        <Link href="/admin" className="flex items-center gap-2.5 text-sm font-semibold">
          <Image src={logo} alt="Migo" width={36} height={34} className="h-9 w-9" />
          <span className="text-on-night-muted">Admin</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {links.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "font-medium text-white" : "text-on-night-muted transition-colors duration-200 hover:text-white"}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/" className="text-on-night-muted transition-colors duration-200 hover:text-white">
            Situs
          </Link>
          <button type="button" onClick={() => void logout()} className="font-medium text-white">
            Keluar
          </button>
        </nav>
      </div>
      {inContent ? (
        <nav aria-label="Bagian konten" className="mx-auto flex w-full max-w-6xl gap-x-5 gap-y-2 overflow-x-auto px-6 pb-3 text-sm">
          <Link
            href="/admin/konten"
            className={pathname === "/admin/konten" ? "font-medium whitespace-nowrap text-white" : "whitespace-nowrap text-on-night-muted transition-colors duration-200 hover:text-white"}
            aria-current={pathname === "/admin/konten" ? "page" : undefined}
          >
            Ringkasan
          </Link>
          {contentSections.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={active ? "font-medium whitespace-nowrap text-white" : "whitespace-nowrap text-on-night-muted transition-colors duration-200 hover:text-white"}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
