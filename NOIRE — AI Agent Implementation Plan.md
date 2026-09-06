# NOIRE — AI Agent Implementation Plan

## 0. Mission

Upgrade the NOIRE website from a highly polished interactive showcase into a production-ready luxury chocolate brand experience.

The agent must preserve the existing visual identity and cinematic storytelling while improving:

- Product clarity
- Conversion
- Navigation
- Trust and credibility
- Accessibility
- Mobile UX
- Performance
- Content consistency
- Automated testing
- Production readiness
- Maintainability

Do **not** redesign the website from scratch.

The goal is:

> **Make NOIRE feel more real, easier to understand, easier to navigate, and easier to act on — without sacrificing its cinematic luxury identity.**

---

# 1. Project Context

## Current strengths

The current implementation already has:

- Strong luxury/editorial art direction
- Cinematic scroll-driven storytelling
- Eight-act narrative structure
- WebP image optimization
- Mobile-specific media optimization
- Deferred loading for Three.js / R3F
- Reduced-motion behavior
- Accessibility considerations
- SEO metadata
- Concierge/request-oriented commercial model
- Clean React/Next.js project structure
- Performance-conscious animation architecture

Preserve these strengths.

## Current weaknesses

The main areas requiring improvement are:

1. Product proposition appears too late.
2. Primary CTA is too subtle.
3. Eight-item navigation can feel cognitively heavy.
4. Product discovery is overly dependent on the cinematic scroll.
5. Some factual claims need verification.
6. Product process data may be inconsistent.
7. There is placeholder contact information.
8. There is a copy typo in product data.
9. Browser regression tests still reference removed cart behavior.
10. Mobile and real-device performance need production validation.
11. Some pages/sections need stronger documentary evidence of craftsmanship.
12. Large orchestration code should eventually be decomposed into smaller components.

---

# 2. Non-Negotiable Design Principles

The agent must follow these principles for every change.

## Preserve

- Existing typography direction
- Dark cacao / ivory / copper visual language
- Editorial luxury aesthetic
- Cinematic pacing
- Existing scroll storytelling
- Existing animation philosophy
- Existing brand voice
- Existing reduced-motion support
- Existing performance optimizations

## Avoid

Do not introduce:

- Generic SaaS UI
- Excessive cards
- Loud gradients
- Heavy glassmorphism
- Excessive rounded containers
- Random UI animations
- Large numbers of badges
- Fake urgency
- Fake scarcity
- Fake reviews
- Fake social proof
- Fake checkout
- Generic ecommerce patterns
- Excessive CTA buttons
- Unnecessary JavaScript
- Unnecessary dependencies

The site should continue to feel:

> quiet, rare, tactile, restrained, editorial, intentional.

---

# 3. Execution Strategy

Work in the following phases:

```text
PHASE 0  → Baseline + audit
PHASE 1  → Production blockers
PHASE 2  → Content + data consistency
PHASE 3  → Navigation + information architecture
PHASE 4  → Conversion / CTA improvements
PHASE 5  → Product discovery
PHASE 6  → Craftsmanship / trust
PHASE 7  → Mobile UX
PHASE 8  → Accessibility
PHASE 9  → Performance
PHASE 10 → Testing
PHASE 11 → Codebase cleanup
PHASE 12 → Final production QA
```

Do not skip verification after each phase.

---

# 4. PHASE 0 — Establish Baseline

## Goal

Understand the current state before making changes.

## Tasks

### 0.1 Run local development build

Verify:

- npm install succeeds
- development server starts
- production build succeeds
- no TypeScript errors
- no lint errors
- no runtime errors

### 0.2 Run existing tests

Record:

- passing tests
- failing tests
- obsolete tests
- missing coverage

### 0.3 Inspect all core files

Review:

```text
src/app
src/components
src/data
src/hooks
src/lib
src/three
scripts
public
```

### 0.4 Create a baseline report

Record:

- Lighthouse mobile
- Lighthouse desktop
- JS payload
- image payload
- number of network requests
- LCP
- CLS
- INP
- TBT
- total transfer size
- accessibility score
- SEO score

Do not optimize based only on localhost results.

---

# 5. PHASE 1 — Fix Production Blockers

Priority: CRITICAL

## 5.1 Replace placeholder contact information

Search the complete repository for:

```text
+91 98200 00000
```

Replace it with the correct production contact information.

Verify all occurrences including:

- tel links
- WhatsApp links
- footer
- contact sections
- metadata
- structured data
- constants
- environment variables

Do not leave placeholder contact information anywhere in production code.

