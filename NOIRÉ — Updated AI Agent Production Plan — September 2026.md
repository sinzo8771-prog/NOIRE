# NOIRÉ — Updated AI Agent Production Plan

> **Repository:** `sinzo8771-prog/NOIRE`  
> **Live site:** `https://noireee.vercel.app/`  
> **Audit date:** 2026-09-06  
> **Mission:** Finish NOIRÉ as a credible, production-ready luxury chocolate atelier website without destroying its cinematic character.

---

# 1. IMPORTANT: READ THIS FIRST

The website has already completed a substantial remediation pass.

Do **NOT** redo work that is already complete.

Already implemented:

- Next.js 14 App Router
- static/server-rendered core content
- 192 WebP desktop cinematic frames
- 64-frame mobile sequence
- progressive frame loading
- bounded frame concurrency
- async Three.js/R3F loading
- deferred ambient particles
- reduced-motion branch
- skip-to-content
- accessible canvas labeling
- concierge-only commercial model
- removal of fake cart
- removal of fake checkout
- request-based product CTA
- request-a-tasting CTA
- real allergen section
- real direct-trade section
- robots.txt generation
- sitemap generation
- OG image
- Twitter metadata
- simplified desktop navigation
- production build verification
- major bundle reduction

The repository audit reports approximately:

- Desktop frame payload: **6.51 MB**
- Mobile frame payload: **1.16 MB**
- First Load JS: **128 kB**
- Route JS: **41.1 kB**
- Local post-fix mobile Lighthouse: **90–95**
- Local post-fix desktop Lighthouse: **100**
- Mobile TBT: **110–130 ms**

These optimizations must be preserved. Do not trade them away for visual changes.

---

# 2. CURRENT PRODUCT POSITIONING

NOIRÉ is currently a:

> Cinematic luxury chocolate atelier / showcase experience.

It is **not currently an ecommerce store**.

The site intentionally uses:

- Request This Bar
- Request a Tasting
- Concierge email
- WhatsApp / telephone contact
- Atelier visit inquiry

There must be:

- no fake cart
- no fake checkout
- no fabricated orders
- no invented payment flow
- no fake stock countdown
- no fake scarcity
- no fake pricing

Do not reintroduce conventional ecommerce UI unless the business model explicitly changes.

---

# 3. CURRENT STATE — WHAT IS ALREADY GOOD

## 3.1 Visual identity

Preserve:

- dark cacao background
- ivory typography
- copper accents
- serif editorial typography
- minimal UI
- cinematic storytelling
- asymmetrical compositions
- quiet luxury tone
- restrained borders
- tactile language
- eight-act narrative

Do not replace this with generic modern ecommerce styling.

---

## 3.2 Navigation

Desktop navigation has already been reduced from the original eight-act navigation to:

- Origin
- Craft
- Sensory
- Collection
- Request a Tasting

This is an improvement and should be preserved.

Do not spend a major implementation phase redesigning desktop navigation again.

The remaining work is primarily:

- mobile polish
- focus behavior
- active-state clarity
- CTA hierarchy
- route/deep-link discoverability

---

## 3.3 Commercial CTA

A prominent "Request a Tasting" CTA already exists in the desktop navigation.

Product detail already has:

> Request This Bar

Therefore the earlier recommendation to "add a primary CTA" is substantially complete.

Do not add several competing sticky CTAs.

The remaining task is to make the existing CTA system more robust and measurable.

---

# 4. P0 — LAUNCH BLOCKERS

These must be completed before calling the website production-ready.

---

## P0.1 Replace placeholder phone / WhatsApp number

Current placeholder:

```text
+91 98200 00000
```

It is still present in:

```text
src/lib/site.ts
```

and is exposed through:

- telephone link
- WhatsApp link
- footer

Replace it with the real business number.

### Requirements

Update:

```text
ATELIER_PHONE_DISPLAY
ATELIER_PHONE_E164
```

Verify:

- tel: link
- WhatsApp URL
- visible footer number
- any structured metadata using the number

### Acceptance criteria

