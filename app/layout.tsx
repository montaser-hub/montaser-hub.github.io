import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://montaser-ismail.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Montaser Ismail — Software Engineer",
  description:
    "Full-stack software engineer building enterprise-grade web platforms — scheduling systems, admin portals, and APIs with React, Angular, Node.js, and TypeScript.",
  openGraph: {
    title: "Montaser Ismail — Software Engineer",
    description:
      "Full-stack software engineer building enterprise-grade web platforms with React, Angular, Node.js, and TypeScript.",
    url: siteUrl,
    siteName: "Montaser Ismail",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
