import type { NextConfig } from "next";

// The site is a single static page, hosted on GitHub Pages (`npm run deploy`).
const nextConfig: NextConfig = {
  output: "export",
  // `npm run dev` serves its scripts only to localhost unless another address is
  // listed here. Add this machine's network address to test on a phone over Wi-Fi.
  allowedDevOrigins: ["192.168.1.23"],
  // Dev-only badge; its default bottom-left spot covers the mobile tab bar.
  devIndicators: { position: "top-right" },
  images: {
    // A static host has no image optimizer; screenshots are pre-sized WebP.
    unoptimized: true,
  },
};

export default nextConfig;
