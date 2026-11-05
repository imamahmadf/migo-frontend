"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/assets/logomigo.png";
import { marketingNav } from "@/config/site";
import { apiFetch, useAuth } from "@/components/auth-provider";

type NavLink = {
  href: string;
  label: string;
};

export function SiteHeader({ nav = marketingNav }: { nav?: NavLink[] }) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const isAdmin = user?.role?.id === "admin";

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 bg-night/90 backdrop-blur-md">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5 lg:px-6">
        <Link href="/" className="shrink-0">
          <Image src={logo} alt="Migo" width={40} height={38} priority className="h-10 w-10" />
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm text-[#d5d8e2] xl:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors duration-200 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link
                href={isAdmin ? "/admin" : "/akun"}
                className="hidden text-[#d5d8e2] transition-colors hover:text-white sm:inline"
              >
                {isAdmin ? "Dasbor" : "Akun"}
              </Link>
              <button type="button" onClick={() => void logout()} className="hidden font-medium text-[#d5d8e2] hover:text-white sm:inline">
                Keluar
              </button>
            </>
          ) : (
            <Link href="/masuk" className="hidden text-[#d5d8e2] transition-colors hover:text-white sm:inline">
              Masuk
            </Link>
          )}
          <a
            href="/kemitraan"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
          >
            Jadi Mitra
          </a>
        </div>
      </div>
      <nav className="flex flex-wrap gap-x-4 gap-y-2 px-5 pb-3 text-sm text-[#d5d8e2] xl:hidden">
        {nav.map((item) => (
          <a key={item.href} href={item.href} className="transition-colors hover:text-white">
            {item.label}
          </a>
        ))}
        {user ? (
          <Link href={isAdmin ? "/admin" : "/akun"} className="hover:text-white">
            {isAdmin ? "Dasbor" : "Akun"}
          </Link>
        ) : (
          <Link href="/masuk" className="hover:text-white">
            Masuk
          </Link>
        )}
      </nav>
    </header>
  );
}
