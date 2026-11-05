"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, useAuth } from "@/components/auth-provider";
import type { AuthUser } from "@/components/auth-provider";
import { ConnectionStatus } from "@/components/connection-status";
import type { CompanyProfileContent } from "@/content/profile";

type RoleStat = {
  id: string;
  name: string;
  description: string;
  total: number;
  active: number;
};

type UserSummary = {
  total: number;
  active: number;
  inactive: number;
  roles: RoleStat[];
  recent: AuthUser[];
};

const actions = [
  {
    href: "/admin/pengguna",
    title: "Pengguna",
    body: "Buat akun, ubah peran, atau nonaktifkan akses.",
  },
  {
    href: "/admin/konten",
    title: "Konten situs",
    body: "Perbarui teks yang tampil di profil perusahaan.",
  },
  {
    href: "/admin/faq",
    title: "FAQ",
    body: "Tambah, ubah, atau hapus pertanyaan yang tampil di situs.",
  },
  {
    href: "/admin/foto",
    title: "Foto",
    body: "Unggah foto beserta judul dan deskripsi untuk galeri.",
  },
  {
    href: "/admin/pesan",
    title: "Pesan",
    body: "Baca pesan dari pengunjung dan perbarui statusnya.",
  },
  {
    href: "/",
    title: "Situs publik",
    body: "Lihat halaman profil seperti yang dilihat pengunjung.",
  },
];

function formatWhen(value: string | null) {
  if (!value) return "Belum pernah masuk";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [profile, setProfile] = useState<CompanyProfileContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      apiFetch<{ data: UserSummary }>("/api/users/summary"),
      apiFetch<{ data: CompanyProfileContent }>("/api/content/profile/admin"),
    ])
      .then(([summaryPayload, profilePayload]) => {
        if (!active) return;
        setSummary(summaryPayload.data);
        setProfile(profilePayload.data);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : "Dasbor tidak dapat dimuat");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { label: "Pengguna", value: summary ? String(summary.total) : "—" },
    { label: "Aktif", value: summary ? String(summary.active) : "—" },
    { label: "Nonaktif", value: summary ? String(summary.inactive) : "—" },
    { label: "Peran", value: summary ? String(summary.roles.length) : "—" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium tracking-[0.22em] text-brand uppercase">Administrator</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Dasbor</h1>
        <p className="mt-2 text-sm text-muted">
          Selamat datang, {user?.name}. Kelola akun internal dan konten profil dari sini.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-3xl border border-line bg-card p-6">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight">{loading ? "…" : item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-3xl border border-line bg-card p-6 transition duration-200 hover:-translate-y-0.5 hover:border-brand/40"
          >
            <h2 className="text-lg font-semibold">{action.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{action.body}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">Peran</h2>
          {loading ? <p className="mt-4 text-sm text-muted">Memuat peran...</p> : null}
          <ul className="mt-4 flex flex-col gap-5">
            {summary?.roles.map((role) => {
              const width = summary.total > 0 ? Math.round((role.total / summary.total) * 100) : 0;
              return (
                <li key={role.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-medium">{role.name}</p>
                    <p className="text-sm text-muted">
                      {role.active} aktif / {role.total}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted">{role.description}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${width}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="rounded-3xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">Masuk terakhir</h2>
          {loading ? <p className="mt-4 text-sm text-muted">Memuat aktivitas...</p> : null}
          <ul className="mt-4 flex flex-col">
            {summary?.recent.map((person) => (
              <li key={person.id} className="border-t border-line py-3 first:border-t-0 first:pt-0">
                <p className="font-medium">{person.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {person.role?.name ?? "Tanpa peran"} · {formatWhen(person.lastLoginAt)}
                </p>
              </li>
            ))}
          </ul>
          {summary && summary.recent.length === 0 ? <p className="mt-4 text-sm text-muted">Belum ada pengguna.</p> : null}
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">Konten yang tayang</h2>
          {loading ? <p className="mt-4 text-sm text-muted">Memuat konten...</p> : null}
          {profile ? (
            <>
              <p className="mt-4 font-medium">{profile.legalName}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{profile.heroHeadline}</p>
              <p className="mt-3 text-sm text-muted">{profile.locality}</p>
              <Link href="/admin/konten" className="mt-4 inline-block text-sm font-medium text-brand">
                Ubah konten
              </Link>
            </>
          ) : null}
        </article>
        <ConnectionStatus />
      </section>
    </div>
  );
}
