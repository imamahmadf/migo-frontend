import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_PROXY_URL ?? "http://127.0.0.1:4000"}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${process.env.API_PROXY_URL ?? "http://127.0.0.1:4000"}/uploads/:path*`,
      },
    ];
  },
  turbopack: {
    root: rootDir,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    }, 
  },
};

export default nextConfig;
