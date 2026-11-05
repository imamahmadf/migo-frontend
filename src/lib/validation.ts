import * as yup from "yup";

function shortText(label: string, max: number) {
  return yup
    .string()
    .trim()
    .required(`${label} minimal 2 karakter`)
    .min(2, `${label} minimal 2 karakter`)
    .max(max, `${label} maksimal ${max} karakter`);
}

export const passwordSchema = yup
  .string()
  .required("Kata sandi wajib diisi")
  .min(10, "Kata sandi minimal 10 karakter")
  .max(72, "Kata sandi maksimal 72 karakter")
  .matches(/[a-z]/, "Kata sandi harus memuat huruf kecil")
  .matches(/[A-Z]/, "Kata sandi harus memuat huruf besar")
  .matches(/[0-9]/, "Kata sandi harus memuat angka");

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email wajib diisi")
    .email("Email tidak valid")
    .max(150, "Email maksimal 150 karakter"),
  password: yup
    .string()
    .required("Kata sandi wajib diisi")
    .min(1, "Kata sandi wajib diisi")
    .max(72, "Kata sandi maksimal 72 karakter"),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Kata sandi saat ini wajib diisi")
    .min(1, "Kata sandi saat ini wajib diisi")
    .max(72, "Kata sandi maksimal 72 karakter"),
  newPassword: passwordSchema.test("different", "Kata sandi baru harus berbeda", function different(value) {
    const current = this.parent.currentPassword as string | undefined;
    if (!value || !current) return true;
    return value !== current;
  }),
  confirmPassword: yup
    .string()
    .required("Ulangi kata sandi baru")
    .oneOf([yup.ref("newPassword")], "Konfirmasi kata sandi tidak sama"),
});

export const contactTopics = ["Menjadi Warung Mitra", "Kerja sama konten", "Investasi", "Lainnya"] as const;

export const contactSchema = yup.object({
  name: yup.string().trim().required("Nama minimal 2 karakter").min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  phone: yup
    .string()
    .trim()
    .required("Nomor WhatsApp tidak valid")
    .min(8, "Nomor WhatsApp tidak valid")
    .max(20, "Nomor WhatsApp tidak valid")
    .matches(/^[0-9+\s()-]+$/, "Nomor WhatsApp tidak valid"),
  topic: yup.string().trim().required("Pilih keperluan").oneOf([...contactTopics], "Pilih keperluan"),
  message: yup
    .string()
    .trim()
    .required("Pesan minimal 8 karakter")
    .min(8, "Pesan minimal 8 karakter")
    .max(1000, "Pesan maksimal 1000 karakter"),
});

export const faqSchema = yup.object({
  question: yup
    .string()
    .trim()
    .required("Pertanyaan minimal 8 karakter")
    .min(8, "Pertanyaan minimal 8 karakter")
    .max(200, "Pertanyaan maksimal 200 karakter"),
  answer: yup
    .string()
    .trim()
    .required("Jawaban minimal 8 karakter")
    .min(8, "Jawaban minimal 8 karakter")
    .max(2000, "Jawaban maksimal 2000 karakter"),
});

export const createUserSchema = yup.object({
  name: yup.string().trim().required("Nama minimal 2 karakter").min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  email: yup.string().trim().required("Email wajib diisi").email("Email tidak valid").max(150, "Email maksimal 150 karakter"),
  password: passwordSchema,
  roleId: yup.string().trim().required("Peran wajib dipilih").min(1, "Peran wajib dipilih").max(50, "Peran tidak valid"),
});

export const updateUserSchema = yup.object({
  roleId: yup.string().trim().required("Peran wajib dipilih").min(1, "Peran wajib dipilih").max(50, "Peran tidak valid"),
  isActive: yup.boolean().required(),
});

const blockSchema = yup.object({
  title: shortText("Judul", 80),
  body: shortText("Deskripsi", 400),
});

const navIds = ["tentang", "jangkauan", "cara-kerja", "kemitraan", "kontak"] as const;

