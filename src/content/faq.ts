export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export type FaqPage = {
  items: FaqItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