```text
[ ] No placeholder number exists anywhere in repository
[ ] tel: opens correct number
[ ] WhatsApp opens correct number
[ ] display formatting is correct
[ ] E.164 formatting is correct
```

Do not invent a number.

---

# 5. P0.2 Fix allergen copy

Current text contains:

```text
May contain trace traces of dairy...
```

Correct to:

```text
May contain traces of dairy...
```

Then search the complete repository for:

```text
trace traces
```

and similar accidental duplicate wording.

### Acceptance criteria

```text
[ ] No "trace traces" remains
[ ] Footer allergen content is grammatically correct
[ ] Product data and displayed text match
```

---

# 6. P0.3 Resolve the 72-hour / 48-hour process discrepancy

The homepage currently says:

```text
The 72-Hour Granite Conche.
```

and:

```text
72 hours uninterrupted
```

while the ORIGIN 72 product data says:

```text
Low-temperature 48h conche
```

This is visible to customers and creates an apparent contradiction.

Do not simply change one number.

Determine the actual intended production model first.

### Possible legitimate explanation

The business might have:

```text
72-hour overall stone-conche process
```

and:

```text
48-hour low-temperature conche stage
```

But this is only valid if factually true.

### Required implementation

Create one source of truth.

Example:

```ts
type ProcessSpecification = {
  headline: string
  totalDuration?: string
  concheDuration?: string
  method: string
}
```

Then derive displayed copy from the same data.

### Acceptance criteria

```text
[ ] Homepage process claim is accurate
[ ] Product process claim is accurate
[ ] Product data and marketing copy cannot contradict each other
[ ] No duplicated hard-coded process duration exists unnecessarily
```

---

# 7. P0.4 Fact-check all business and product claims

This is one of the most important remaining tasks.

The website makes strong factual claims involving:

- cacao origins
- single-estate sourcing
- heirloom cacao
- Tumaco
- Esmeraldas
- Sambirano
- harvest periods
- direct trade
- multi-year fixed-price contracts
- farmer compensation
- traceability
- conching duration
- fermentation
- roasting
- body-temperature melting
- chemical deodorization
- ingredients
- allergen handling
- dedicated facilities
- IGP / origin terminology

Do not blindly preserve these because they sound luxurious.

Create:

```text
CONTENT_FACT_CHECK.md
```

with:

| Claim | File / Section | Evidence | Status | Required Action |
|---|---|---|---|---|
| Claim | Location | Source | Verified / Unverified | Keep / Rewrite / Remove |

### Rules

If verified:

```text
KEEP
```

If true but wording is too absolute:

```text
REWRITE
```

If unverified:

```text
REMOVE or convert to clearly identified brand language
```

Never invent documentation.

---

# 8. P0.5 Replace unsupported scientific absolutes

Review claims such as:

```text
melts at exactly body temperature
```

and:

```text
Industrial confection relies on chemical deodorization and high heat.
```

and other absolute scientific/process statements.

The goal is not to make the copy boring.

The goal is to avoid presenting artistic or generalized statements as universal scientific facts.

### Preferred style

Instead of an absolute unsupported statement:

```text
X always does exactly Y.
```

prefer:

```text
Our tempering produces a crisp Form V structure associated with a clean snap and controlled melt.
```

Only use exact scientific numbers when properly supported.

---

# 9. P0.6 Fix outdated browser regression suite

The existing:

```text
scripts/test-browser.js
```

still contains tests for:

- Add to Bag
- Shopping Bag
- quantity controls
- Proceed to Checkout
- checkout modal

Those features have been removed from the current product. The script is now testing dead behavior.

Do not simply make the old test "pass."

Rewrite it around the actual application.

---

# 10. New Browser Regression Test Suite

Replace old cart tests with the current experience.

## Test 1 — Page boot

Verify:

```text
[ ] page loads
[ ] title exists
[ ] no uncaught page errors
[ ] no console errors
```

---

## Test 2 — Eight acts

Verify:

```text
#act-1
#act-2
#act-3
#act-4
#act-5
#act-6
#act-7
#act-8
```

