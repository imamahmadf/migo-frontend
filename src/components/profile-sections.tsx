import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { FaqList } from "@/components/faq-list";
import { ContactForm } from "@/components/contact-form";
import type { FaqItem } from "@/content/faq";
import type { CompanyProfileContent } from "@/content/profile";

type HeadingLevel = "h1" | "h2";

function SectionHeading({
  as,
  className,
  children,
}: {
  as: HeadingLevel;
  className: string;
  children: ReactNode;
}) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}

export function AboutSection({ heading = "h2" }: { heading?: HeadingLevel }) {
  return (
    <section id="tentang" className="scroll-mt-24 bg-white">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <SectionHeading as={heading} className="max-w-xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Hiburan dan pendidikan digital tidak boleh jadi barang mewah
          </SectionHeading>
          <div className="mt-6 max-w-xl space-y-4 text-[15px] leading-7 text-slate-500">
            <p>
              Bagi jutaan keluarga di Indonesia, menonton satu film secara streaming bisa menghabiskan kuota untuk seminggu.
              Akibatnya, konten berkualitas hanya dinikmati mereka yang mampu membayar data mahal.
            </p>
            <p>
              Migo memindahkan distribusi konten dari jaringan seluler ke warung di lingkungan sekitar. Melalui perangkat Migo
              Download Station (MDS), siapa pun dapat mengunduh konten dalam hitungan detik — lalu menontonnya kapan saja,
              offline.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} className="lg:pt-2">
          <p className="text-sm text-slate-500">Waktu unduh satu film full HD di warung Migo</p>
          <p className="mt-3 text-5xl font-extrabold tracking-tight text-[#e30b29] sm:text-6xl">30–60 dtk</p>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-slate-200 pt-6">
            <div>
              <p className="text-2xl font-bold">0 MB</p>
              <p className="mt-1 text-sm text-slate-500">kuota seluler terpakai</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Offline</p>
              <p className="mt-1 text-sm text-slate-500">tonton di mana saja</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function StepsSection({
  profile,
  heading = "h2",
}: {
  profile: CompanyProfileContent;
  heading?: HeadingLevel;
}) {
  return (
    <section id="cara-kerja" className="scroll-mt-24 bg-[#f6f7f9]">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <SectionHeading as={heading} className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Cara Kerja Ekosistem Migo
          </SectionHeading>
          <p className="mt-3 text-slate-500">Empat langkah sederhana, dari warung ke layar ponsel pelanggan.</p>
          <img
            src={profile.stepsImage || "/warungmigo.png"}
            alt="Ilustrasi warung mitra Migo"
            className="mt-8 h-auto w-full max-w-md object-contain"
          />
        </Reveal>
        <ol className="grid gap-4 sm:grid-cols-2">
          {profile.steps.map((step, index) => (
            <Reveal
              as="li"
              key={`${step.title}-${index}`}
              delay={index * 70}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            >
              <StepIcon index={index} />
              <h3 className="mt-4 font-bold">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CatalogSection({ heading = "h2" }: { heading?: HeadingLevel }) {
  return (
    <section id="konten" className="scroll-mt-24 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <Reveal>
          <SectionHeading as={heading} className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Konten yang tersedia
          </SectionHeading>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
            Katalog diperbarui setiap minggu dan dikirim ke seluruh perangkat MDS secara otomatis.
          </p>
        </Reveal>
        <div className="flex flex-col">
          {catalog.map((item) => (
            <Reveal key={item.title} className="flex gap-4 border-b border-slate-200 py-6 first:pt-0">
              <span className="mt-0.5 text-[#e30b29]">{item.icon}</span>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnerSection({ heading = "h2" }: { heading?: HeadingLevel }) {
  return (
    <section id="kemitraan" className="scroll-mt-24 bg-[#e30b29] text-white">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
        <Reveal>
          <SectionHeading as={heading} className="max-w-md text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Jadikan warung Anda pusat hiburan di lingkungan
          </SectionHeading>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
            Bergabunglah sebagai Warung Mitra Migo. Tanpa biaya pemasangan, tanpa perlu keahlian teknis.
          </p>
          <a
            href="/kontak"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#141b2d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            Daftar sebagai mitra
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
        <ul className="flex flex-col">
          {partnerBenefits.map((item) => (
            <li key={item} className="flex gap-3 border-b border-white/25 py-4 text-sm leading-6 last:border-b-0">
              <CheckIcon />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ContactSection({
  profile,
  heading = "h2",
}: {
  profile: CompanyProfileContent;
  heading?: HeadingLevel;
}) {
  return (
    <section id="kontak" className="scroll-mt-24 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading as={heading} className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hubungi kami
          </SectionHeading>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            Untuk kemitraan warung, kerja sama konten, atau investasi. Tim kami membalas dalam satu hari kerja.
          </p>
          <ul className="mt-8 flex flex-col gap-5 text-sm">
            <li className="flex gap-3">
              <MailIcon />
              <span>
                <span className="block text-slate-500">Email</span>
                <a href="mailto:halo@migo.id" className="font-semibold">
                  halo@migo.id
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <PhoneIcon />
              <span>
                <span className="block text-slate-500">WhatsApp</span>
                <a href="https://wa.me/6281100006446" className="font-semibold">
                  +62 811 0000 6446
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <PinIcon />
              <span>
                <span className="block text-slate-500">Kantor Pusat</span>
                <span className="font-semibold">{profile.locality}, Indonesia</span>
              </span>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={80}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

export function FaqSection({ faqs, heading = "h2" }: { faqs: FaqItem[]; heading?: HeadingLevel }) {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#e30b29] uppercase">Pertanyaan umum</p>
          <SectionHeading as={heading} className="mt-3 text-3xl font-extrabold tracking-tight">
            FAQ
          </SectionHeading>
        </Reveal>
        <FaqList items={faqs} />
      </div>
    </section>
  );
}

const catalog = [
  {
    title: "Film & Serial",
    body: "Film Indonesia dan internasional berlisensi resmi, serial, serta tayangan anak dengan kualitas full HD.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M8 5v14M16 5v14M3 9h5M16 9h5M3 15h5M16 15h5" />
      </svg>
    ),
  },
  {
    title: "Materi Pembelajaran",
    body: "Video pelajaran sekolah, kursus keterampilan, dan konten literasi digital yang bisa diputar ulang tanpa biaya data.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

const partnerBenefits = [
  "Perangkat MDS dipasang gratis oleh tim Migo",
  "Pendapatan tambahan dari setiap transaksi unduhan",
  "Lebih banyak pengunjung yang juga berbelanja di warung",
  "Pelatihan dan dukungan teknis dari tim lapangan",
];

function StepIcon({ index }: { index: number }) {
  const navy = index % 2 === 1;
  const paths = [
    "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z",
    "M5 12.5a7 7 0 0 1 14 0M8 12.5a4 4 0 0 1 8 0M12 16.5h.01",
    "M12 4v10m0 0 4-4m-4 4-4-4M5 20h14",
    "M8 6.5v11l10-5.5-10-5.5z",
  ];
  return (
    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${navy ? "bg-[#141b2d]" : "bg-[#e30b29]"} text-white`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d={paths[index % paths.length]} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12.5 10 17l9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-[#e30b29]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-[#e30b29]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 3h3l1.5 4-2 1.5a12 12 0 0 0 5 5L17 12l4 1.5V17a2 2 0 0 1-2 2A15 15 0 0 1 5 5a2 2 0 0 1 2-2z" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-[#e30b29]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
