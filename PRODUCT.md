# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: design-aware chocolate lover discovering NOIRÉ online at home or on mobile, whose job is to experience the cacao-to-chocolate story and then request a tasting or a bar via the concierge. Behavior confirmed 2026-09-06: tasting-visitor framing chosen over gift-buyer or portfolio-reviewer.

Secondary (unconfirmed, do not design for yet): press / hiring reviewers judging craft.

## Product Purpose

Cinematic single-page showcase for a luxury artisan chocolate atelier — a continuous scroll-driven film (8 acts: Craving → Origin → Transformation → Reveal → Break → Sensory → Collection → Savor) that ends in concierge contact. Not a store: there is no cart, checkout, pricing, or shipping.

Success (user-confirmed 2026-09-06): visitor consumes the full story — all 8 acts and all 4 collection SKUs explored. Concierge inquiry (email / WhatsApp / Chocolate Room) is the secondary conversion, not the primary success metric.

## Positioning

"Chocolate, Unhurried." A slow-luxury house that neighboring brands cannot truthfully copy: single-origin micro-lots, long stone-conche process (advertised 72-hour headline — see open decision below), hand-tempering, tactile film + fashion-editorial presentation, and a strictly custom build with an explicit anti-template manifesto (no generic hero/features/testimonials structure, no purple gradients, no glassmorphism, no card grids).

## Operating Context

- Scroll is the story controller: Lenis smooth scroll drives a frame-by-frame cinematic canvas (192 WebP frames, mobile manifest with every 3rd frame) plus camera/light/typography choreography.
- Act VII collection uses a lazily-mounted 3D product viewer (three.js / react-three-fiber async chunk); ambient particles mount during idle time after first paint.
- Commerce path is concierge-only: "Request This Bar" / "Request a Tasting" / "Enter the Chocolate Room" open pre-filled email to concierge@noire-chocolate.com plus tel:/wa.me links; Mumbai tasting visits by appointment.
- Deployment: fully static Next.js 14 App Router build, no backend, optimized for Vercel (immutable cache headers for frames/models via vercel.json).

## Capabilities and Constraints

- Confirmed: 4 SKUs with full detail (cacao %, origin, tasting notes, palate metrics, ingredients, allergens) in `src/data/products.ts`: ORIGIN 72, DARK SEA SALT 70%, ROASTED HAZELNUT 68%, MADAGASCAR MILK 55%. No price fields by decision.
- Confirmed durable (user chose 2026-09-06): concierge-only forever — never add cart, checkout, pricing, or shipping scaffolding.
- Confirmed technical: static build, progressive frame loading (first ~10 priority, rest background), async 3D chunks, WebGL/image fallback that preserves story + navigation + concierge, `prefers-reduced-motion` native-scroll fallback.
- Open decisions: (1) real atelier phone number — `src/lib/site.ts` holds placeholder +91 98200 00000, must be replaced before launch (phone/WhatsApp rows hidden until configured); (2) conche duration RESOLVED 2026-09-06 — 72 hours wins, headline and product data single-sourced and matching.

## Brand Commitments

Existing name NOIRÉ with tagline "Chocolate, Unhurried." Voice is short, human, sensory, confident, never corporate (e.g. "Slow roast. Deep cacao. Warm finish."). Personality: quiet, sensual, confident, mysterious, warm, cultured, artisanal, modern. Established warm-dark edible editorial identity documented in `NOIRÉ.md` (brand system, copy style, anti-AI-slop manifesto are binding; visual token values live with the implementation, not repeated here).

## Evidence on Hand

- `NOIRÉ.md` — master build bible (vision, story, brand, 3D/motion architecture).
- `noire-website-plan.md` — remediation plan with performance/completeness phases; `AUDIT.md` holds baselines.
- `src/data/products.ts` — 4-SKU catalog, single source of truth for conche claim.
- `public/frames/webp/` (192 desktop frames) + `public/frames/webp-mobile/` (mobile manifest); `public/models/*.glb` product models.
- `src/lib/site.ts` — concierge email + placeholder phone; `src/lib/analytics.ts` zero-dependency event layer.
- Absences future work must not fabricate: no real testimonials, press, benchmarks, or transaction capability; no confirmed real phone, address booking mechanism, or allergen/transparency page content.

## Product Principles

1. Story first, chrome last — every section must earn its place in the cacao-to-savor arc.
2. Slowness is the luxury — restraint, stillness, and pacing beat density and speed.
3. Physical over software-like — materials, light, and texture, never generic SaaS patterns.
4. Showcase honesty — no false commerce affordances; every CTA routes to a real concierge path.
5. Performant cinema — the film must load fast, adapt to device capability, and degrade gracefully.

## Accessibility & Inclusion

Known needs: `prefers-reduced-motion` full fallback (no Lenis smoothing, canvas scrubbing, or particles), skip-to-content link as first focusable element, keyboard-navigable acts/nav/modal, visible focus, semantic headings, touch equivalents for all hover interactions. Plan target: Lighthouse Accessibility ≥ 90. No product-specific standard beyond this established.