all exist.

---

## Test 3 — Desktop navigation

Verify:

```text
Origin
Craft
Sensory
Collection
```

each moves to the correct section.

Verify:

```text
Request a Tasting
```

points to the correct concierge action.

---

## Test 4 — Product switcher

Verify all four products:

```text
ORIGIN 72
DARK SEA SALT
ROASTED HAZELNUT
MADAGASCAR MILK
```

can be selected.

For each product verify:

```text
[ ] name changes
[ ] subtitle changes
[ ] description changes
[ ] cacao percentage changes
[ ] tasting notes change
[ ] origin changes
[ ] ingredients change
[ ] allergen information changes
[ ] CTA updates
```

---

## Test 5 — Concierge CTA

Verify:

```text
Request This Bar
```

contains:

- selected product
- cacao percentage
- origin
- availability inquiry
- tasting/date inquiry

Verify:

```text
Request a Tasting
```

opens the correct concierge destination.

---

## Test 6 — Chocolate Room

Verify:

```text
Enter the Chocolate Room
```

opens the intended modal.

Verify:

```text
[ ] modal opens
[ ] focus moves appropriately
[ ] Escape closes
[ ] close button works
[ ] no page scroll trap
```

---

## Test 7 — Mobile

Test at minimum:

```text
375 × 812
390 × 844
```

Verify:

```text
[ ] no horizontal overflow
[ ] menu opens
[ ] menu closes
[ ] menu item navigates
[ ] primary CTA remains reachable
[ ] product selector is usable
[ ] product detail does not clip
[ ] modal fits viewport
```

---

## Test 8 — Reduced motion

With:

```text
prefers-reduced-motion: reduce
```

verify:

```text
[ ] Lenis disabled
[ ] cinematic scrubbing disabled
[ ] particles disabled
[ ] CSS motion disabled
[ ] first/static frame remains understandable
[ ] page remains navigable
[ ] content remains readable
```

---

# 11. P0.7 Production deployment verification

The current audit proves local post-fix performance, but it does not establish a new production Lighthouse baseline after deployment.

After the latest code is deployed:

Run:

```text
Production Lighthouse Mobile
Production Lighthouse Desktop
```

Record:

```text
Performance
Accessibility
Best Practices
SEO
LCP
INP
CLS
TBT
TTFB
Speed Index
```

Store the results in:

```text
PRODUCTION_QA.md
```

---

# 12. P0.8 Real-device performance test

This is mandatory.

Test on real devices, not only headless Chrome.

At minimum:

```text
iPhone Safari
Android Chrome
mid-range Android
```

Network conditions:

```text
4G
slow 4G
```

Check:

- initial render
- first-frame appearance
- scrolling
- frame streaming
- memory usage
- heat/battery behavior
- 3D loading
- interaction responsiveness

Do not claim "mobile optimized" from Lighthouse alone.

---

# 13. P1 — PRODUCT UX IMPROVEMENT

After all P0 items are solved.

---

# 14. P1.1 Make product discovery faster

The cinematic story is intentionally long.

That is good for:

> discovery visitors

but less good for:

> visitors who already know they want a product.

The Collection must remain easy to reach.

### Add a subtle path such as:

```text
Explore Collection
```

without adding a large ecommerce-style component.

Possible locations:

- hero secondary action
- navigation
- Act IV transition
- Act VI transition

Do not place five CTAs on screen.

---

# 15. P1.2 Preserve the cinematic homepage

Do not remove the long-form experience.

The homepage remains the emotional/brand experience.

The improvement should be:

```text
cinematic story
+
fast escape path to collection
```

not:

```text
cinematic story
→ replaced by product grid
```

---

# 16. P1.3 Improve product information hierarchy

The current ProductStage already exposes substantial information.

Keep the current data richness.

Ensure the visual hierarchy is:

```text
PRODUCT NAME
↓
ONE-LINE PROPOSITION
↓
SHORT DESCRIPTION
↓
TASTING NOTES
↓
PALATE METRICS
↓
ORIGIN / PROCESS
↓
WEIGHT
↓
REQUEST CTA
```

