import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PhotoGallery } from "@/components/photo-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { PhotoSort } from "@/content/photo";
import { getSitePage, siteConfig } from "@/config/site";
import { getPhotoPage } from "@/lib/photos";
import { getPublicProfile } from "@/lib/profile";
import { breadcrumbJsonLd, createPageMetadata, organizationJsonLd, webPageJsonLd } from "@/lib/seo";

const page = getSitePage("/galeri");

export const metadata = createPageMetadata({
  title: page.label,
  description: page.description,
  path: page.path,
});

const sorts = ["newest", "oldest", "title"] as const;

function readSort(value: string | undefined): Exclude<PhotoSort, "order"> {
  return sorts.includes(value as (typeof sorts)[number]) ? (value as Exclude<PhotoSort, "order">) : "newest";
}

function readPage(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
}) {
  return (
    <Suspense fallback={<GalleryShell legalName={siteConfig.legalName} locality={siteConfig.locality} />}>
      <GalleryContent searchParams={searchParams} />
    </Suspense>
  );
}

async function GalleryContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const q = (params.q ?? "").trim().slice(0, 80);
  const sort = readSort(params.sort);
  const page = readPage(params.page);
  const [profile, photos] = await Promise.all([getPublicProfile(), getPhotoPage({ page, pageSize: 9, q, sort })]);

  return (
    <GalleryShell legalName={profile.legalName} locality={profile.locality}>
      <PhotoGallery photos={photos} q={q} sort={sort} />
    </GalleryShell>
  );
}

function GalleryShell({
  legalName,
  locality,
  children,
}: {
  legalName: string;
  locality: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-white text-slate-900">
      <JsonLd data={organizationJsonLd({ legalName, locality })} />
      <JsonLd data={webPageJsonLd({ title: `${page.label} | ${siteConfig.name}`, description: page.description, path: page.path })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: page.label, path: page.path },
        ])}
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <nav aria-label="Jejak" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-slate-900">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-900">{page.label}</li>
          </ol>
        </nav>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Galeri</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">{page.description}</p>
        <div className="mt-8">{children ?? <p className="text-sm text-slate-500">Memuat foto...</p>}</div>
      </main>
      <SiteFooter legalName={legalName} locality={locality} />
    </div>
  );
}
