import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// DESIGN.md §3 names Instrument Serif as the display face. It ships only
// weight 400 (normal + italic), which is exactly what .font-display and
// .font-editorial use — no extra font files to trim.
const serifFont = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Inter({
  subsets: ["latin"],
  // Inter 400 (body), 500 (font-medium), 600 (font-semibold) are used;
  // 300 is not used anywhere (P5.3).
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "NOIRÉ",
    statusBarStyle: "black-translucent",
  },
  // Next emits the deprecated apple-mobile-web-app-capable via appleWebApp;
  // add the modern equivalent so Chrome stops warning.
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#080604",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable} dark`}>
      <body className="bg-cacao-950 text-ivory selection:bg-copper selection:text-ivory antialiased">
        {children}
      </body>
    </html>
  );
}
