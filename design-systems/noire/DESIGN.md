# Design System — NOIRÉ Atelier

> Category: Luxury / Editorial
> Source of truth extracted from `tailwind.config.ts`, `src/app/globals.css`,
> and the built acts. This file is the OpenDesign brand contract for the
> NOIRÉ website: every OpenDesign skill/template render for this repo must
> follow it instead of a generic system. It pairs with the OpenDesign
> `design-system-luxury` composition rules (headline → support → primary
> action, generous whitespace, restraint) — structure from Luxury, tokens
> from NOIRÉ.

## 1. Visual Theme & Atmosphere

Cinematic, unhurried luxury-chocolate atelier. Dark cacao canvas, warm ivory
type, copper reserved for functional accents and hairlines. No shop UI, no
cart — all conversion runs through concierge email CTAs.

- **Visual style:** editorial serif, monumental display scale, hairline rules
- **Color stance:** dark-first (light text on near-black cacao)
- **Design intent:** patience and provenance; every section is an "act" in a
  scroll-driven film (01/08 … 08/08).

## 2. Color (tokens in `tailwind.config.ts` — never raw hex)

- **Canvas:** `cacao-950` `#080604` — primary background
- **Surfaces:** `cacao-850` `#1A100B`, `cacao-700` `#342015` — layered depth
- **Primary text:** `ivory` `#F3E8D3` (16.66:1 on canvas)
- **Functional copper text:** `copper-text` `#B57B4C` (5.69:1, AA)
- **Bright copper display:** `copper-bright` `#D29A6B` (8.26:1, AAA) — large
  editorial italic, display words, headline accents. Never flat fills.
- **Copper surfaces:** `copper-surface` `#835534` + `copper-hover` `#6B4227`
- **Graphics only:** `copper` `#9B6742` — borders, rings, hairlines, large display
- **Muted text floor:** never below `ivory/50`; icons never below their 3:1 pairings

## 3. Typography

- **Display:** `.font-display` → `var(--font-serif)` (Instrument Serif, weight 400 only)
- **Editorial accent:** `.font-editorial` → serif italic, copper-text, for support lines
- **Functional labels:** `font-sans` (Inter), uppercase, `tracking-[0.3em]`, 10–12px
- **Kickers/metadata:** `font-mono` (system mono stack, zero webfont cost),
  uppercase, `tracking-[0.35em]` — act eyebrows, step numbers. Per the
  OpenDesign `editorial-monocle` direction: mono for metadata, sans for
  labels, serif for voice.
- **Scale:** hero display `text-5xl → sm:7xl → lg:8xl`, `leading-[0.95]`, tight tracking
- Headings carry personality; body copy optimises scanability and contrast.

## 4. Spacing & Grid

- Sections: `max-w-7xl mx-auto`, `px-6 sm:px-12`, generous vertical air (`py-24`)
- Eyebrow → headline → support → action rhythm with `space-y-8` blocks
- Hairline rules `border-cacao-700/40` separate footer rows, not boxes

## 5. Layout & Composition

- Prefer one strong composition per act: eyebrow kicker, monumental headline,
  italic support line, single restrained action
- Whitespace separates concerns before adding borders or shadows
- Cinematic canvas layers sit behind content (`relative z-10` content);
  the canvas carries the legibility scrims (left editorial gradient +
  center-weighted radial for centered moments + top/bottom vignettes),
  so components never add their own boxes or shadows for contrast

## 6. Components

- Text CTAs: copper-text → hover ivory, `min-h-[44px]`, uppercase wide tracking,
  `focus-visible:ring-1 focus-visible:ring-copper`, `rounded-[2px]`
- Solid CTAs: `bg-copper-surface hover:bg-copper-hover text-ivory`
- Analytics hooks required: `data-noire-event` + `data-noire-label`
  (`navigation_click`, `request_tasting_click`, `request_bar_click`, …)
- Interactivity (no new deps): `Reveal` (IO fade-rise, reduced-motion
  passthrough) for below-fold headers; `OriginMarquee` (origins from
  products data, aria-hidden loop half, pause on hover, edge fade masks,
  scroll-velocity-reactive pace/direction, rAF only while settling); `TastingTimer`
  (90s timestamp-math ring, aria-live phases); `AtelierNotes`
  (buttons + aria-expanded/controls, site-copy answers only, no analytics)
- Motion cue: `.animate-drift` 2.6s ease-out glide (neutralised globally under
  `prefers-reduced-motion`, which also disables Lenis smoothing)

## 7. Motion & Interaction

- Subtle, slow, exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`); no bounce
- Hover/focus-visible states explicit on every interactive element
- `prefers-reduced-motion` disables smoothing, scrubbing, particles, CSS motion

## 8. Voice & Brand

- Concise, confident, sensory: "Unhurried heat. Single-origin cacao."
- Act framings: "Act I · The Craving", "Atelier Reserve", "The Chocolate Room"
- Microcopy action-oriented; headlines evocative, labels literal

## 9. Anti-patterns

- No raw hex when a token exists; no text below `ivory/50`
- No copper body copy (graphics/accents only, except `copper-text` for small labels)
- No cards-in-cards, no gradients, no shop/checkout UI, no emojis
- No generic AI-luxury look (purple, Inter-only, glassmorphism)
