# NOIRÉ — Full Production Plan (Current as of 2026-09-06)

> Repo: `sinzo8771-prog/NOIRE` · Live: `https://noireee.vercel.app/`
> **This file supersedes `NOIRÉ — Updated AI Agent Production Plan — September
> 2026.md` and the earlier `NOIRE_AGENT_PLAN.md` delta.** Read this one only —
> it folds in everything from both, corrected to current repo state. Every
> item below is tagged `[DONE]`, `[OPEN — AGENT]`, or `[OPEN — OWNER]`.

## 0. Mission & positioning

Finish NOIRÉ as a credible, production-ready luxury chocolate atelier
website without destroying its cinematic character.

NOIRÉ is a **showcase/atelier site, not e-commerce**. It uses "Request This
Bar," "Request a Tasting," concierge email/WhatsApp/phone, and atelier-visit
inquiries instead of a cart. There must be no fake cart, no fake checkout,
no fabricated orders, no invented payment flow, no fake stock countdown, no
fake scarcity, no fake pricing — do not reintroduce conventional e-commerce
UI unless the business model explicitly changes.

**Guiding principle for every decision below:**
> A real luxury chocolate house that happens to have a cinematic website —
> not a cinematic website pretending to be a chocolate house.

---

## 1. What's already done — do not redo

### Engineering / performance (prior sessions)
- `[DONE]` Next.js 14 App Router, SSR content — crawlers see hero/product
  content without JS.
- `[DONE]` Frame pipeline: 192 desktop WebP frames (6.51MB) + 64 mobile
  WebP frames (1.16MB), down from 19.79MB JPG. Progressive priority
  loading, bounded concurrency, immutable cache headers (`vercel.json`).
- `[DONE]` three.js/r3f/drei split into async chunks — 3D viewer mounts via
  IntersectionObserver near Act VII, ambient particles mount during idle
  time. First Load JS: 128kB (was 363kB).
- `[DONE]` Reduced-motion branch: native scroll, no Lenis, no canvas
  scrubbing/rAF loop, no particles, CSS motion killed via media query,
  "Skip to content" as first focusable element.
- `[DONE]` robots.txt / sitemap.xml generated via `src/app/robots.ts` /
  `sitemap.ts`. `metadataBase`, OG image, Twitter card, `siteName` all set.
- `[DONE]` Dead code removed: `gsap` (installed, never imported), unused
  `ChocolateWorld`/model components, `Materials`, `FallbackStage`,
  `MagneticButton`, 4 unused GLBs.
- `[DONE]` Cart/checkout fully removed: `useCart`, `NoireCart`,
  `formatPrice`, price/currency fields, simulated checkout — replaced with
  concierge `mailto:` CTAs. Footer "Allergen Declarations"/"Direct Trade
  Transparency" converted from dead `<span>`s to real anchored sections.
- `[DONE]` Desktop navigation reduced to: Origin · Craft · Sensory ·
  Collection · Request a Tasting.
- `[DONE]` Browser regression suite (`scripts/test-browser.js`) already
  rewritten around the current app (no cart/checkout tests remain) —
  143/143 checks passing as of the last local run: boot, 8 acts, nav,
  product switcher, concierge CTAs, modal, mobile + viewport sweep,
  reduced motion, keyboard, analytics, hero variant + tasting interlude
  (Test 9, added 2026-09-07), reserve drop (Test 10) with Nocturne as
  the default hero (`?hero=classic` restores Craving). *(The old planning doc still listed
  "fix outdated browser regression suite" as open — it isn't; this was
  already done.)*
- `[DONE]` "trace traces" duplicate-wording typo fixed → "May contain
  traces of dairy."
- `[DONE]` "Cacao" vs "cocoa" vocabulary made consistent (cacao only).
- `[DONE]` Local Lighthouse (post-fix): mobile 90–95, desktop 100. LCP
  2.6–3.3s mobile, TBT 110–130ms. **Not yet re-verified in production** —
  see §4, P0.7/P0.8.

