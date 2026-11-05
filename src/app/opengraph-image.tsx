import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f172a",
          color: "#f8fafc",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#e30b29" }}>{siteConfig.legalName}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>
            Demokratisasi konten digital untuk segmen mass-market
          </div>
          <div style={{ fontSize: 28, color: "#a7adbb", lineHeight: 1.4 }}>
            Jaringan distribusi konten offline pertama di Indonesia
          </div>
        </div>
      </div>
    ),
    size,
  );
}
