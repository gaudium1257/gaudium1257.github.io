import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only: every route is prerendered into `out/`.
  output: "export",
  // `/ko` -> `/ko/index.html`, which GitHub Pages resolves without rewrites.
  trailingSlash: true,
  // The default image loader needs a server; static export requires this.
  images: { unoptimized: true },
  // `/` has no locale, so unmatched URLs fall back to a single global 404.
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
