# NOIRÉ — Chocolate, Unhurried.

A cinematic single-page experience for a luxury artisan chocolate atelier, built with **Next.js 14 (App Router)**, **React 18**, **Tailwind CSS**, **Lenis** smooth scrolling, and **react-three-fiber / Three.js**.

The page tells the story in eight "acts" — from wild cacao canopy to hand-tempered bar — driven by a frame-by-frame cinematic canvas that scrubs with scroll progress, plus a 3D product viewer and a full front-end cart flow.

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
| `node scripts/test-browser.js` | Full Puppeteer regression suite (requires Chrome + server on :3000) |
| `node scripts/verify-fixes.js` | Targeted checks: fonts, navigation, animations plugin |
| `node scripts/probe-overflow.js` | Detect horizontal overflow offenders at mobile width |
| `node scripts/generate-models.js` | Regenerate the `.glb` product models in `public/models/` |

## Structure

```
src/
  app/            # App Router: layout, page, global styles, favicon
  components/
    noire/        # Site sections & UI: navigation, cart, modals, canvas
    ui/           # shadcn-style primitives (button, dialog, sheet, …)
    effects/      # MagneticButton
  three/          # react-three-fiber scene components
  hooks/          # useCart, useAudio, useDeviceCapability, useReducedMotion
  data/           # Product catalog
public/
  frames/         # 192 cinematic scroll frames
  models/         # GLB product models
```

## Deployment

Deployed as a fully static Next.js build — no backend required. Optimized for [Vercel](https://vercel.com) (zero-config) or Cloudflare Pages / Netlify.

> Cart and checkout are front-end simulations; no payment processing is performed.
