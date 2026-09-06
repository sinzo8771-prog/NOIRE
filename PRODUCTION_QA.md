# NOIRÉ — Production QA Record

> **Purpose (P0.7):** record the production Lighthouse baselines and real-device
> results **after the next deployment**. Local post-fix numbers are listed as a
> baseline; do not claim production performance from local runs alone.

## Deployment

| Field | Value |
|---|---|
| Deploy commit | _(fill after deploy)_ |
| Deployed URL | https://noireee.vercel.app/ |
| Deploy date | _(fill after deploy)_ |

## Production Lighthouse — Mobile

| Metric | Value |
|---|---|
| Performance | |
| Accessibility | |
| Best Practices | |
| SEO | |
| LCP | |
| INP | |
| CLS | |
| TBT | |
| TTFB | |
| Speed Index | |

## Production Lighthouse — Desktop

| Metric | Value |
|---|---|
| Performance | |
| Accessibility | |
| Best Practices | |
| SEO | |
| LCP | |
| INP | |
| CLS | |
| TBT | |
| TTFB | |
| Speed Index | |

## Real-device test (P0.8)

| Device | Browser | Network | Initial render | Frame streaming | 3D | Memory/heat | Notes |
|---|---|---|---|---|---|---|---|
| iPhone (Safari) | 4G | | | | | | |
| Android (Chrome) | 4G | | | | | | |
| Mid-range Android | Slow 4G | | | | | | |

## Historical local baseline (pre-deployment, from AUDIT.md)

- Desktop first load JS: **131 kB** (post P1–P10 work; 129 kB before)
- Desktop frame payload: **6.51 MB** · Mobile frame payload: **1.16 MB**
- Local post-fix mobile Lighthouse: **90–95** · desktop: **100**
- Mobile TBT: **110–130 ms**

## Browsers / viewports regression sweep (P8, automated)

`node scripts/test-browser.js` — **127/127 checks pass** across:

- Desktop 1440×900, tablet 768×1024, 1024×768
- Mobile 375×812, 390×844, 414×896 (no horizontal overflow at any width)
- Reduced motion, keyboard-first, analytics event layer

Capture location: `probe-artifacts/browser-regression/`

## Local verification log

- **2026-09-06 (post P0.3/P6.3 centralization):** fresh `npm run build`
  (First Load JS 131 kB / route 43.2 kB — unchanged) + `next start` +
  `node scripts/test-browser.js` → **127/127 pass, 0 console errors,
  0 page errors** (`probe-artifacts/rerun2-2026-09-06.log`).
  Note: an earlier run in the same session failed spuriously because a stale
  `next start` process (pre-rebuild) was still bound to :3000 while `.next`
  on disk had already been replaced — chunk 400s, no hydration. Restarting
  the server against the current build resolved it; not an app bug.