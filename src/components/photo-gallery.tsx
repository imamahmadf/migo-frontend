import Link from "next/link";
import type { PhotoPage, PhotoSort } from "@/content/photo";

const sorts: { value: Exclude<PhotoSort, "order">; label: string }[] = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "title", label: "Judul" },
];

function galleryHref(query: { q: string; sort: string; page?: number }) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.sort && query.sort !== "newest") params.set("sort", query.sort);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  const search = params.toString();
  return search ? `/galeri?${search}` : "/galeri";
}

export function PhotoGallery({ photos, q, sort }: { photos: PhotoPage; q: string; sort: Exclude<PhotoSort, "order"> }) {
  const pages = Array.from({ length: photos.totalPages }, (_, index) => index + 1);

  return (
    <div>
      <form method="get" action="/galeri" className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm text-slate-600">
          Cari foto
          <input
            name="q"
            defaultValue={q}
            maxLength={80}
            placeholder="Judul atau deskripsi"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#e30b29] focus:ring-2 focus:ring-[#e30b29]/15"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-600">
          Urutan
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#e30b29] focus:ring-2 focus:ring-[#e30b29]/15"
          >
            {sorts.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-lg bg-[#e30b29] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c10d22]">
          Filter
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        {photos.total === 0 ? "Tidak ada foto yang cocok." : `${photos.total} foto`}
      </p>

      {photos.items.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.items.map((photo) => (
            <article key={photo.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img src={photo.image} alt={photo.title} className="h-52 w-full object-cover" />
              <div className="p-5">
                <h2 className="font-bold">{photo.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{photo.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {photos.totalPages > 1 ? (
        <nav aria-label="Halaman foto" className="mt-8 flex flex-wrap items-center gap-2">
          {photos.page > 1 ? (
            <Link href={galleryHref({ q, sort, page: photos.page - 1 })} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:border-[#e30b29] hover:text-[#e30b29]">
              Sebelumnya
            </Link>
          ) : (
            <span className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-300">Sebelumnya</span>
          )}
          {pages.map((page) => (
            <Link
              key={page}
              href={galleryHref({ q, sort, page })}
              aria-current={page === photos.page ? "page" : undefined}
              className={
                page === photos.page
                  ? "grid h-10 w-10 place-items-center rounded-full bg-[#e30b29] text-sm font-semibold text-white"
                  : "grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-sm hover:border-[#e30b29] hover:text-[#e30b29]"
              }
            >
              {page}
            </Link>
          ))}
          {photos.page < photos.totalPages ? (
            <Link href={galleryHref({ q, sort, page: photos.page + 1 })} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:border-[#e30b29] hover:text-[#e30b29]">
              Berikutnya
            </Link>
          ) : (
            <span className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-300">Berikutnya</span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