### Acceptance criteria

- No placeholder number remains.
- Telephone links open the correct number.
- WhatsApp links use the correct number.
- Footer displays correct contact information.

---

# 6. PHASE 2 — Content and Data Integrity

Priority: CRITICAL

## 6.1 Fix typo

Find:

```text
May contain trace traces of dairy
```

Replace with:

```text
May contain traces of dairy
```

Search the entire repository for similar duplicated words or obvious copy mistakes.

---

## 6.2 Resolve conche process inconsistency

Current messaging appears to contain:

```text
72-Hour Granite Conche
```

and product information referring to:

```text
48h conche
```

Determine the actual intended process.

Do not arbitrarily change the number.

Create one authoritative source of truth.

Example structure:

```ts
process: {
  totalHours: 72,
  method: "...",
  productSpecificDuration: 48
}
```

Only use this structure if those distinctions are factually true.

### Acceptance criteria

The customer must never encounter apparently contradictory production claims.

---

## 6.3 Audit all factual claims

Review every statement related to:

- cacao origin
- harvest
- fermentation
- drying
- conching
- stone grinding
- temperature
- terroir
- trade relationships
- ingredient sourcing
- production time
- nutritional claims
- melting temperature
- sustainability
- direct trade
- processing methodology

Create a file:

```text
CONTENT_FACT_CHECK.md
```

Use a table:

| Claim | Location | Status | Evidence Required | Action |
|---|---|---|---|---|
| Example claim | file/section | verified/unverified | source | keep/change/remove |

Do not fabricate evidence.

If a claim cannot be substantiated, either:

1. rewrite it as brand language/opinion, or
2. remove it.

---

# 7. PHASE 3 — Navigation Architecture

Priority: HIGH

## Problem

Eight visible navigation destinations are visually elegant but may create unnecessary cognitive load.

Current concept:

```text
01 The Craving
02 Origin
03 Transformation
04 Chocolate
05 Break
06 Sensory
07 Collection
08 Savor
```

## Goal

Preserve the eight-act story while simplifying navigation.

### Recommended navigation model

Use four primary navigation concepts:

```text
Story
Craft
Collection
Atelier
```

Possible mapping:

```text
Story
  → The Craving
  → Chocolate
  → Savor

Craft
  → Origin
  → Transformation
  → Sensory

Collection
  → Collection

Atelier
  → Request / Tasting / Contact
```

Do not force this exact wording if existing brand copy is stronger.

The agent should choose the smallest navigation vocabulary that preserves discoverability.

---

## 7.1 Preserve chapter progress

Even after simplifying the nav, users should retain a visual sense of narrative progress.

Use:

- chapter indicator
- scroll progress
- subtle section state

Avoid adding another large persistent UI element.

---

## 7.2 Mobile navigation

On mobile:

- keep navigation minimal
- prioritize thumb accessibility
- make close/open behavior obvious
- prevent body scroll conflicts
- support Escape where appropriate
- ensure focus management
- ensure menu is accessible to screen readers

---

# 8. PHASE 4 — Improve Conversion

Priority: HIGH

## Current problem

The storytelling is excellent but the commercial intent is too quiet.

The site should still feel premium and restrained, but visitors need a clearer next step.

---

## 8.1 Establish ONE primary CTA

Choose one canonical action.

Recommended candidates:

```text
Explore the Collection
```

or

```text
Request a Tasting
```

or

```text
Request This Bar
```

Select based on the actual business model.

Do not create multiple competing primary CTAs.

---

## 8.2 Persistent desktop CTA

Add a subtle persistent CTA in the navigation.

Requirements:

- visually restrained
- small
- premium
- not sticky-salesy
- clear hover/focus state

Example:

```text
REQUEST
```

or

```text
THE COLLECTION
```

---

## 8.3 Stronger CTA near product reveal

When the user reaches the first meaningful product reveal, give them an actionable option.

Pattern:

```text
The collection
Three bars. Three expressions.

[ Explore the Collection ]
```

Avoid:

```text
BUY NOW
ADD TO CART
SHOP NOW
```

unless actual ecommerce is introduced.

---

# 9. PHASE 5 — Product Discoverability

Priority: HIGH

## Problem

Users currently need to experience a large amount of cinematic storytelling to discover the product.

The website should support both:

```text
Narrative visitor
```

and:

```text
Intent-driven visitor
```

---

## 9.1 Create product-centric access

Ensure the collection can be reached quickly from:

- navigation
- CTA
- direct section jump
- search engines

---

