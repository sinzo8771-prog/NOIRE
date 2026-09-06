import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NOIRÉ — Chocolate, Unhurried.",
  description:
    "A cinematic journey from wild single-origin cacao canopy to slow-tempered artisan chocolate. Built with unhurried devotion.",
  keywords: [
    "artisan chocolate",
    "single origin cacao",
    "NOIRÉ",
    "craft chocolate",
    "luxury dark chocolate",
  ],
  openGraph: {
    title: "NOIRÉ — Chocolate, Unhurried.",
    description:
      "A cinematic journey from wild single-origin cacao canopy to slow-tempered artisan chocolate.",
    type: "website",
    locale: "en_US",
    siteName: "NOIRÉ Atelier",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOIRÉ — single-origin artisan chocolate, hand-tempered in Mumbai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOIRÉ — Chocolate, Unhurried.",
    description:
      "A cinematic journey from wild single-origin cacao canopy to slow-tempered artisan chocolate.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable} dark`}>
      <body className="bg-[#080604] text-[#F3E8D3] selection:bg-[#9B6742] selection:text-[#F3E8D3] antialiased">
        {children}
      </body>
    </html>
  );
}