Do not bury practical information below decorative storytelling.

---

# 17. P1.4 Add process transparency without overloading the page

Instead of adding more paragraphs, create a compact evidence system.

Example:

```text
ORIGIN
Tumaco, Colombia

HARVEST
Winter 2025 Micro-Lot

PROCESS
Stone conche · X hours

WEIGHT
80g
```

This lets luxury storytelling coexist with factual clarity.

---

# 18. P1.5 Improve mobile menu accessibility

The mobile menu currently exposes five navigation items:

```text
The Craving
Origin & Cacao
Transformation
Sensory Notes
Reserve Collection
```

This is acceptable, but verify:

```text
[ ] focus trap
[ ] focus return to menu button
[ ] Escape closes
[ ] menu button aria-expanded
[ ] menu button aria-controls
[ ] scrolling prevented while menu open
[ ] navigation closes automatically after selection
```

Do not increase the number of mobile menu items.

---

# 19. P1.6 Improve CTA semantics

Use one globally recognized action hierarchy.

Recommended:

### Primary

```text
Request This Bar
```

### Secondary

```text
Request a Tasting
```

or reverse these depending on business priority.

The wording must stay consistent.

Do not alternate among:

```text
Inquire
Request
Discover
Reserve
Explore
Enter
Book
```

unless each represents a genuinely different action.

---

# 20. P1.7 Fix mobile text density

Audit every:

- paragraph
- metadata label
- tasting note
- product metric
- footer declaration

for mobile readability.

Do not solve density by simply making everything smaller.

Prefer:

- fewer words
- better line breaks
- stronger hierarchy
- spacing
- collapsible details where justified

---

# 21. P1.8 Audit visual hierarchy of Act VI

Current sensory progression uses four boxed blocks:

```text
BITTER.
WARM.
DEEP.
GONE.
```

This works, but it is one of the more conventional UI moments in an otherwise editorial experience.

Consider making this section feel more tactile and less "card grid."

Possible direction:

```text
BITTER
      WARM
            DEEP
                  GONE
```

or sequential typography with restrained separators.

Do not add more cards.

---

# 22. P1.9 Audit Act VII product selection

Product switching is currently functional.

Improve only where it helps comprehension.

The product selector should clearly communicate:

```text
selected
hover
focus
current product
```

It must also remain easy to operate on touchscreens.

Avoid tiny desktop-only tabs.

---

# 23. P2 — TRUST AND BRAND CREDIBILITY

---

# 24. P2.1 Convert poetic claims into evidence-backed luxury

The brand language is strong.

Do not remove it.

Instead pair it with evidence.

Example:

```text
UNHURRIED
72 hours

SINGLE ESTATE
Tumaco, Colombia

HAND-TEMPERED
Form V crystal structure

SMALL BATCH
80g bar
```

Only use metrics that are real.

---

# 25. P2.2 Improve sourcing transparency

The footer currently contains direct-trade language and sourcing claims.

Keep the concept, but make the information easier to trust.

Consider:

```text
Cacao origin
Estate / cooperative
Harvest
Fermentation
Drying
Processing
```

Only where actual records exist.

Do not build a fake "traceability dashboard."

---

# 26. P2.3 Create a credible atelier identity

The site currently says:

```text
18 Ropewalk Lane, Heritage Arts District
Fort, Mumbai 400 001
```

Before launch, verify that the address is real and represents the intended business location.

Likewise verify:

```text
concierge@noire-chocolate.com
```

and the WhatsApp number.

Do not publish fictional business infrastructure as though it were operational.

---

# 27. P2.4 Contact trust

The concierge path should be tested end-to-end.

Verify:

```text
mailto
WhatsApp
tel
appointment request
tasting request
product request
```

The user must clearly understand what happens after clicking.

Example:

```text
Request This Bar
→ opens email with selected product pre-filled
```

This is preferable to pretending the request has been automatically confirmed.

---

# 28. P2.5 Form strategy

Current static mailto flow can remain for the immediate launch.

