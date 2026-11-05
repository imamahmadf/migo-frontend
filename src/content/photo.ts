export type GalleryPhoto = {
  id: string;
  title: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type PhotoSort = "newest" | "oldest" | "title" | "order";

export type PhotoPage = {
  items: GalleryPhoto[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
