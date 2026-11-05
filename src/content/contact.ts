export const contactStatuses = [
  { value: "baru", label: "Baru" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
] as const;

export type ContactStatus = (typeof contactStatuses)[number]["value"];

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  topic: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
};

export type ContactMessagePage = {
  items: ContactMessage[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
