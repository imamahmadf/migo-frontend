export type TextBlock = {
  title: string;
  body: string;
};

export type ProfileStat = {
  value: string;
  label: string;
};

export type PartnerItem = {
  name: string;
  detail: string;
};

export type PartnerGroup = {
  title: string;
  items: PartnerItem[];
};

export type ProfileNavId = "tentang" | "jangkauan" | "cara-kerja" | "kemitraan" | "kontak";

export type ProfileNavItem = {
  id: ProfileNavId;
  label: string;
};

export type CompanyProfileContent = {
  legalName: string;
  description: string;
  locality: string;
  websiteLabel: string;
  websiteUrl: string;
  heroHeadline: string;
  heroLead: string;
  heroImage: string;
  stepsImage: string;
  primaryCta: string;
  secondaryCta: string;
  aboutKicker: string;
  aboutTitle: string;
  reachKicker: string;
  reachTitle: string;
  reachBody: string;
  stepsKicker: string;
  stepsTitle: string;
  partnersKicker: string;
  partnersTitle: string;
  strengthsKicker: string;
  strengthsTitle: string;
  contactKicker: string;
  nav: ProfileNavItem[];
  highlights: TextBlock[];
  stats: ProfileStat[];
  steps: TextBlock[];
  partners: PartnerGroup[];
  strengths: TextBlock[];
};

export const defaultProfile: CompanyProfileContent = {
  legalName: "PT Teknologi Migo Indonesia",
  description:
    "PT Teknologi Migo Indonesia adalah perusahaan teknologi media yang menghadirkan konten digital dan layanan data terjangkau bagi masyarakat mass-market.",
  locality: "Jakarta",
  websiteLabel: "migo.tech",
  websiteUrl: "https://migo.tech",
  heroHeadline: "Demokratisasi konten digital untuk segmen mass-market",
  heroImage: "/hero-warung.png",
  stepsImage: "/warungmigo.png",
  heroLead:
    "Jaringan distribusi konten offline pertama di Indonesia. Film, serial, dan materi belajar — diunduh di warung terdekat, tanpa kuota seluler.",
  primaryCta: "Lihat cara kerjanya",
  secondaryCta: "Jadi Mitra Warung",
  aboutKicker: "Tentang kami",
  aboutTitle: "Konten digital yang bisa dijangkau",
  reachKicker: "Jangkauan infrastruktur",
  reachTitle: "Akses digital instan lewat warung di seluruh Jawa",
  reachBody:
    "Migo Download Station tersebar di jaringan warung tradisional dan memberi akses digital instan kepada masyarakat Indonesia.",
  stepsKicker: "Cara kerja",
  stepsTitle: "Ekosistem Migo",
  partnersKicker: "Kemitraan konten",
  partnersTitle: "Hiburan premium dan materi belajar dalam satu jaringan",
  strengthsKicker: "Perangkat dan layanan",
  strengthsTitle: "Keunggulan hardware dan software",
  contactKicker: "Kantor pusat operasional",
  nav: [
    { id: "tentang", label: "Tentang" },
    { id: "jangkauan", label: "Jangkauan" },
    { id: "cara-kerja", label: "Cara Kerja" },
    { id: "kemitraan", label: "Kemitraan" },
    { id: "kontak", label: "Kontak" },
  ],
  highlights: [
    {
      title: "Misi utama",
      body: "Menyediakan akses hiburan dan edukasi digital berkualitas tinggi tanpa terkendala kuota data internet yang mahal.",
    },
    {
      title: "Teknologi inovatif",
      body: "Migo Download Station (MDS) dipasang di warung tradisional agar film dapat diunduh dalam hitungan detik.",
    },
    {
      title: "Pasar sasaran",
      body: "Masyarakat segmen C dan D di pinggiran kota serta pedesaan yang infrastruktur broadband-nya masih terbatas.",
    },
  ],
  stats: [
    { value: "1.400+", label: "Migo Download Station aktif" },
    { value: "20 juta+", label: "Masyarakat yang dijangkau" },
    { value: "Jawa", label: "Jaringan warung tradisional" },
  ],
  steps: [
    {
      title: "Kunjungi warung",
      body: "Pelanggan datang ke warung mitra SRC atau toko kelontong terdekat yang terpasang perangkat MDS.",
    },
    {
      title: "Koneksi hotspot",
      body: "Hubungkan smartphone ke Wi-Fi lokal MDS tanpa memakai kuota seluler pribadi.",
    },
    {
      title: "Unduh instan",
      body: "Unduh film full HD atau materi pembelajaran dalam waktu 30–60 detik.",
    },
    {
      title: "Tonton offline",
      body: "Nikmati tayangan kapan saja dan di mana saja tanpa menguras data seluler.",
    },
  ],
  partners: [
    {
      title: "Hiburan dan film",
      items: [
        { name: "MNC Vision Networks", detail: "Lisensi tayangan lokal premium dan TV kabel." },
        { name: "Lionsgate Play", detail: "Film blockbuster Hollywood." },
        { name: "Starvision & Sushiroll", detail: "Sinema lokal dan serial anime." },
      ],
    },
    {
      title: "Edukasi dan edutech",
      items: [
        { name: "Zenius & Sekolahmu", detail: "Distribusi modul belajar digital." },
        { name: "Kemendikbud Ristek", detail: "Materi pendidikan sampai ke pelosok." },
        { name: "Inklusi digital", detail: "Siswa dapat belajar mandiri tanpa kuota." },
      ],
    },
  ],
  strengths: [
    {
      title: "Micro-CDN khusus",
      body: "MDS dirancang hemat energi, tahan cuaca, dan berjalan mandiri di toko kelontong.",
    },
    {
      title: "Transfer data lokal",
      body: "Pengunduhan lewat Wi-Fi langsung di tempat, hingga 10 kali lebih cepat dari jaringan 4G.",
    },
    {
      title: "Pembayaran micro-pass",
      body: "Paket langganan harian yang disesuaikan dengan daya beli masyarakat setempat.",
    },
  ],
};