## 9.2 Product information hierarchy

Every product should expose information in this order:

```text
Product name
One-line proposition
Cacao origin
Flavor profile
Ingredients
Weight
Process
Availability/request action
Additional details
```

Do not bury practical product information beneath decorative copy.

---

## 9.3 Dedicated product URLs

Evaluate creating routes such as:

```text
/collection/origin-72
/collection/dark-sea-salt
/collection/[slug]
```

These routes should:

- preserve the NOIRE aesthetic
- be lightweight
- be indexable
- support direct sharing
- allow product-specific metadata

Do not duplicate massive cinematic assets unnecessarily.

---

# 10. PHASE 6 — Increase Craft Credibility

Priority: HIGH

## Goal

Move the visual impression from:

> “beautiful luxury concept”

to:

> “credible luxury chocolate atelier.”

---

## 10.1 Add documentary imagery

Where appropriate, introduce close visual evidence of:

- cacao beans
- hands
- tools
- stone
- roasting
- grinding
- conching
- tempering
- molds
- chocolate texture
- packaging
- atelier environment

Use real imagery where possible.

Do not use generic stock photography.

---

## 10.2 Evidence over adjectives

Prefer:

```text
72 hours
```

paired with:

```text
stone conche
```

and visual proof

over:

```text
exceptionally slow artisanal transformation
```

This does not mean removing poetic language.

The ideal ratio is:

```text
poetry + evidence
```

not:

```text
poetry + more poetry
```

---

# 11. PHASE 7 — Mobile UX

Priority: HIGH

Desktop performance does not guarantee mobile experience quality.

## Test on:

- iPhone Safari
- Android Chrome
- mid-range Android device
- slower mobile network
- touch-only interaction

---

## 11.1 Verify

### Scroll

- no accidental horizontal overflow
- no jitter
- no scroll locking problems
- no scroll hijacking
- no excessive scroll fatigue

### Typography

- no clipping
- no overlap
- no tiny body copy
- acceptable line lengths

### Navigation

- easy to open
- easy to close
- keyboard accessible where applicable
- thumb-friendly

### CTA

- easy to tap
- no accidental activation
- visually obvious

### Canvas

- no excessive battery usage
- no severe frame drops
- no blank canvas states
- sensible fallback

### 3D

- defer loading until meaningful
- no blocking initial render
- fallback if WebGL fails

---

# 12. PHASE 8 — Accessibility

Priority: HIGH

The existing reduced-motion work should be preserved and expanded.

---

## 12.1 Reduced motion

When:

```css
prefers-reduced-motion: reduce
```

the site should:

- disable Lenis/smooth scrolling
- disable cinematic scrubbing where appropriate
- disable particles
- avoid continuous animation
- avoid parallax
- avoid large transition distances

The content must remain fully understandable.

---

## 12.2 Keyboard navigation

Verify:

- visible focus
- logical tab order
- skip link
- menu operation
- CTA operation
- dialogs
- 3D viewer controls
- form controls

No keyboard trap.

---

## 12.3 Screen reader semantics

Verify:

- meaningful heading structure
- correct landmark regions
- buttons are buttons
- links are links
- decorative canvas is not incorrectly announced
- images have appropriate alternative text
- dynamic changes do not produce unnecessary announcements

---

## 12.4 Contrast

Check:

- body text
- metadata text
- copper text
- footer
- hover states
- disabled states
- focus states

Do not lower contrast simply to preserve aesthetic minimalism.

---

# 13. PHASE 9 — Performance

Priority: HIGH

Preserve the current optimization architecture.

---

## 13.1 Do not regress

Maintain:

- compressed frames
- responsive frame sets
- lazy loading where possible
- code splitting
- deferred Three.js
- deferred particles
- browser caching
- reduced-motion fallback

---

## 13.2 Measure production

Run audits against the production URL.

Track:

```text
LCP
INP
CLS
TBT
TTFB
JS transfer
Image transfer
Total transfer
```

---

## 13.3 Frame loading

Verify:

- first frame appears immediately enough
- low-quality/first-frame fallback exists where needed
- mobile doesn't download desktop assets
- unused frames are not downloaded unnecessarily
- browser caching works

---

## 13.4 Three.js

The 3D viewer should:

- never block initial content
- load only when needed
- gracefully fail if WebGL is unavailable
- not cause a major layout shift
- respect reduced-motion settings

---

# 14. PHASE 10 — Testing

Priority: CRITICAL

## 14.1 Remove obsolete cart assumptions

The current project no longer uses the old cart flow.

