import type { CompanyProfileContent } from "@/content/profile";

export const contentSections = [
  {
    id: "identitas",
    href: "/admin/konten/identitas",
    label: "Identitas",
    description: "Nama badan hukum, ringkasan, kota, dan alamat situs.",
    fields: ["legalName", "description", "locality", "websiteLabel", "websiteUrl"],
  },
  {
    id: "pembuka",
    href: "/admin/konten/pembuka",
    label: "Pembuka",
    description: "Foto dan teks yang tampil di bagian atas beranda.",
    fields: ["heroHeadline", "heroLead", "heroImage", "primaryCta", "secondaryCta"],
  },
  {
    id: "menu",
    href: "/admin/konten/menu",
    label: "Menu",
    description: "Label tautan pada navigasi situs publik.",
    fields: ["nav"],
  },
  {
    id: "tentang",
    href: "/admin/konten/tentang",
    label: "Tentang",
    description: "Judul dan poin pada bagian tentang.",
    fields: ["aboutKicker", "aboutTitle", "highlights"],
  },
  {
    id: "jangkauan",
    href: "/admin/konten/jangkauan",
    label: "Jangkauan",
    description: "Penjelasan dan angka pada bagian jangkauan.",
    fields: ["reachKicker", "reachTitle", "reachBody", "stats"],
  },
  {
    id: "cara-kerja",
    href: "/admin/konten/cara-kerja",
    label: "Cara kerja",
    description: "Ilustrasi, judul, dan langkah pada bagian cara kerja.",
    fields: ["stepsImage", "stepsKicker", "stepsTitle", "steps"],
  },
  {
    id: "kemitraan",
    href: "/admin/konten/kemitraan",
    label: "Kemitraan",
    description: "Judul dan daftar mitra pada bagian kemitraan.",
    fields: ["partnersKicker", "partnersTitle", "partners"],
  },
  {
    id: "keunggulan",
    href: "/admin/konten/keunggulan",
    label: "Keunggulan",
    description: "Judul dan poin pada bagian keunggulan.",
    fields: ["strengthsKicker", "strengthsTitle", "strengths"],
  },
  {
    id: "kontak",
    href: "/admin/konten/kontak",
    label: "Kontak",
    description: "Label yang tampil pada bagian kontak.",
    fields: ["contactKicker"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  href: string;
  label: string;
  description: string;
  fields: readonly (keyof CompanyProfileContent)[];
}>;

export type ContentSectionId = (typeof contentSections)[number]["id"];

export function findContentSection(id: string) {
  return contentSections.find((item) => item.id === id);
}
