export const siteConfig = {
  name: "Migo",
  legalName: "PT Teknologi Migo Indonesia",
  title: "Migo: Konten Digital Terjangkau, Mudah Diunduh di Warung",
  description:
    "PT Teknologi Migo Indonesia adalah perusahaan teknologi media yang menghadirkan konten digital dan layanan data terjangkau bagi masyarakat mass-market.",
  locality: "Jakarta",
  websiteLabel: "migo.tech",
  websiteUrl: "https://migo.tech",
  locale: "id_ID",
  language: "id",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://migo.tech").replace(/\/$/, ""),
  socialProfiles: [] as string[],
};

export const siteNav = [
  {
    path: "/tentang",
    label: "Tentang",
    description:
      "Migo memindahkan distribusi film dan materi belajar ke warung sekitar, agar konten bisa diunduh dalam hitungan detik lalu ditonton offline.",
    inHeader: true,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/cara-kerja",
    label: "Cara Kerja",
    description:
      "Empat langkah dari warung mitra ke layar ponsel: datang ke warung, sambungkan hotspot, pilih konten, lalu tonton tanpa kuota seluler.",
    inHeader: true,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/konten",
    label: "Konten",
    description:
      "Film, serial, tayangan anak, dan materi pembelajaran berlisensi yang diperbarui setiap minggu di seluruh Migo Download Station.",
    inHeader: true,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    path: "/kemitraan",
    label: "Mitra Warung",
    description:
      "Daftarkan warung sebagai mitra Migo. Perangkat dipasang gratis, dengan pendapatan tambahan dari setiap transaksi unduhan.",
    inHeader: true,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/kontak",
    label: "Kontak",
    description:
      "Hubungi tim Migo untuk kemitraan warung, kerja sama konten, atau investasi. Pesan dibalas dalam satu hari kerja.",
    inHeader: true,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  },
  {
    path: "/galeri",
    label: "Galeri",
    description: "Foto kegiatan, warung mitra, dan jaringan Migo Download Station di seluruh Jawa.",
    inHeader: false,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    path: "/faq",
    label: "FAQ",
    description: "Jawaban tentang cara mengunduh di warung, pemakaian kuota, katalog konten, dan pendaftaran mitra Migo.",
    inHeader: false,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  },
] as const;

export type SiteNavPath = (typeof siteNav)[number]["path"];

export function getSitePage(path: SiteNavPath) {
  const page = siteNav.find((item) => item.path === path);
  if (!page) throw new Error(`Halaman tidak dikenal: ${path}`);
  return page;
}

export const marketingNav = siteNav
  .filter((item) => item.inHeader)
  .map((item) => ({ href: item.path, label: item.label }));

export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  ...siteNav.map((item) => ({
    path: item.path,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  })),
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