### Content honesty (this session, 2026-09-06)
- `[DONE]` **Conche duration conflict resolved.** Code already said 72h
  consistently (`CONC_PROCESS` constant in `src/data/products.ts`,
  ORIGIN 72's `roastProfile` corrected to "Low-temperature 72-hour
  conche"). `CONTENT_FACT_CHECK.md` rows 13–14 were stale (`CONFLICT`) —
  corrected to `RESOLVED`.
- `[DONE]` Copy pass removing unverified specificity claims (ledger rows
  6, 7, 8, 10, 11, 12 — all now `REWRITTEN`):
  - "Single-estate" language dropped from `Act01Craving.tsx` (hero line),
    `Act08Savor.tsx` (salon CTA), `ChocolateRoomModal.tsx` (flight
    description), `NoireFooter.tsx` (direct-trade paragraph), and two
    `harvest` fields in `products.ts`.
  - "Heirloom" genetic claims dropped from `Act02Origin.tsx`, the DARK SEA
    SALT description + ingredient label in `products.ts`, and a
    Chocolate Room flight name ("Heirloom & Salt Exploration" →
    "Wild Cacao & Salt Exploration").
  - Specific "Winter 2025" harvest year softened → "Winter Micro-Lot".
  - Footer direct-trade paragraph: removed "multi-year fixed-price
    contracts," "growers are paid well above commodity market rate," and
    "every harvest lot … traceable to a single estate and fermentation
    batch" — replaced with softer positioning language. The underlying
    direct-trade *partnership* claim itself is untouched and still needs
    owner evidence (row 9, §2).
  - Fixed an internal contradiction: "Grand Cru **Single-Terroir** Flight"
    was described one line below as "**four unblended harvests**" — since
    the four SKUs come from four different countries, that's not a single
    terroir. Renamed to "Grand Cru Harvest Flight."
- `[DONE]` Verification: `tsc --noEmit` clean, repo-wide grep for every
  removed phrase returns zero hits, `next lint` shows no new warnings (one
  pre-existing unrelated warning in `NoireNavigation.tsx` — a
  `react-hooks/exhaustive-deps` ref-cleanup warning — untouched by this
  pass). `package-lock.json` churn from a sandboxed `npm install` was
  reverted before this pass was considered complete.
- `[OPEN — AGENT]` `npm run build` and `scripts/test-browser.js` were
  **not** run against these specific changes — the environment used had no
  network access to Google Fonts, which `next/font` needs at build time.
  **Run both before deploying** (§4).

**Do not re-litigate any of the above.** If a future pass is about to
change the conche duration, re-add "heirloom"/"single-estate," reopen the
"trace traces" typo, or rewrite `scripts/test-browser.js` "to remove the
cart tests" — stop, it's already done.

---

## 2. P0 — Launch blockers

### `[OPEN — OWNER]` P0.1 Replace placeholder phone/WhatsApp number
Placeholder `+91 98200 00000` in `src/lib/site.ts`
(`ATELIER_PHONE_DISPLAY`, `ATELIER_PHONE_E164`). Correctly gated behind
`ATELIER_PHONE_CONFIGURED = false` so it doesn't render yet. Update all
three constants and flip the flag once the real number exists. Do not
invent a number.
```text
[ ] No placeholder number exists anywhere in repository
[ ] tel: opens correct number
[ ] WhatsApp opens correct number
[ ] Display + E.164 formatting correct
```

### `[OPEN — OWNER]` P0.2 Verify allergen facts
Two specific claims in `products.ts` carry real liability if wrong, not
just brand risk:
- "Processed in a **dedicated tree-nut free atelier**" (ORIGIN 72)
- "May contain traces of **dairy from shared artisanal stone mills**"
  (DARK SEA SALT)

These are the single highest-priority open item in the whole plan. An
agent must not soften, invent, or "resolve" these without real facility
information — get owner confirmation, then either keep as-is or requalify
(e.g. "dedicated tree-nut-free line" if it's a line, not a whole facility).

### `[OPEN — OWNER]` P0.3 Cacao origin & sourcing evidence
Four SKU `origin` fields (Tumaco, Esmeraldas, Sambirano Valley,
Chanchamayo) and the footer's direct-trade partnership claim (row 9) need
either sourcing proof or an owner decision to keep them as brand-level
place names rather than literal sourcing claims.

### `[OPEN — OWNER]` P0.4 IGP hazelnut certification
"Alta Langa **IGP** hazelnuts" / "Piedmont Hazelnuts **IGP**" — IGP is a
legally protected term. Claiming it without documentation is a real
regulatory-labeling risk, not just marketing risk. Needs evidence or must
be dropped, similar treatment to allergens (not a copy-softening job for
an agent to do unilaterally).

### `[OPEN — OWNER]` P0.5 Ingredient lists vs. real wrapper labels
`products.ts` `ingredients` arrays must match actual packaging before
print/launch.

### `[OPEN — OWNER]` P0.6 Atelier address & concierge mailbox
"18 Ropewalk Lane, Heritage Arts District, Fort, Mumbai 400 001" and
`concierge@noire-chocolate.com` need confirmation they're real and
monitored before launch.

### `[OPEN — AGENT]` P0.7 Re-run build + regression suite for real
`npm run build` then `node scripts/test-browser.js` against the current
HEAD (needs network access to Google Fonts, unavailable in the sandbox
this session ran in). Confirm 0 console errors, 0 visual regressions, and
none of the removed phrases (§1) reappear in rendered HTML.

### `[OPEN — AGENT]` P0.8 Production deployment verification
After the latest code deploys, run production Lighthouse (mobile +
desktop) and record Performance/Accessibility/Best Practices/SEO/LCP/INP/
CLS/TBT/TTFB/Speed Index into `PRODUCTION_QA.md` (currently a blank
template). Local numbers (mobile 90–95, desktop 100) are not a substitute.

### `[OPEN — AGENT/OWNER]` P0.9 Real-device performance test
iPhone Safari, Android Chrome, mid-range Android; 4G and slow 4G. Check
initial render, frame streaming, 3D loading, memory/heat, responsiveness.
Do not claim "mobile optimized" from Lighthouse alone.

### `[OPEN — AGENT]` P0.10 Sweep for more same-page contradictions
The Single-Terroir/four-harvests catch (§1) came from reading claims
against each other on the same screen, not the original per-claim ledger
methodology. Do one dedicated pass specifically cross-checking claims
against each other, not just against outside evidence.

---

## 3. P1 — Product UX improvement (after P0)

- `[OPEN]` **P1.1/P1.2 Faster product discovery without breaking the
  cinematic homepage.** Add a subtle "Explore Collection" path (hero
  secondary action, nav, or an Act IV/VI transition) for visitors who
  already know they want a product. Do not replace the long-form story
  with a product grid, and don't stack multiple competing CTAs.
- `[OPEN]` **P1.3 Product information hierarchy.** Keep current data
  richness; ensure order is Name → one-line proposition → short
  description → tasting notes → palate metrics → origin/process → weight
  → Request CTA. Don't bury practical info below decorative storytelling.
- `[OPEN]` **P1.4 Process transparency, compact form.** A tight
  Origin/Harvest/Process/Weight block instead of more paragraphs — lets
  storytelling and factual clarity coexist. (Note: any such block must use
  the softened harvest labels from §1, not the original "Winter 2025
  Micro-Lot"/"Single Estate…" strings.)
- `[OPEN]` **P1.5 Mobile menu accessibility audit.** Focus trap, focus
  return to menu button, Escape closes, `aria-expanded`/`aria-controls`,
  scroll lock while open, auto-close after selection. Don't add more menu
  items (currently 5, which is already the right count).
- `[OPEN]` **P1.6 CTA semantics.** Pick one consistent primary/secondary
  pair ("Request This Bar" / "Request a Tasting") and don't alternate
  among Inquire/Request/Discover/Reserve/Explore/Enter/Book unless each is
  a genuinely different action.
- `[OPEN]` **P1.7 Mobile text density.** Audit paragraphs, metadata
  labels, tasting notes, metrics, footer declarations for mobile
  readability — fix via fewer words/better breaks/hierarchy/spacing, not
  just smaller font sizes.
- `[OPEN]` **P1.8 Act VI visual hierarchy.** The BITTER/WARM/DEEP/GONE
  boxed-card treatment is one of the more conventional moments in an
  otherwise editorial site — consider staggered/sequential typography
  instead of a card grid. Don't add more cards.
- `[OPEN]` **P1.9 Act VII product selector states.** Ensure
  selected/hover/focus/current states are all clear and touch-friendly;
  avoid tiny desktop-only tabs.

---

## 4. P2 — Trust & brand credibility

- `[OPEN]` **P2.1 Pair poetic claims with evidence — only real metrics.**
  Example pattern: UNHURRIED → 72 hours; HAND-TEMPERED → Form V crystal
  structure; SMALL BATCH → 80g bar. **Do not use "SINGLE ESTATE → Tumaco,
  Colombia" as an example anymore** — that pairing was in the original
  plan doc but contradicts the single-estate language removed in §1. Use
  origin-only pairings ("SINGLE ORIGIN → Tumaco, Colombia") if origin
  itself is confirmed (P0.3); otherwise omit that row entirely until it
  is.
- `[OPEN]` **P2.2 Sourcing transparency, only where records exist.**
  Cacao origin / cooperative / harvest / fermentation / drying /
  processing — only populate fields with real records. Do not build a
  fake "traceability dashboard."
- `[OPEN — OWNER]` **P2.3 Credible atelier identity.** = P0.6 above
  (address + mailbox + WhatsApp verification). Listed here too because
  it's also a brand-trust issue, not just a launch checklist item.
- `[OPEN]` **P2.4 Contact trust, tested end-to-end.** Verify mailto,
  WhatsApp, tel, appointment/tasting/product request all clearly
  communicate what happens next (e.g. "Request This Bar → opens email
  with product pre-filled") rather than implying automatic confirmation.
- `[OPEN]` **P2.5 Form strategy.** Static mailto flow can remain for
  launch. Don't build a backend for aesthetics — only add server-side
  forms for a real business requirement (lead capture, CRM, automated
  confirmation).

---

## 5. P3 — SEO

- `[OPEN]` Verify production versions of robots.txt, sitemap.xml, title,
  description, canonical, OG image, Twitter metadata, favicon, Apple
  touch icon, manifest. (Foundational work is done locally — this is a
  production-verification pass, not new implementation.)
- `[OPEN, low priority]` Per-product landing pages
  (`/collection/origin-72` etc.) — only if the business genuinely
  benefits from direct product URLs. Don't generate speculative pages.

---

## 6. P4 — Accessibility

Current reduced-motion architecture is already strong — keep it.
- `[OPEN]` **P4.1 Full keyboard audit** — skip link, nav, audio toggle,
  motion toggle, product switcher, request CTA, modal, close control.
- `[OPEN]` **P4.2 Focus management** — mobile menu and Chocolate Room
  modal: focus enters on open, returns to trigger on close, no invisible
  focus, no keyboard traps.
- `[OPEN]` **P4.3 ARIA correctness audit** — `aria-label`,
  `aria-expanded`, `aria-controls`, `aria-current`, `aria-selected`,
  `aria-pressed`, `role="tab"`, `role="dialog"`, `role="img"`. Incorrect
  ARIA is worse than missing ARIA — don't add attributes just to increase
  count.
- `[OPEN]` **P4.4 Motion toggle UX** — confirm Motion On/Off has an
  obvious, understandable effect on the cinematic experience specifically
  (not general OS accessibility settings).

---

## 7. P5 — Performance hardening

- `[DONE — preserve]` 192 desktop / 64 mobile WebP frames, progressive
  loading, bounded concurrency, immutable caching. Don't regress this.
- `[OPEN]` **P5.2 Evaluate mobile frame count.** Currently every 3rd frame
  (64 total). Test 80/96 frames only if perceptual smoothness genuinely
  improves — never by guesswork, and weigh against payload increase.
- `[OPEN]` **P5.3 Font performance.** Web-font first paint is a remaining
  contributor to mobile LCP (Cormorant Garamond, Inter). Subset fonts,
  reduce weights, preload only the critical face, set appropriate
  `font-display`, drop unused italic/weight combos. Don't replace the
  typography with system fonts just to game Lighthouse. **Also note:**
  this session's environment couldn't build at all without Google Fonts
  network access — worth considering self-hosting fonts
  (`next/font/local`) partly for resilience in CI/sandboxed builds, not
  just performance.
- `[OPEN]` **P5.4 3D failure-mode verification.** Confirm the fallback
  (static reserve bar visual + product info + Request This Bar CTA)
  actually covers WebGL-unavailable, context-lost, model-load-failure,
  network-failure, and low-capability-device cases. The product must
  never become inaccessible because WebGL fails.
- `[OPEN]` **P5.5 Particle budget.** Reduce/disable ambient particles on
  weak devices — never sacrifice responsiveness for decoration.

---

## 8. P6 — Codebase maintainability (lower priority than launch blockers)

- `[OPEN]` **P6.1 Split `page.tsx` further only when it improves
  maintainability** — not for its own sake. Acts are already decomposed
  into `src/components/noire/acts/`.
- `[PARTIALLY DONE]` **P6.2 Centralize all product truth in
  `products.ts`.** Conche duration is already centralized via
  `CONC_PROCESS` (P6.3 in the old doc — done). Audit `page.tsx`,
  `ProductStage.tsx`, `ProductSwitcher.tsx`, `TastingNotes.tsx`, footer,
  and SEO metadata for any other hard-coded product values that should
  pull from `products.ts` instead.
- `[OPEN]` **P6.4 Environment/config cleanup.** Search for
  `TODO`/`FIXME`/`placeholder`/`localhost`/`example.com`/`test@test`/
  `console.log`/`debug` and review each occurrence. (A repo-wide grep this
  session found none of these outside the already-known phone-number
  placeholder — re-run periodically as the codebase changes.)

---

## 9. P7 — Analytics

- `[DONE]` Event layer exists: `navigation_click`,
  `request_tasting_click`, `request_bar_click`, `product_selected`,
  `chocolate_room_open`, `contact_click`, `whatsapp_click`,
  `phone_click`, recorded into `window.__NOIRE_EVENTS__`/`noire:track`.
- `[OPEN]` **P7.1 Conversion funnel** — measure Visit → Collection reached
  → Product selected → Request This Bar → Tasting request → Contact
  action, once a real analytics vendor is wired to the existing event
  layer. Goal: understand whether the luxury experience generates real
  intent, not to build an e-commerce-style funnel.

---

## 10. P8 — Mobile visual QA

- `[OPEN]` Visual (not just DOM) check of Hero, Act II–VI, Collection,
  Epilogue, Footer at 375/390/414/768/1024/1440px. Look for text
  clipping, canvas crop issues, unexpected empty space, overlapping
  labels, poor vertical rhythm, CTA displacement, modal overflow, footer
  density, product-selector overflow.

---

## 11. P9 — Content QA

- `[PARTIALLY DONE]` Full customer-facing text pass for spelling,
  grammar, punctuation, capitalization, ingredient/allergen wording,
  origin/geographic names, process durations, percentages, weights,
  harvest labels, CTA wording, one consistent vocabulary (cacao vs.
  cocoa — already resolved). This session's copy pass (§1) covered the
  unverified-claim angle; a separate plain-grammar/spelling pass is still
  worth doing since it's a different lens.

---

## 12. P10 — Final UX review (no source-code context)

Do this as a fresh visitor, not a developer:
```text
Within 5s   — Can I tell what NOIRÉ is?
Within 15s  — Can I tell why it's different?
Within 30s  — Can I find the collection?
Within 60s  — Can I understand one product?
Within 90s  — Can I request it?
At the end  — Do I understand where the atelier is and how to contact it?
```
If any answer is "no," that's the UX to fix next — this review should be
redone after any P1 changes land.

---

## 13. Do not do these things

```text
[ ] rebuild the site from scratch
[ ] replace the cinematic experience with a normal e-commerce grid
[ ] reintroduce cart functionality
[ ] create a fake checkout
[ ] add unnecessary dependencies
[ ] add generic SaaS UI / excessive rounded cards / random gradients
[ ] add excessive animations
[ ] invent product facts, awards, reviews, certifications, or sourcing claims
[ ] fabricate customer testimonials
[ ] claim production performance without production testing
[ ] remove reduced-motion support or the 3D fallback
[ ] soften or resolve allergen claims without real facility evidence
[ ] let CONTENT_FACT_CHECK.md go stale again — update it the same session
    you touch a claim it tracks
```

---

## 14. Agent execution rules

For every task: inspect existing implementation → identify the smallest
correct change → modify code → typecheck/build → lint → run relevant
automated tests → inspect browser behavior → review `git diff` → confirm
nothing else regressed → record the result. Don't make ten unrelated
changes and test once. Check `git diff package-lock.json` before
committing anything — sandboxed `npm install` runs can introduce unrelated
lockfile churn (seen this session; reverted).

---

## 15. Definition of done

### Brand
```text
[x] Luxury editorial identity preserved
[x] Cinematic experience preserved
[x] Brand voice consistent
[x] No generic UI introduced
```
### Content
```text
[x] No known factual contradictions (Single-Terroir + conche fixed)
[ ] No placeholder business information (phone number still placeholder)
[x] No copy errors ("trace traces" fixed)
[ ] Product data fully matches visible marketing copy (pending owner
    evidence on allergens/sourcing/IGP, §2)
```
### Product
```text
[x] Four products work, switching works
[x] Product information is clear
[x] Request This Bar / Request a Tasting work
```
### Accessibility
```text
[x] Keyboard navigation implemented
[x] Focus management implemented
[x] Reduced motion implemented
[ ] Full keyboard/focus/ARIA audit run end-to-end (§6) — implemented but
    not freshly re-audited this session
```
### Performance
```text
[x] Local Lighthouse tested (90–95 mobile, 100 desktop)
[ ] Production Lighthouse tested
[ ] Real iPhone tested
[ ] Real Android tested
[x] 3D deferred, frames progressively loaded
[ ] WebGL fallback freshly re-verified
```
### Engineering
```text
[x] tsc --noEmit passes
[x] lint passes (no new warnings)
[ ] npm run build passes (blocked on font-fetch network access this
    session — run before deploy)
[ ] browser regression suite re-run against current HEAD
[x] no obsolete cart tests remain
[ ] no placeholder data (phone number)
```

---

## 16. Required final agent report

At completion of any future pass, output:
```text
NOIRÉ PRODUCTION QA

STATUS: READY / NOT READY

P0 COMPLETED: ...
P0 REMAINING: ...
P1 COMPLETED: ...

TESTS:
- Build:
- Lint:
- Browser:
- Accessibility:
- Reduced Motion:

PRODUCTION PERFORMANCE:
- Mobile Lighthouse / Desktop Lighthouse:
- Mobile LCP/INP/CLS / Desktop LCP/INP/CLS:

REAL DEVICE:
- iPhone / Android / Slow 4G:

CONTENT:
- Claims verified:
- Contradictions fixed:
- Placeholder data removed:

KNOWN ISSUES: ...

FINAL DECISION: READY / NOT READY
```

---

## 17. Final product principle

> **A real luxury chocolate house that happens to have a cinematic
> website — not a cinematic website pretending to be a chocolate house.**

Every remaining decision, especially anything touching claims,
certifications, or sourcing language, should be checked against this
before it ships.

---

## 18. Appendix — Full content fact-check ledger

This is the complete, current content of `CONTENT_FACT_CHECK.md`, folded
in here so this plan is self-contained. **`CONTENT_FACT_CHECK.md` in the
repo remains the source of truth going forward** — update it directly when
a claim's status changes, and re-sync this appendix at the same time so
the two never drift apart the way rows 13–14 did before this session.

> Audit date: 2026-09-06 · Repository: `sinzo8771-prog/NOIRE`
> Purpose: track every factual/process/sourcing claim on the site.
> Nothing in this ledger invents evidence.

**Status legend**

| Status | Meaning |
|---|---|
| `VERIFIED` | Backed by owner-supplied records/receipts/photos |
| `REWRITTEN` | Was absolute/unverifiable; copy already softened (safe as-is) |
| `RESOLVED` | An internal conflict was reconciled per an owner ruling |
| `UNVERIFIED — OWNER ACTION` | Requires business evidence before launch |

**Claims inventory**

| # | Claim | Location (file:section) | Evidence needed | Status | Required action |
|---|---|---|---|---|---|
| 1 | Cacao origin — Tumaco, Colombia (ORIGIN 72) | `src/data/products.ts`, `page.tsx` Act II | Proof of sourcing from Tumaco (purchase/receipt/estate agreement) | UNVERIFIED — OWNER ACTION | Provide source, or rewrite as brand language |
| 2 | Cacao origin — Esmeraldas, Ecuador (DARK SEA SALT) | `src/data/products.ts` | Sourcing proof from Esmeraldas | UNVERIFIED — OWNER ACTION | Provide source or rewrite |
| 3 | Cacao origin — Sambirano Valley, Madagascar (MADAGASCAR MILK) | `src/data/products.ts` | Sourcing proof from Sambirano | UNVERIFIED — OWNER ACTION | Provide source or rewrite |
| 4 | Cacao origin — Chanchamayo, Peru (ROASTED HAZELNUT) | `src/data/products.ts` | Sourcing proof from Chanchamayo | UNVERIFIED — OWNER ACTION | Provide source or rewrite |
| 5 | Alta Langa IGP hazelnuts | `src/data/products.ts` | Product/COC documentation for IGP claim | UNVERIFIED — OWNER ACTION | IGP is a protected term; evidence or qualify wording |
| 6 | "Single-estate" sourcing language | `Act01Craving.tsx`, `Act08Savor.tsx`, `ChocolateRoomModal.tsx`, footer, `products.ts` harvest fields | Estate agreements per lot | REWRITTEN | 2026-09-06 copy pass — "single-estate" phrasing removed from hero line, savor CTA, Chocolate Room flight description, footer paragraph, and two harvest fields (kept "Pure Single Origin" subtitle, which matches the displayed per-SKU country origin and makes no single-farm claim) |
| 7 | "Heirloom Theobroma cacao" | Act II, `products.ts` description/ingredients, `ChocolateRoomModal.tsx` flight name | Genetic/varietal documentation | REWRITTEN | 2026-09-06 copy pass — "heirloom" dropped from Act II copy, DARK SEA SALT description, its ingredient label (now "Arriba Nacional cacao" / "Ecuadorian Arriba Nacional Cacao"), and the "Heirloom & Salt Exploration" flight (now "Wild Cacao & Salt Exploration") |
| 8 | Harvest labels (Winter 2025 Micro-Lot etc.) | `src/data/products.ts` harvest field, all 4 SKUs | Harvest records per lot | REWRITTEN | 2026-09-06 copy pass — dropped the specific year ("Winter 2025" → "Winter Micro-Lot") and the "Single Estate"/"Estate" qualifiers ("Single Estate Spring Harvest" → "Spring Harvest Reserve"; "Estate Fermented Reserve" → "Fermented Reserve"). "Late Autumn Harvest" left as-is (no specific/verifiable claim) |
| 9 | Direct-trade partnership copy (footer) | `NoireFooter.tsx` `#direct-trade` | Partner contracts | UNVERIFIED — OWNER ACTION | Origin/partnership claim itself untouched (still needs evidence or owner sign-off) — only the contract-terms specifics below (#10–#12) were softened out of the same paragraph |
| 10 | Multi-year fixed-price contracts | `NoireFooter.tsx` | Signed agreements | REWRITTEN | 2026-09-06 copy pass — removed; replaced with "prioritizing long-term relationships over commodity-market sourcing" |
| 11 | "Growers paid well above commodity market rate" | `NoireFooter.tsx` | Payment records | REWRITTEN | 2026-09-06 copy pass — removed, no replacement pay claim added |
| 12 | "Every harvest lot traceable to a single estate and fermentation batch" | `NoireFooter.tsx` | Lot traceability ledger | REWRITTEN | 2026-09-06 copy pass — removed; second footer paragraph already covers this ("concierge will share the harvest and fermentation records for any lot on request") |
| 13 | 72-hour headline conche ("72-Hour Granite Conche", "three days and nights", "72 hours uninterrupted") | Act III, footer nav, Chocolate Room flight | Owner's production model | RESOLVED | Owner ruling 2026-09-06: 72 hours wins. Centralized in `CONC_PROCESS` (`src/data/products.ts`); ORIGIN 72's `roastProfile` now reads "Low-temperature 72-hour conche" — no remaining discrepancy |
| 14 | ORIGIN 72 "Low-temperature 48h conche" | `src/data/products.ts` | Owner's production model | RESOLVED | Same ruling as #13 — value corrected to 72h, now derived from `CONC_PROCESS` rather than hard-coded separately |
| 15 | "Slow roasting" / "gentle convective air" | Act III process strip | Roasting spec | UNVERIFIED — OWNER ACTION | Confirm or adjust strip |
| 16 | "Banana leaf wrap" fermentation | Act III process strip | Fermentation process docs | UNVERIFIED — OWNER ACTION | Confirm or adjust strip |
| 17 | "Teak drying beds" / sun drying | Act III process strip | Drying process docs | UNVERIFIED — OWNER ACTION | Confirm or adjust strip |
| 18 | Form V crystal structure claim | Act V | Tempering spec / lab or production notes | VERIFIED (self-evident standard) | Keep (already rewritten to brand language) |
| 19 | "Melts exactly at body temperature" (removed) | ~~Act V~~ | — | REWRITTEN | Done — replaced with "melts slowly and evenly" |
| 20 | "Industrial confection relies on chemical deodorization" (removed) | ~~Act III~~ | — | REWRITTEN | Done — removed universal industry claim |
| 21 | Ingredient lists per SKU | `src/data/products.ts` | Actual wrapper-level ingredient declarations | UNVERIFIED — OWNER ACTION | Match labels to wrappers |
| 22 | "Dedicated tree-nut free atelier" (ORIGIN 72 allergen) | `src/data/products.ts` | Facility allergen audit | UNVERIFIED — OWNER ACTION | Evidence or qualify ("dedicated line") — **highest-priority open item; safety claim, not brand copy** |
| 23 | "May contain traces of dairy from shared artisanal stone mills" | `src/data/products.ts` | Cross-contact risk assessment | UNVERIFIED — OWNER ACTION | Confirm mills are genuinely shared — **highest-priority open item; safety claim, not brand copy** |
| 24 | Zero soy lecithin / zero vanillin / zero filler | Act IV Formula Restraint | Ingredient spec sheets | UNVERIFIED — OWNER ACTION | Evidence or qualify |
| 25 | Atelier address — "18 Ropewalk Lane, Heritage Arts District, Fort, Mumbai 400 001" | `NoireFooter.tsx` | Business registration / lease | UNVERIFIED — OWNER ACTION | Verify real + operational |
| 26 | Concierge email — concierge@noire-chocolate.com | `src/lib/site.ts` | Mailbox ownership | UNVERIFIED — OWNER ACTION | Verify mailbox operational |
| 27 | Phone / WhatsApp number | `src/lib/site.ts` | Real business line | OWNER ACTION (P0.1) | Replace placeholder with real number |
| 28 | "Cacao" (not "cocoa") vocabulary consistent | all product data | Copy QA | VERIFIED | Done — only "Cacao Butter" now used |
| 29 | "trace traces" duplicate wording | `src/data/products.ts` | Copy QA | VERIFIED (fixed) | Done — "May contain traces of dairy" |

**Rules applied**
- Verified → `KEEP`
- True but too absolute → `REWRITE`
- Unverified → `REMOVE` or convert to clearly identified brand language
- Nothing above marks a claim as verified without owner evidence.
