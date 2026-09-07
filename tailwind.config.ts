import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cacao: {
          950: "#080604", // Cacao Black - primary background
          900: "#120B07",
          850: "#1A100B", // Dark Cocoa - secondary surface
          800: "#261710",
          700: "#342015", // Roasted Cacao - depth and layered surfaces
          600: "#4D3020",
          500: "#6B432D",
          400: "#9B6742", // Muted Copper - accent only
          300: "#C4926C",
          200: "#DEC3A9",
          100: "#EFE2D3",
          50: "#F3E8D3",  // Warm Ivory - primary text
        },
        ivory: {
          DEFAULT: "#F3E8D3",
          muted: "#C5B9A4",
          faint: "#8A7E6C",
        },
        copper: {
          DEFAULT: "#9B6742", // graphics: borders, rings, bars, large display
          text: "#B57B4C",    // small/functional text on cacao-950 (5.69:1 AA)
          bright: "#D29A6B",  // large editorial italic + display words (8.26:1 AAA)
          surface: "#835534", // copper surfaces carrying ivory text (5.22:1 AA)
          hover: "#6B4227",    // hover state for copper surfaces (7.11:1 AA)
          light: "#B87F56",
          dark: "#744B2E",
          glow: "rgba(155, 103, 66, 0.2)",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Instrument Serif", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        md: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
