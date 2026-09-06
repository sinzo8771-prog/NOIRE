# CHANGELOG — NOIRÉ Remediation (noire-website-plan.md)

Executed 2026-09-06. Baselines in `AUDIT.md`; raw Lighthouse JSON kept during the session
(`lh-*.json`, deleted after recording numbers).

## Before → After

| Metric | Before | After |
|---|---|---|
| Mobile Lighthouse Performance | 70 (live) / 75 (local) | **90–95** (local) |
| Desktop Lighthouse Performance | 84 (live) | **100** (local) |
| Mobile LCP | 4.2–5.4 s | **2.6–3.3 s** |
| Mobile TBT | 230–420 ms | **110–130 ms** |
| Speed Index (mobile) | 3.1–4.7 s | **1.7–2.5 s** |
| First Load JS | 363 kB | **128 kB** |
| Frame payload (desktop / mobile) | 19.79 MB JPG / 19.79 MB | **6.51 MB WebP / 1.16 MB WebP** |
| robots.txt / sitemap.xml | 404 | Generated routes |
| False commerce affordances | Cart drawer, fake checkout, prices | Concierge mailto CTAs |

## Changed

- **Frames (P1.1):** 192 JPGs → WebP desktop set + 64-frame mobile set (`scripts/convert-frames.mjs`,
  sharp q55–60); progressive priority + concurrency-limited idle-time loading; first frame
  `fetchPriority=high`; `vercel.json` immutable cache headers. Original JPGs deleted (in git history).
- **Code splitting (P1.2):** three.js/r3f/drei out of the critical bundle — `Product3DViewer` is a
  dynamic chunk mounted via IntersectionObserver (400px margin); `AmbientParticles` is a dynamic
  chunk mounted during idle time. Removed unused `Environment` import, `gsap` dependency, dead
  components (`ChocolateWorld`, model wrappers, `Materials`, `FallbackStage`, `MagneticButton`),
  `useCart`/`NoireCart`/`formatPrice`, and 4 unused GLB models.
- **Reduced motion (P2):** full branch — native scroll (no Lenis), static canvas frame (no rAF
  scrubbing, no frame streaming), no particles, global CSS motion kill-switch, "Skip to content"
  skip link added.
- **Showcase honesty (P3):** price/currency removed from the catalog; "Add to Bag"/"Bag 0"/cart
  drawer/simulated checkout removed; replaced with "Request This Bar" / "Request a Tasting"
  pre-filled mailto CTAs; Chocolate Room reservation now opens a pre-filled email instead of
  faking a confirmation; footer "Allergen Declarations" and "Direct Trade Transparency" are real
  anchored content sections; shipping scaffolding removed.
- **Trust (P4):** tel: and WhatsApp contact links in the footer (placeholder number — see
  `src/lib/site.ts` TODO); appointment line is a booking mailto; aria-labels on canvas + 3D viewer.
- **SEO (P5):** `robots.ts`, `sitemap.ts`, `metadataBase`, OG image (`public/og-image.jpg`,
  generated from a frame), Twitter card, `siteName`. SSR content verified in raw HTML.

## Verified

- `npm run build` clean (type-check + lint) before and after the final tweak.
- Served HTML contains: "Request a Tasting", "Request This Bar", allergen/direct-trade sections,
  wa.me link, og:image, twitter:card, "Skip to content" — and zero occurrences of
  "Add to Bag", "Bag 0", "YOUR BAG", ShoppingBag.
- `/robots.txt` and `/sitemap.xml` serve correct content from the production build.

## Update — scroll animation on reduced-motion machines

Reported: "scroll animation not working properly." Empirical probe (`scripts/scroll-probe.js`:
wheel + programmatic scroll, canvas pixel fingerprints, request/status capture) proved the
scrubber works on normal-motion machines (192 frames, 6 distinct canvas states, zero errors,
desktop + mobile). Root cause: machines with `prefers-reduced-motion: reduce` active at the OS
level (e.g. Windows "Animation effects" off) got the Phase 2 fallback, which originally froze
the canvas on a single static frame.

Changes:

- Reduced-motion visitors now get **snap-mode scrubbing**: the canvas updates 1:1 with scroll
  through a 64-frame subset (2.2 MB desktop / 1.2 MB mobile) — user-driven motion only, no
  smoothing/lerp/parallax, native scrolling, no autonomous animation.
- New **"Motion On/Off" toggle** in the navigation (persisted in localStorage, broadcast via
  `noire-motion-change`) so visitors can override the OS preference in either direction —
  including forcing the cinematic scrub ON on machines whose OS forces reduced motion.
- Loader now resolves the effective preference synchronously (override > OS query) and reacts
  to mid-session flips; reduced-motion loads the light frame set, normal loads all 192.

Verified (post-fix, production build + headless Chrome): all four scenarios (normal / OS-reduce /
mobile / override) load the correct frame set, repaint while scrolling, with zero console or
network errors.

## Known follow-ups

- Real-phone cellular test and production-hosted Lighthouse run after deploying to Vercel.
- Replace placeholder phone number in `src/lib/site.ts`.
- `scripts/test-browser.js` still exercises the removed cart flow (dev-only script; update if
  the regression suite is used again).
