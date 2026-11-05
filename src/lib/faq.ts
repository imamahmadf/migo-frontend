import type { FaqItem, FaqPage } from "@/content/faq";

const emptyPage: FaqPage = { items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 };

function isFaq(value: unknown): value is FaqItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<FaqItem>;
  return typeof item.id === "string" && typeof item.question === "string" && typeof item.answer === "string";
}

function isFaqPage(value: unknown): value is FaqPage {
  if (!value || typeof value !== "object") return false;
  const page = value as Partial<FaqPage>;
  return Array.isArray(page.items) && page.items.every(isFaq) && typeof page.total === "number" && typeof page.totalPages === "number";
}

async function getFaqPage(page: number, pageSize: number): Promise<FaqPage> {
  const base = process.env.API_PROXY_URL ?? "http://127.0.0.1:4000";
  const response = await fetch(`${base}/api/faqs?page=${page}&pageSize=${pageSize}`, { cache: "no-store" });
  if (!response.ok) return emptyPage;
  const payload = (await response.json()) as { data?: unknown };
  return isFaqPage(payload.data) ? payload.data : emptyPage;
}

export async function getPublicFaqs(): Promise<FaqItem[]> {
  try {
    const first = await getFaqPage(1, 100);
    const items = [...first.items];
    for (let page = 2; page <= first.totalPages; page += 1) {
      const next = await getFaqPage(page, 100);
      items.push(...next.items);
    }
    return items;
  } catch {
    return [];
  }
}
