import { defaultProfile, type CompanyProfileContent } from "@/content/profile";

function isProfile(value: unknown): value is CompanyProfileContent {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<CompanyProfileContent>;
  return typeof record.legalName === "string" && typeof record.heroHeadline === "string" && Array.isArray(record.nav);
}

export async function getPublicProfile(): Promise<CompanyProfileContent> {
  try {
    const base = process.env.API_PROXY_URL ?? "http://127.0.0.1:4000";
    const response = await fetch(`${base}/api/content/profile`, { cache: "no-store" });
    if (!response.ok) return defaultProfile;
    const payload = (await response.json()) as { data?: unknown };
    return isProfile(payload.data) ? payload.data : defaultProfile;
  } catch {
    return defaultProfile;
  }
}