Do not build a backend just for aesthetics.

Only introduce server-side forms when there is a real business requirement such as:

- lead capture
- CRM integration
- appointment management
- automated confirmation

---

# 29. P3 — SEO

Most foundational SEO work is already implemented.

Do not repeat it unnecessarily.

Verify production versions of:

```text
robots.txt
sitemap.xml
title
description
canonical
OG image
Twitter metadata
```

Also verify:

```text
favicon
Apple touch icon
manifest where appropriate
```

---

# 30. P3.1 Add stronger entity/product SEO only where justified

The current site is primarily a brand experience.

Do not generate dozens of fake product URLs.

Potential future structure:

```text
/collection/origin-72
/collection/dark-sea-salt
/collection/roasted-hazelnut
/collection/madagascar-milk
```

Only implement if the business genuinely benefits from direct product landing pages.

---

# 31. P4 — ACCESSIBILITY

The current reduced-motion architecture is already a strong implementation.

Keep it.

---

# 32. P4.1 Keyboard audit

Test the entire site using keyboard only.

Verify:

```text
Tab
Shift+Tab
Enter
Space
Escape
Arrow keys where applicable
```

Check:

- skip link
- navigation
- audio toggle
- motion toggle
- product switcher
- request CTA
- modal
- close control

---

# 33. P4.2 Focus management

Especially verify:

```text
mobile menu
Chocolate Room modal
```

Expected behavior:

```text
open
→ focus enters component

close
→ focus returns to triggering element
```

No invisible focus.

No keyboard traps.

---

# 34. P4.3 ARIA correctness

Audit:

```text
aria-label
aria-expanded
aria-controls
aria-current
aria-selected
aria-pressed
role="tab"
role="dialog"
role="img"
```

Do not add ARIA attributes just to increase the count.

Incorrect ARIA is worse than missing ARIA.

---

# 35. P4.4 Motion toggle UX

The existing motion toggle is a good feature.

Verify that:

```text
Motion On
Motion Off
```

has an obvious effect.

The user should understand that it changes the cinematic experience, not general accessibility settings.

---

# 36. P5 — PERFORMANCE HARDENING

---

# 37. P5.1 Keep the current frame architecture

Do not regress:

```text
192 desktop WebP
64 mobile WebP
progressive loading
bounded concurrency
immutable caching
```

---

# 38. P5.2 Evaluate the mobile frame strategy

The mobile set currently uses every third frame.

Validate visually whether:

```text
64 frames
```

creates sufficiently smooth scrubbing.

If not, test:

```text
80 frames
96 frames
```

but only if the perceptual improvement justifies the payload increase.

Never optimize the frame count by guesswork alone.

---

# 39. P5.3 Font performance

The audit identified web-font first paint as a remaining contributor to mobile LCP.

Investigate:

```text
Cormorant Garamond
Inter
```

without damaging the brand.

Possible approaches:

- subset fonts
- reduce weights
- preload only the truly critical face
- use appropriate `font-display`
- remove unused italic/weight combinations
- reduce font payload

Do not replace the typography with system fonts merely to improve Lighthouse.

---

# 40. P5.4 3D failure mode

The 3D viewer is dynamically loaded near Act VII.

Preserve this.

Add/verify a robust fallback for:

```text
WebGL unavailable
WebGL context lost
model loading failure
network failure
very low capability device
```

Fallback:

```text
static reserve bar visual
+
product information
+
Request This Bar
```

The product must never become inaccessible because WebGL fails.

---

# 41. P5.5 Particle budget

Ambient particles are optional decoration.

On weak devices:

```text
reduce
```

or:

```text
disable
```

Do not sacrifice responsiveness for particles.

---

# 42. P6 — CODEBASE MAINTAINABILITY

This is lower priority than launch blockers.

---

# 43. P6.1 Split the main page when justified

`src/app/page.tsx` is currently large.

Do not split it simply because "large files are bad."

Split when it improves maintainability.

Suggested structure:

