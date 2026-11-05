import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { PhotoCarousel } from "@/components/photo-carousel";
import { AboutSection, CatalogSection, ContactSection, FaqSection, PartnerSection, StepsSection } from "@/components/profile-sections";
import type { FaqItem } from "@/content/faq";
import type { GalleryPhoto } from "@/content/photo";
import logo from "@/assets/logomigo.png";
import type { CompanyProfileContent } from "@/content/profile";

export function CompanyProfile({
  profile,
  faqs,
  photos,
}: {
  profile: CompanyProfileContent;
  faqs: FaqItem[];
  photos: GalleryPhoto[];
}) {
  return (
    <div className="flex flex-1 flex-col bg-white text-slate-900">
      <SiteHeader />

      <main>
        <section className="bg-night text-on-night">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pt-12 lg:pb-20">
            <div>
              <p className="hero-in inline-flex rounded-md bg-brand px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-white uppercase">
                Profil perusahaan
              </p>
              <h1
                className="hero-in mt-6 max-w-xl text-4xl font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]"
                style={{ animationDelay: "80ms" }}
              >
                {profile.heroHeadline}
              </h1>
              <p
                className="hero-in mt-6 max-w-md text-base leading-7 text-on-night-muted"
                style={{ animationDelay: "160ms" }}
              >
                {profile.heroLead}
              </p>
              <div className="hero-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
                <a
                  href="/cara-kerja"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
                >
                  {profile.primaryCta}
                  <span aria-hidden="true">→</span>
                </a>
                <a
                  href="/kemitraan"
                  className="inline-flex items-center rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {profile.secondaryCta}
                </a>
              </div>
              <div className="hero-in mt-10 border-t border-white/10 pt-6" style={{ animationDelay: "320ms" }}>
                <dl className="grid max-w-lg grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-on-night-muted">Entitas Legal</dt>
                    <dd className="mt-1 font-semibold text-white">{profile.legalName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-on-night-muted">Kantor Pusat Operasional</dt>
                    <dd className="mt-1 font-semibold text-white">{profile.locality}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md pb-12 pl-8 sm:max-w-lg lg:mx-0 lg:max-w-none lg:pb-14 lg:pl-12">
              <div className="overflow-hidden rounded-[1.35rem] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <img
                  src={profile.heroImage || "/hero-warung.png"}
                  alt="Pengunjung warung mitra sedang melihat konten di ponsel"
                  className="aspect-[348/248] h-auto w-full object-cover"
                />
              </div>
              <Image
                src={logo}
                alt=""
                width={180}
                height={170}
                priority
                className="pointer-events-none absolute bottom-1 left-0 w-[48%] max-w-[12.5rem] drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        </section>

        <AboutSection />
        <StepsSection profile={profile} />
        <CatalogSection />

        {photos.length > 0 ? (
          <section id="galeri" className="scroll-mt-24 bg-[#f6f7f9]">
            <div className="mx-auto w-full max-w-6xl px-6 py-20">
              <Reveal>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Galeri</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Foto dari jaringan dan kegiatan Migo.</p>
              </Reveal>
              <PhotoCarousel photos={photos} />
              <a href="/galeri" className="mt-6 inline-flex text-sm font-semibold text-[#e30b29]">
                Lihat semua foto
              </a>
            </div>
          </section>
        ) : null}

        <PartnerSection />
        <ContactSection profile={profile} />
        <FaqSection faqs={faqs} />
      </main>

      <SiteFooter legalName={profile.legalName} locality={profile.locality} />
    </div>
  );
}


