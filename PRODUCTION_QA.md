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

`node scripts/test-browser.js` — **157/157 checks pass** across:

- Desktop 1440×900, tablet 768×1024, 1024×768
- Mobile 375×812, 390×844, 414×896 (no horizontal overflow at any width)
- Reduced motion, keyboard-first, analytics event layer
- Hero variant route (`?hero=classic` restores Craving; Nocturne is default) + tasting interlude (Test 9) + reserve drop (Test 10) + interactivity: origins marquee, tasting timer, atelier accordion, reveals (Test 11)

Capture location: `probe-artifacts/browser-regression/`

## Local verification log

- **2026-09-07 (rAF marquee rewrite):** `npm run build` + `next start` +
  suite → **157/157 pass** — marquee retimed CSS animations restarted
  iterations and juddered, so both loops are now integrator-driven
  (translate3d modulo half-width, IO-gated, hover pause); measured
  60px/s rest → 146px/s on scroll nudge.
- **2026-09-07 (Dual marquee loops):** `npm run build` + `next start` +
  suite → **157/157 pass** — second counter-scrolling craft row, both
  rows velocity-reactive, counter-row direction asserted.
- **2026-09-07 (Marquee alive):** `npm run build` + `next start` +
  suite → **156/156 pass** — origins marquee is velocity-reactive
  (36s base, speeds + follows scroll direction, edge fade masks).
- **2026-09-07 (Interactivity batch):** fresh `npm run build`
  + `next start` + `node scripts/test-browser.js` → **155/155 pass,
  0 console errors, 0 page errors**, including new Test 11 (origins
  marquee incl. masked-track probe fix, 90s tasting timer begin/pause/
  reset, atelier accordion click + keyboard, scroll Reveal). Probe
  `horizontalOffenders` now skips elements masked by deliberate
  non-body `overflow-hidden` ancestors.
- **2026-09-07 (Nocturne default + Reserve Drop):** fresh `npm run build`
  + `next start` + `node scripts/test-browser.js` → **143/143 pass,
  0 console errors, 0 page errors**, including new Test 10 (#reserve-drop
  present, ordered tasting > drop > footer, clean at 375px) and updated
  Test 9 (Nocturne default, `?hero=classic` restores Craving).
- **2026-09-07 (OpenDesign additions):** fresh `npm run build`
  + `next start` + `node scripts/test-browser.js` → **137/137 pass,
  0 console errors, 0 page errors**, including new Test 9 (hero variant
  route renders Nocturne with no hydration errors; #tasting present,
  ordered act-8 > tasting > footer, clean at 375px).
- **2026-09-06 (post P0.3/P6.3 centralization):** fresh `npm run build`
  (First Load JS 131 kB / route 43.2 kB — unchanged) + `next start` +
  `node scripts/test-browser.js` → **127/127 pass, 0 console errors,
  0 page errors** (`probe-artifacts/rerun2-2026-09-06.log`).
  Note: an earlier run in the same session failed spuriously because a stale
  `next start` process (pre-rebuild) was still bound to :3000 while `.next`
  on disk had already been replaced — chunk 400s, no hydration. Restarting
  the server against the current build resolved it; not an app bug.