```text
src/components/noire/acts/
  Act01Craving.tsx
  Act02Origin.tsx
  Act03Transformation.tsx
  Act04Reveal.tsx
  Act05Break.tsx
  Act06Sensory.tsx
  Act07Collection.tsx
  Act08Savor.tsx
```

Keep page-level orchestration in:

```text
page.tsx
```

---

# 44. P6.2 Centralize all product truth

All product data must come from:

```text
src/data/products.ts
```

Avoid hard-coded product values in:

```text
page.tsx
ProductStage.tsx
ProductSwitcher.tsx
TastingNotes.tsx
footer
SEO
```

Especially centralize:

- name
- cacao %
- origin
- harvest
- weight
- ingredients
- allergens
- process
- tasting notes

---

# 45. P6.3 Remove repeated factual strings

The same fact must not exist independently in multiple components.

Bad:

```text
72-hour conche
```

in five files.

Good:

```text
PRODUCT_PROCESS.totalHours
```

or an equivalent authoritative data model.

---

# 46. P6.4 Environment / configuration cleanup

Before launch search for:

```text
TODO
FIXME
placeholder
localhost
example.com
test@test
console.log
debug
```

Review every occurrence.

Some TODOs may be legitimate developer notes; others are launch blockers.

---

# 47. P7 — ANALYTICS

Only add analytics that answers business questions.

Recommended events:

```text
navigation_click
request_tasting_click
request_bar_click
product_selected
chocolate_room_open
contact_click
whatsapp_click
phone_click
```

Avoid tracking every:

```text
scroll frame
particle
mouse movement
animation tick
```

---

# 48. P7.1 Conversion funnel

Measure:

```text
Visit
↓
Collection reached
↓
Product selected
↓
Request This Bar
↓
Tasting request
↓
Contact action
```

The goal is not to make NOIRÉ feel like an ecommerce funnel.

The goal is to understand whether the luxury experience is actually generating intent.

---

# 49. P8 — MOBILE VISUAL QA

This should be performed visually, not only through DOM tests.

Check:

```text
Hero
Act II
Act III
Act IV
Act V
Act VI
Collection
Epilogue
Footer
```

At:

```text
375px
390px
414px
768px
1024px
1440px
```

Look for:

- text clipping
- canvas crop problems
- unexpected empty space
- overlapping labels
- poor vertical rhythm
- CTA displacement
- modal overflow
- footer density
- product selector overflow

---

# 50. P9 — CONTENT QA

Perform a complete customer-facing text pass.

Check:

```text
spelling
grammar
punctuation
capitalization
ingredient wording
allergen wording
origin names
geographic names
process durations
product percentages
weights
harvest labels
CTA wording
```

Use one authoritative vocabulary.

For example:

Do not alternate unnecessarily between:

```text
cacao
cocoa
bean
nib
```

unless the distinction is intentional.

---

# 51. P10 — FINAL USER EXPERIENCE REVIEW

Do one review with no source-code context.

Pretend you are a new visitor.

Ask:

### Within 5 seconds:

Can I tell what NOIRÉ is?

### Within 15 seconds:

Can I tell why it is different?

### Within 30 seconds:

Can I find the collection?

### Within 60 seconds:

Can I understand one product?

### Within 90 seconds:

Can I request it?

### At the end:

Do I understand where the atelier is and how to contact it?

If any answer is "no", improve the UX.

---

# 52. FINAL PRIORITY ORDER

## P0 — MUST COMPLETE

```text
1. Replace placeholder phone number
2. Fix "trace traces"
3. Resolve 72h vs 48h process wording
4. Fact-check all factual claims
5. Rewrite unsupported absolute/scientific claims
6. Replace obsolete cart regression tests
7. Deploy latest code
8. Run production Lighthouse
9. Run real-device mobile test
10. Verify production contact links
```

---

## P1 — HIGH VALUE

```text
11. Make Collection reachable slightly earlier
12. Improve mobile menu accessibility
13. Refine product information hierarchy
14. Improve mobile text density
15. Strengthen Act VI visual treatment
16. Improve product selector states
17. Validate 3D/WebGL fallback
18. Improve CTA consistency
```

