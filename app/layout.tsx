import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import { copy, profile } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${profile.name} — ${profile.title}`;

export const metadata: Metadata = {
  // Absolute URLs for link previews; unset until the site has a public address.
  metadataBase: profile.site ? new URL(profile.site) : undefined,
  title,
  description: copy.metaDescription,
  openGraph: {
    title,
    description: copy.metaDescription,
    url: profile.site,
    siteName: profile.name,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.png", type: "image/png" }],
    apple: "/favicon.png",
  },
};

// "cover" lets the mobile tab bar reach the screen's bottom edge; it pads itself clear of the home indicator.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#05070a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Without JavaScript the scroll-in animations never run: show their content at once. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="translateY(110%)"]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
