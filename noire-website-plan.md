# NOIRÉ Website — Remediation Plan

**Target:** `noireee.vercel.app` (repo: `sinzo8771-prog/NOIRE`)
**Stack assumed:** React + Vite, GSAP/ScrollTrigger, Lenis, react-three-fiber/canvas frame-sequence
**Goal:** Fix performance, completeness, and trust gaps found in manual review before this site is used for real commerce or portfolio submission.

Each task has: what to do, why, and a done-when check. Work top to bottom — later phases assume earlier ones are fixed. Do not skip the audit step; every fix should be verified against real numbers, not assumed.

---

## Phase 0 — Baseline Audit (do this first, before any code changes)

- [ ] Run Lighthouse (mobile + desktop, throttled) on the deployed URL. Record LCP, TBT, CLS, and Performance score.
- [ ] Run `npm run build` and inspect the output bundle size (`vite-bundle-visualizer` or `rollup-plugin-visualizer`). Record total JS, largest chunks.
- [ ] Count actual network requests + total transferred bytes on first load (Chrome DevTools Network tab, cache disabled, mobile throttle "Slow 4G").
- [ ] Test the live site on a real phone (not devtools emulation) over cellular data if possible. Note scroll feel, jank, load time to first interaction.
- [ ] Confirm which of the 4 product SKUs (ORIGIN 72, DARK SEA SALT 70%, ROASTED HAZELNUT 68%, MADAGASCAR MILK 55%) currently render full detail (price, tasting notes, Add to Bag) vs. just a name.
- [ ] Confirm whether "Add to Bag" / cart counter is currently wired to anything or purely decorative (it should be replaced — see Phase 3 — since this is not an e-commerce site).
- [ ] Check for a `prefers-reduced-motion` media query anywhere in the codebase (`grep -r "prefers-reduced-motion" src/`).

**Output of this phase:** a short `AUDIT.md` with the numbers above. Every later phase references these baselines to confirm improvement.

---

## Phase 1 — Performance (highest priority — this is the site's biggest risk)

### 1.1 Frame sequence ("Cinematic Frames Initializing 0/192")
- [ ] Identify where the 192 frames are loaded (likely a canvas scrubber tied to scroll position).
- [ ] Confirm format: if raw PNG/JPG sequence, convert to WebP (or AVIF with JPG fallback) — expect 40–60% size reduction.
- [ ] Implement **progressive/batched loading**: load first ~10–15 frames (enough for above-the-fold interaction) synchronously, then stream the rest in the background while showing a lightweight loader — not "Loading 0/192" blocking the whole page.
- [ ] Add a **reduced frame count for mobile** (e.g. every 3rd frame, or drop to 64 frames) via viewport-width detection or a mobile-specific manifest.
- [ ] Cap total frame-sequence payload budget: target under ~3–4MB total on mobile, under ~8MB on desktop. If over, reduce resolution or frame count further.
- [ ] Verify frames are served with proper cache headers (long max-age, immutable) — check Vercel deployment config.

### 1.2 Code splitting
- [ ] Confirm heavy libs (GSAP, Three.js/r3f, Lenis) are not all in the main bundle — use dynamic `import()` for anything below the hero fold (Acts III–VIII) so first paint doesn't wait on the whole animation stack.
- [ ] Lazy-load the 3D product carousel (Act VII) — it's below the fold, defer until scroll-near.

### 1.3 Acceptance criteria for Phase 1
- [ ] Mobile Lighthouse Performance score ≥ 70 (stretch: 85+).
- [ ] LCP under 2.5s on throttled mobile.
- [ ] Total first-load JS+asset payload reduced by at least 40% from Phase 0 baseline.

---

## Phase 2 — Scroll & Interaction Behavior

- [ ] Test Lenis + ScrollTrigger interaction on: trackpad, mouse wheel, touch (real phone), and keyboard (Page Down / arrow keys / spacebar). All four must move the page.
- [ ] Confirm scroll-jacking doesn't break browser back/forward gesture navigation on mobile Safari and Chrome Android.
- [ ] Add a `prefers-reduced-motion` branch: when set, disable scroll-triggered pinning/scrubbing and fall back to normal document scroll with simple fades (or no animation). This is both an accessibility requirement and reduces Lighthouse a11y penalties.
- [ ] Add a visible skip-animation / skip-to-content control for users who don't want the cinematic experience (common pattern: small "Skip Intro" button in corner during initial load).

**Acceptance:** site is fully navigable with animations disabled, and Lighthouse Accessibility score is recorded (target ≥ 90).

---

## Phase 3 — Showcase Completeness (not e-commerce — this is a brand/portfolio site)

- [ ] Build out full product detail for all 4 SKUs to match the ORIGIN 72 template: cacao %, tasting notes, palate architecture bars, terroir, conche/temper info. Drop price fields entirely if there's no real transaction happening — a price with no working checkout reads as broken, not aspirational.
- [ ] Replace "Add to Bag" / "Bag 0" with a CTA that matches reality — e.g. "Inquire" / "Request a Tasting" / "Join the List" — routing to the existing email or a simple form. A cart icon on a non-commerce site sets a false expectation the moment someone clicks it.
- [ ] Verify the "Allergen Declarations" and "Direct Trade Transparency" footer links actually navigate somewhere. Either build that content out (even a short paragraph each) or remove the links — dead links under a footer this polished stand out.
- [ ] Since there's no checkout, drop any shipping/returns-policy scaffolding — keep the footer focused on story + contact + tasting-visit info.

---

## Phase 4 — Trust & Business Info

- [ ] Add a phone/WhatsApp contact option alongside the email — chocolate/tasting-appointment businesses convert better with a direct line.
- [ ] Confirm the Mumbai address and "tasting visits by appointment" copy has a real booking mechanism (form, Calendly link, or at minimum a mailto with subject prefilled) rather than just prose.
- [ ] Add alt text to all product/hero imagery for accessibility and SEO image indexing (check current state — likely missing given canvas-heavy build).

---

## Phase 5 — SEO/Technical Polish

- [ ] Confirm `robots.txt` and `sitemap.xml` exist and are correctly configured (Vercel default may not generate these automatically for a Vite SPA).
- [ ] If this is a client-rendered SPA, confirm meta tags (already good) are present in the actual served HTML **before JS hydration** — check via `curl` or "view source", not just DevTools rendered DOM, since crawlers may not execute JS.
- [ ] Consider prerendering or SSR (Vite SSG plugin, or Vercel's static generation) for the hero/product content if crawlability matters for this brand.

---

## Phase 6 — Final Verification

- [ ] Re-run Lighthouse mobile + desktop, compare against Phase 0 baseline numbers.
- [ ] Re-test on real phone over cellular.
- [ ] Confirm all 4 products are fully browsable with complete detail (no dead "Add to Bag" affordance remaining).
- [ ] Confirm reduced-motion path works.
- [ ] Ship a short `CHANGELOG.md` summarizing before/after metrics.

---

## Priority order if time-constrained
1. Phase 1 (performance) — this is the single biggest risk to the site being usable at all.
2. Phase 2 (reduced-motion / scroll robustness) — accessibility + broad-device correctness.
3. Phase 3 (showcase completeness) — remove the false-commerce affordance, finish product detail.
4. Phases 4–5 — polish, do once the above are solid.