export const profileSchema = yup.object({
  legalName: shortText("Nama badan hukum", 120),
  description: shortText("Ringkasan perusahaan", 400),
  locality: shortText("Kota", 80),
  websiteLabel: shortText("Label situs", 80),
  websiteUrl: yup
    .string()
    .trim()
    .required("Alamat situs tidak valid")
    .url("Alamat situs tidak valid")
    .max(200, "Alamat situs maksimal 200 karakter")
    .matches(/^https?:\/\//, "Alamat situs tidak valid"),
  heroHeadline: shortText("Judul utama", 160),
  heroLead: shortText("Pengantar", 400),
  heroImage: yup
    .string()
    .trim()
    .required("Foto hero tidak valid")
    .max(80, "Foto hero tidak valid")
    .matches(/^\/(?:hero-warung\.png|uploads\/hero-[a-f0-9]{16}\.(?:jpg|png|webp))$/, "Foto hero tidak valid"),
  stepsImage: yup
    .string()
    .trim()
    .required("Ilustrasi cara kerja tidak valid")
    .max(80, "Ilustrasi cara kerja tidak valid")
    .matches(/^\/(?:warungmigo\.png|uploads\/steps-[a-f0-9]{16}\.(?:jpg|png|webp))$/, "Ilustrasi cara kerja tidak valid"),
  primaryCta: shortText("Tombol utama", 40),
  secondaryCta: shortText("Tombol kedua", 40),
  aboutKicker: shortText("Label tentang", 40),
  aboutTitle: shortText("Judul tentang", 120),
  reachKicker: shortText("Label jangkauan", 40),
  reachTitle: shortText("Judul jangkauan", 160),
  reachBody: shortText("Penjelasan jangkauan", 400),
  stepsKicker: shortText("Label cara kerja", 40),
  stepsTitle: shortText("Judul cara kerja", 120),
  partnersKicker: shortText("Label kemitraan", 40),
  partnersTitle: shortText("Judul kemitraan", 160),
  strengthsKicker: shortText("Label keunggulan", 40),
  strengthsTitle: shortText("Judul keunggulan", 120),
  contactKicker: shortText("Label kontak", 60),
  nav: yup
    .array()
    .of(
      yup.object({
        id: yup.string().oneOf([...navIds], "Menu profil tidak valid").required("Menu profil tidak valid"),
        label: shortText("Label menu", 40),
      }),
    )
    .length(5, "Menu profil harus lengkap")
    .test("order", "Urutan menu profil tidak valid", (items) =>
      Array.isArray(items) && navIds.every((id, index) => items[index]?.id === id),
    )
    .required(),
  highlights: yup.array().of(blockSchema).min(1, "Minimal satu poin tentang").max(6, "Maksimal 6 poin tentang").required(),
  stats: yup
    .array()
    .of(
      yup.object({
        value: shortText("Angka", 40),
        label: shortText("Keterangan angka", 80),
      }),
    )
    .min(1, "Minimal satu angka jangkauan")
    .max(6, "Maksimal 6 angka jangkauan")
    .required(),
  steps: yup.array().of(blockSchema).min(1, "Minimal satu langkah").max(6, "Maksimal 6 langkah").required(),
  partners: yup
    .array()
    .of(
      yup.object({
        title: shortText("Judul kelompok mitra", 80),
        items: yup
          .array()
          .of(
            yup.object({
              name: shortText("Nama mitra", 80),
              detail: shortText("Keterangan mitra", 200),
            }),
          )
          .min(1, "Setiap kelompok mitra membutuhkan satu entri")
          .max(8, "Maksimal 8 mitra")
          .required(),
      }),
    )
    .min(1, "Minimal satu kelompok mitra")
    .max(4, "Maksimal 4 kelompok mitra")
    .required(),
  strengths: yup.array().of(blockSchema).min(1, "Minimal satu keunggulan").max(6, "Maksimal 6 keunggulan").required(),
});

const imageFile = yup
  .mixed<File>()
  .test("type", "Foto harus berupa JPEG, PNG, atau WebP", (file) => {
    if (!file) return true;
    return file instanceof File && ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  })
  .test("size", "Ukuran foto maksimal 5 MB", (file) => {
    if (!file) return true;
    return file instanceof File && file.size <= 5 * 1024 * 1024;
  });

export const photoCreateSchema = yup.object({
  title: shortText("Judul", 80),
  description: yup
    .string()
    .trim()
    .required("Deskripsi minimal 8 karakter")
    .min(8, "Deskripsi minimal 8 karakter")
    .max(400, "Deskripsi maksimal 400 karakter"),
  image: imageFile.required("Foto wajib dipilih"),
});

export const photoUpdateSchema = yup.object({
  title: shortText("Judul", 80),
  description: yup
    .string()
    .trim()
    .required("Deskripsi minimal 8 karakter")
    .min(8, "Deskripsi minimal 8 karakter")
    .max(400, "Deskripsi maksimal 400 karakter"),
  image: imageFile.nullable(),
});

export const heroFileSchema = yup
  .mixed<File>()
  .required("Foto wajib dipilih")
  .test("type", "Foto harus berupa JPEG, PNG, atau WebP", (file) => file instanceof File && ["image/jpeg", "image/png", "image/webp"].includes(file.type))
  .test("size", "Ukuran foto maksimal 5 MB", (file) => file instanceof File && file.size <= 5 * 1024 * 1024);
