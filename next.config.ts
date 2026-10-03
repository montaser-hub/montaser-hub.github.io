import type { NextConfig } from "next";

// The site is a single static page, hosted on GitHub Pages (`npm run deploy`).
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // A static host has no image optimizer; screenshots are pre-sized WebP.
    unoptimized: true,
  },
};

export default nextConfig;
