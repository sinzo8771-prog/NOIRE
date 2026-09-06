# NOIRÉ — Chocolate, Unhurried.

A cinematic single-page experience for a luxury artisan chocolate atelier, built with **Next.js 14 (App Router)**, **React 18**, **Tailwind CSS**, **Lenis** smooth scrolling, and **react-three-fiber / Three.js**.

The page tells the story in eight "acts" — from wild cacao canopy to hand-tempered bar — driven by a frame-by-frame cinematic canvas that scrubs with scroll progress, plus a 3D product viewer. This is a **showcase/atelier site, not e-commerce**: all pricing and availability run through the concierge via email/WhatsApp CTAs.

## Performance & Accessibility

- Cinematic frames ship as **WebP** (`public/frames/webp/`, 192 desktop frames ≈ 4.4 MB) with a **mobile manifest** (`public/frames/webp-mobile/`, every 3rd frame ≈ 1.2 MB) selected by viewport width at runtime.
- Frames load progressively: first ~10 at full priority, the rest streamed with bounded concurrency during browser idle time.
- `three.js`/`react-three-fiber` are **async chunks**: the 3D product viewer mounts when Act VII nears the viewport; the ambient particle layer mounts during idle time after first paint. The 3D viewer has a static WebGL fallback (no WebGL / context loss / load failure).
- `prefers-reduced-motion` disables Lenis smoothing, canvas scrubbing, particles, and CSS motion; a "Skip to content" link is the first focusable element.
- SEO: `robots.txt`, `sitemap.xml`, web manifest, Apple touch icon, canonical, OG/Twitter metadata (all self-hosted).
- Analytics: a zero-dependency event layer (`src/lib/analytics.ts`) records business-interaction events (`navigation_click`, `request_tasting_click`, `request_bar_click`, `product_selected`, `chocolate_room_open`, `contact_click`, `whatsapp_click`, `phone_click`) into `window.__NOIRE_EVENTS__` / `noire:track` for a future analytics vendor.
- Long-lived immutable cache headers for frames/models via `vercel.json`.

## Design Tokens

Palette roles live in `tailwind.config.ts` — use them, never raw hex (one-off
deep elevations like `#0F0A07` and 3D light colors excepted):

| Token | Value | Role, contrast |
|---|---|---|
| `cacao-950/850/700` | `#080604` / `#1A100B` / `#342015` | Canvas, surfaces, hairlines |
| `ivory` | `#F3E8D3` | Primary text (16.66:1) |
| `copper-text` | `#B57B4C` | Small/functional copper text (5.69:1) |
| `copper-surface` / `copper-hover` | `#835534` / `#6B4227` | Copper surfaces + hover (5.22 / 7.11:1) |
| `copper` | `#9B6742` | Graphics only: borders, rings, bars, large display |

Rule: text never goes below `ivory/50`; icons never below their 3:1 pairings.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

## Scripts & Tools

| Script | Purpose |
|---|---|
| `npm run dev` / `build` / `start` / `lint` | Standard Next.js workflows |
| `node scripts/convert-frames.mjs [--clean]` | Regenerate WebP frame sets + `public/og-image.jpg` from raw JPGs |
| `node scripts/test-browser.js` | Full Puppeteer regression suite (8 groups / 127 checks: boot, acts, nav, product switcher, concierge CTAs, modal, mobile + viewport sweep, reduced motion, keyboard, analytics). Screenshots → `probe-artifacts/browser-regression/`. Requires Chrome + server on :3000 |
| `node scripts/verify-fixes.js` | Targeted checks: fonts, navigation, animations plugin |
| `node scripts/probe-overflow.js` | Detect horizontal overflow offenders at mobile width |
| `node scripts/generate-models.js` | Regenerate the `.glb` product models in `public/models/` |

## Structure

```
src/
  app/            # App Router: layout, page, global styles, robots.ts, sitemap.xml
  components/
    noire/        # Site sections & UI: navigation, modals, canvas, product stage
    noire/acts/   # The eight cinematic acts (P6.1 decomposition of page.tsx)
    ui/           # shadcn-style primitives (button, dialog, sheet, …)
  three/          # react-three-fiber components (Particles + lazy 3D viewer)
  hooks/          # useAudio, useDeviceCapability, useReducedMotion
  data/           # Product catalog (no prices — concierge model)
  lib/            # cn(), site config, analytics event layer
public/
  frames/         # WebP cinematic scroll frames (webp/ desktop, webp-mobile/ mobile)
  models/         # GLB product models
```

## Deployment

Deployed as a fully static Next.js build — no backend required. Optimized for [Vercel](https://vercel.com) (zero-config; see `vercel.json` for cache headers) or Cloudflare Pages / Netlify.

> There is no cart or checkout. "Request This Bar" / "Request a Tasting" open a pre-filled email to the concierge. Replace the placeholder phone number in `src/lib/site.ts` before launch.