---

## P2 — TRUST / BRAND

```text
19. Verify atelier address
20. Verify concierge email
21. Verify sourcing/direct-trade claims
22. Strengthen evidence-based craftsmanship storytelling
23. Improve sourcing transparency where real records exist
```

---

## P3 — ENGINEERING

```text
24. Production SEO verification
25. Font optimization
26. Mobile frame-density experiment
27. Main page decomposition
28. Product data centralization
29. Repository cleanup
30. Analytics
```

---

# 53. DO NOT DO THESE THINGS

The agent must not:

```text
[ ] rebuild the site from scratch
[ ] replace the cinematic experience with a normal ecommerce grid
[ ] reintroduce cart functionality
[ ] create a fake checkout
[ ] add unnecessary dependencies
[ ] add generic SaaS UI
[ ] add excessive rounded cards
[ ] add random gradients
[ ] add excessive animations
[ ] invent product facts
[ ] invent awards
[ ] invent reviews
[ ] invent certifications
[ ] invent sourcing claims
[ ] fabricate customer testimonials
[ ] claim production performance without production testing
[ ] remove reduced-motion support
[ ] remove the 3D fallback
```

---

# 54. AGENT EXECUTION RULES

For every task:

```text
1. Inspect existing implementation
2. Identify the smallest correct change
3. Modify code
4. Run typecheck/build
5. Run lint
6. Run relevant automated tests
7. Inspect browser behavior
8. Review git diff
9. Confirm no existing feature regressed
10. Record result
```

Do not make ten unrelated changes and test once.

---

# 55. DEFINITION OF DONE

NOIRÉ is considered production-ready only when:

## Brand

```text
[ ] Luxury editorial identity preserved
[ ] Cinematic experience preserved
[ ] Brand voice consistent
[ ] No generic UI introduced
```

## Content

```text
[ ] No factual contradictions
[ ] No placeholder business information
[ ] No copy errors
[ ] Product data matches visible marketing copy
```

## Product

```text
[ ] Four products work
[ ] Product switching works
[ ] Product information is clear
[ ] Request This Bar works
[ ] Request a Tasting works
```

## Accessibility

```text
[ ] Keyboard navigation works
[ ] Focus management works
[ ] Reduced motion works
[ ] Mobile menu works accessibly
[ ] Modal works accessibly
[ ] Contrast remains acceptable
```

## Performance

```text
[ ] Production Lighthouse tested
[ ] Real iPhone tested
[ ] Real Android tested
[ ] No major mobile jank
[ ] 3D deferred
[ ] Frames progressively loaded
[ ] WebGL fallback verified
```

## Engineering

```text
[ ] npm run build passes
[ ] lint passes
[ ] browser regression suite passes
[ ] no obsolete cart tests remain
[ ] no production console errors
[ ] no placeholder data
```

---

# 56. REQUIRED FINAL AGENT REPORT

At completion, the AI agent must output:

```text
NOIRÉ PRODUCTION QA

STATUS:
READY / NOT READY

P0 COMPLETED:
- ...
- ...

P0 REMAINING:
- ...

P1 COMPLETED:
- ...
- ...

TESTS:
- Build:
- Lint:
- Browser:
- Accessibility:
- Reduced Motion:

PRODUCTION PERFORMANCE:
- Mobile Lighthouse:
- Desktop Lighthouse:
- Mobile LCP:
- Mobile INP:
- Mobile CLS:
- Desktop LCP:
- Desktop INP:
- Desktop CLS:

REAL DEVICE:
- iPhone:
- Android:
- Slow 4G:

CONTENT:
- Claims verified:
- Contradictions fixed:
- Placeholder data removed:

KNOWN ISSUES:
- ...

FINAL DECISION:
READY / NOT READY
```

---

# 57. FINAL PRODUCT PRINCIPLE

The agent should optimize NOIRÉ toward:

> **A real luxury chocolate house that happens to have a cinematic website.**

Not:

> **A cinematic website pretending to be a chocolate house.**

That distinction should guide every remaining decision.