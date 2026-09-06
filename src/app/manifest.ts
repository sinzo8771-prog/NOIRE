import type { MetadataRoute } from "next";

// P3 — PWA-style manifest (decorative; the site has no offline app shell).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NOIRÉ — Chocolate, Unhurried.",
    short_name: "NOIRÉ",
    description: "A cinematic luxury chocolate atelier in Mumbai.",
    start_url: "/",
    display: "standalone",
    background_color: "#080604",
    theme_color: "#080604",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}