# NOIRÉ — Chocolate, Unhurried.

A cinematic single-page experience for a luxury artisan chocolate atelier, built with **Next.js 14 (App Router)**, **React 18**, **Tailwind CSS**, **Lenis** smooth scrolling, and **react-three-fiber / Three.js**.

The page tells the story in eight "acts" — from wild cacao canopy to hand-tempered bar — driven by a frame-by-frame cinematic canvas that scrubs with scroll progress, plus a 3D product viewer. This is a **showcase/atelier site, not e-commerce**: all pricing and availability run through the concierge via email/WhatsApp CTAs.

## Performance & Accessibility

- Cinematic frames ship as **WebP** (`public/frames/webp/`, 192 desktop frames ≈ 6.5 MB) with a **mobile manifest** (`public/frames/webp-mobile/`, every 3rd frame ≈ 1.2 MB) selected by viewport width at runtime.
- Frames load progressively: first ~10 at full priority, the rest streamed with bounded concurrency during browser idle time.
- `three.js`/`react-three-fiber` are **async chunks**: the 3D product viewer mounts when Act VII nears the viewport; the ambient particle layer mounts during idle time after first paint.
- `prefers-reduced-motion` disables Lenis smoothing, canvas scrubbing, particles, and CSS motion; a "Skip to content" link is the first focusable element.
- Long-lived immutable cache headers for frames/models via `vercel.json`.

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
| `node scripts/test-browser.js` | Full Puppeteer regression suite (requires Chrome + server on :3000) |
| `node scripts/verify-fixes.js` | Targeted checks: fonts, navigation, animations plugin |
| `node scripts/probe-overflow.js` | Detect horizontal overflow offenders at mobile width |
| `node scripts/generate-models.js` | Regenerate the `.glb` product models in `public/models/` |

## Structure

```
src/
  app/            # App Router: layout, page, global styles, robots.ts, sitemap.xml
  components/
    noire/        # Site sections & UI: navigation, modals, canvas, product stage
    ui/           # shadcn-style primitives (button, dialog, sheet, …)
  three/          # react-three-fiber components (Particles + lazy 3D viewer)
  hooks/          # useAudio, useDeviceCapability, useReducedMotion
  data/           # Product catalog (no prices — concierge model)
  lib/            # cn() + site config (contact links, OG metadata)
public/
  frames/         # WebP cinematic scroll frames (webp/ desktop, webp-mobile/ mobile)
  models/         # GLB product models
```

## Deployment

Deployed as a fully static Next.js build — no backend required. Optimized for [Vercel](https://vercel.com) (zero-config; see `vercel.json` for cache headers) or Cloudflare Pages / Netlify.

> There is no cart or checkout. "Request This Bar" / "Request a Tasting" open a pre-filled email to the concierge. Replace the placeholder phone number in `src/lib/site.ts` before launch.