Search tests for:

```text
cart
checkout
add to cart
fake order
```

Remove or replace outdated tests.

---

## 14.2 Create browser smoke tests

Test:

### Navigation

```text
home → each major section
```

### CTA

```text
primary CTA
request flow
tasting flow
contact flow
```

### Mobile

```text
open menu
close menu
navigate
CTA
```

### Accessibility

```text
keyboard navigation
reduced motion
focus visibility
```

### Media

```text
frames load
fallback works
3D loads
3D failure fallback
```

---

## 14.3 Recommended automated test suite

Create tests covering:

```text
01 Page loads
02 Navigation works
03 Main CTA works
04 Mobile menu works
05 Product information renders
06 Request/tasting action works
07 Reduced motion works
08 No horizontal overflow
09 WebGL failure fallback works
10 No console errors
```

---

# 15. PHASE 11 — Code Architecture Cleanup

Priority: MEDIUM

## Problem

The primary page orchestration can become difficult to maintain when every story act is managed in one large component.

---

## 15.1 Extract each act

Consider:

```text
src/components/noire/acts/
  Act01Craving.tsx
  Act02Origin.tsx
  Act03Transformation.tsx
  Act04Chocolate.tsx
  Act05Break.tsx
  Act06Sensory.tsx
  Act07Collection.tsx
  Act08Savor.tsx
```

The exact filenames may differ.

---

## 15.2 Shared components

Create/reuse components for:

```text
SectionHeading
ChapterLabel
PrimaryCTA
SecondaryCTA
ProductMeta
ProductCard
ScrollIndicator
MediaFrame
```

Do not abstract purely for abstraction's sake.

Only extract repeated UI patterns.

---

## 15.3 Centralize product truth

Keep authoritative product data in one location.

Example:

```ts
type Product = {
  slug: string
  name: string
  subtitle: string
  origin: string
  cacaoPercentage?: number
  weight: string
  ingredients: string[]
  tastingNotes: string[]
  process: string
  availability: "request" | "available"
}
```

No duplicated product names, weights, processes, or ingredients across multiple components.

---

# 16. PHASE 12 — SEO and Metadata

Priority: MEDIUM

## Verify

Every important route should have:

- title
- description
- canonical URL
- Open Graph metadata
- Twitter metadata
- appropriate image
- structured data where justified

---

## Product structured data

Only add product structured data if the page represents a genuine product offering and the information is accurate.

Do not create misleading ecommerce schema for a request-only product.

---

# 17. Content Architecture

Use three copy layers.

## Layer 1 — Brand statement

Poetic.

Example style:

```text
Something worth waiting for.
```

## Layer 2 — Product proposition

Specific.

Example:

```text
72% single-origin dark chocolate from ...
```

## Layer 3 — Practical details

Functional.

Example:

```text
Weight
Ingredients
Availability
Request tasting
```

Every major product section should contain all three layers.

---

# 18. CTA Rules

Use no more than:

```text
1 primary CTA
1 secondary CTA
```

per meaningful viewport/section.

Primary CTA wording must remain consistent globally.

Secondary CTA may be:

```text
Discover the process
```

or

```text
Read the story
```

Avoid changing CTA language randomly between sections.

---

# 19. Trust Layer

Introduce a restrained credibility section.

Potential content:

```text
Single-origin cacao
Small-batch production
Named cacao provenance
Production methodology
Ingredients
Atelier location
Contact
```

Only include claims that are true and verifiable.

Avoid fake certifications or invented awards.

---

# 20. Footer

The footer should contain:

```text
NOIRE
Brand statement
Collection
Story
Atelier
Request / Tasting
Contact
Legal
Privacy
Terms
Instagram / social links
```

Verify every link.

No dead links.

No placeholder URLs.

---

# 21. Analytics

Add analytics only if actually required.

Track meaningful events such as:

```text
primary_cta_click
collection_open
product_open
request_started
request_submitted
tasting_started
tasting_submitted
```

Do not track excessive cosmetic interactions.

Avoid measuring every scroll animation event.

---

# 22. Error Handling

The experience must degrade gracefully.

## Failure cases

### JavaScript disabled

Important content should remain reasonably understandable where technically possible.

### WebGL unavailable

Show:

- static image
- product content
- accessible explanation

### Image failure

Do not leave enormous empty sections.

### Form failure

Show:

```text
Something went wrong.
Please try again or contact the atelier directly.
```

Do not silently fail.

---

# 23. Security and Production Hygiene

Check:

- no API keys committed
- no secrets in client code
- no test credentials
- no fake production endpoints
- no debug logging
- no internal error details exposed
- no placeholder contact information
- no development-only URLs

Search repository for:

```text
TODO
FIXME
placeholder
example.com
localhost
console.log
test@test
```

Evaluate every occurrence.

---

# 24. Final Acceptance Criteria

The project is complete only when all of the following are true.

## Brand

- [ ] NOIRE still feels premium
- [ ] No generic UI has been introduced
- [ ] Cinematic storytelling remains the hero
- [ ] Brand voice remains consistent

## UX

- [ ] Navigation is understandable
- [ ] Product discovery is fast
- [ ] Primary CTA is obvious
- [ ] User is never trapped in storytelling
- [ ] Mobile navigation works

## Product

- [ ] Product details are easy to find
- [ ] Product data is internally consistent
- [ ] All factual claims are verified or rewritten
- [ ] No fake commerce behavior exists

## Accessibility

- [ ] Keyboard navigation works
- [ ] Visible focus works
- [ ] Reduced motion works
- [ ] Screen reader semantics are correct
- [ ] Contrast is acceptable

## Performance

- [ ] Production Lighthouse has been tested
- [ ] Mobile has been tested on real hardware
- [ ] Cinematic assets do not block initial content
- [ ] 3D does not block initial content
- [ ] No obvious layout shifts
- [ ] No excessive animation jank

## Engineering

- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Production build passes
- [ ] Browser tests pass
- [ ] Obsolete cart tests are removed
- [ ] No placeholder data remains
- [ ] No production console errors remain

---

# 25. Suggested Priority Matrix

## P0 — Must fix before launch

```text
P0.1 Replace placeholder phone number
P0.2 Fix product typo
P0.3 Resolve 72h vs 48h process wording
P0.4 Fact-check brand/product claims
P0.5 Remove obsolete cart tests
P0.6 Verify all production links/contact actions
P0.7 Run production build
P0.8 Run production browser smoke test
```

## P1 — Strongly recommended

```text
P1.1 Simplify navigation
P1.2 Establish primary CTA
P1.3 Improve collection discoverability
P1.4 Improve mobile navigation
P1.5 Add stronger craft/process evidence
P1.6 Validate real-device mobile performance
P1.7 Improve accessibility edge cases
```

## P2 — Quality and maintainability

```text
P2.1 Extract story-act components
P2.2 Centralize product data
P2.3 Add product-specific routes
P2.4 Improve structured data
P2.5 Add focused analytics
P2.6 Expand automated regression coverage
```

---

# 26. Recommended Agent Workflow

The agent should work in small verified increments.

For each task:

```text
1. Inspect
2. Modify
3. Run typecheck
4. Run lint
5. Run relevant tests
6. Inspect diff
7. Verify no visual regression
8. Continue
```

Never make a large batch of unrelated changes and only test at the end.

---

# 27. Agent Rules

## Rule 1

Do not rewrite the entire application.

## Rule 2

Do not replace the cinematic system unless it is technically broken.

## Rule 3

Do not add dependencies unless there is a clear measurable benefit.

## Rule 4

Do not invent business facts.

## Rule 5

Do not invent product details.

## Rule 6

Do not introduce fake ecommerce behavior.

## Rule 7

Do not trade accessibility for visual effects.

## Rule 8

Do not trade mobile usability for desktop aesthetics.

## Rule 9

Do not optimize based only on localhost.

## Rule 10

Every meaningful change must have a verification step.

---

# 28. Definition of Done

NOIRE is ready for production when it can be described as:

> A cinematic luxury chocolate experience that communicates the product clearly, provides a credible atelier story, performs well on mobile, remains accessible under reduced motion, has a clear request/tasting path, contains consistent verified information, and can be maintained confidently by the development team.

The website should feel less like:

> “Look what this frontend can do.”

and more like:

> “This is a real luxury chocolate house with a world worth entering.”

---

# 29. Final Deliverables

The agent should finish with:

```text
1. Updated application
2. Updated product/content data
3. Updated tests
4. Updated documentation
5. CONTENT_FACT_CHECK.md
6. Production QA report
7. Lighthouse/performance results
8. Accessibility verification
9. List of remaining known issues
```

The final response from the agent should include:

```text
COMPLETED
- ...

CHANGED
- ...

TESTED
- ...

PERFORMANCE
- ...

ACCESSIBILITY
- ...

KNOWN ISSUES
- ...

PRODUCTION READY
YES / NO
```

Do not claim production readiness if any P0 item remains unresolved.