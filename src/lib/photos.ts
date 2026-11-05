import type { GalleryPhoto, PhotoPage, PhotoSort } from "@/content/photo";

const emptyPage: PhotoPage = { items: [], page: 1, pageSize: 9, total: 0, totalPages: 0 };

function isPhoto(value: unknown): value is GalleryPhoto {
  if (!value || typeof value !== "object") return false;
  const photo = value as Partial<GalleryPhoto>;
  return typeof photo.id === "string" && typeof photo.title === "string" && typeof photo.description === "string" && typeof photo.image === "string";
}

function isPhotoPage(value: unknown): value is PhotoPage {
  if (!value || typeof value !== "object") return false;
  const page = value as Partial<PhotoPage>;
  return Array.isArray(page.items) && page.items.every(isPhoto) && typeof page.page === "number" && typeof page.total === "number" && typeof page.totalPages === "number";
}

export async function getPhotoPage(query: { page?: number; pageSize?: number; q?: string; sort?: PhotoSort } = {}): Promise<PhotoPage> {
  try {
    const base = process.env.API_PROXY_URL ?? "http://127.0.0.1:4000";
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.pageSize) params.set("pageSize", String(query.pageSize));
    if (query.q) params.set("q", query.q);
    if (query.sort) params.set("sort", query.sort);
    const response = await fetch(`${base}/api/photos?${params.toString()}`, { cache: "no-store" });
    if (!response.ok) return emptyPage;
    const payload = (await response.json()) as { data?: unknown };
    return isPhotoPage(payload.data) ? payload.data : emptyPage;
  } catch {
    return emptyPage;
  }
}

export async function getPublicPhotos(): Promise<GalleryPhoto[]> {
  const page = await getPhotoPage({ page: 1, pageSize: 24, sort: "order" });
  return page.items;
}
