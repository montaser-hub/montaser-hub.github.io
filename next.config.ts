import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

/** This machine's IPv4 addresses on the local network, e.g. 192.168.1.23. */
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .flatMap((entry) => (entry && entry.family === "IPv4" && !entry.internal ? [entry.address] : []));

// The site is a single static page, hosted on GitHub Pages (`npm run deploy`).
const nextConfig: NextConfig = {
  output: "export",
  // `npm run dev` serves its scripts only to localhost unless another address is
  // listed here. Allowing this machine's own network addresses lets a phone on
  // the same Wi-Fi open the dev server, whatever address the router hands out.
  allowedDevOrigins: lanAddresses,
  // Dev-only badge; its default bottom-left spot covers the mobile tab bar.
  devIndicators: { position: "top-right" },
  images: {
    // A static host has no image optimizer; screenshots are pre-sized WebP.
    unoptimized: true,
  },
};

export default nextConfig;
