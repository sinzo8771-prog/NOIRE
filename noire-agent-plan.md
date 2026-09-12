# NOIRÉ AI Agent Plan

**Project**: NOIRÉ — Cinematic chocolate website  
**Tagline**: Chocolate, Unhurried  
**Deployed**: `noireee.vercel.app`  
**Repository**: sinzo8771-prog/NOIRE  
**Tech Stack**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, GSAP, ScrollTrigger, Lenis, Three.js / React Three Fiber

---

## 🎯 Mission

Build a production-quality cinematic chocolate landing page that feels like a luxury food film, contemporary fashion campaign, tactile 3D product experience, and modern storefront — all in one continuous story. Must NOT look like an AI-generated landing page.

**Core Story**: CACAO → ORIGIN → TIME → CRAFT → TRANSFORMATION → CHOCOLATE → TASTE → COLLECTION → BAG

**Anti-AI-Slop Rules (75+ from NOIRÉ.md)**:
- No generic SaaS layout (Hero/Features/Benefits/Testimonials/Pricing/FAQ/CTA/Footer)
- No animation without purpose (must support: STORY, HIERARCHY, PHYSICALITY, INTERACTION, MATERIALITY, TRANSITION)
- No random 3D (only cacao/pod/bean/bar/piece; 3D must belong to chocolate world)
- No purple/blue/pink/neon/rainbow gradients (warm, dark, edible, tactile palette only)
- No fake luxury (luxury from spacing, material, typography, lighting, pacing, craft)
- No card-grid addiction (use CollectionStage with ProductCanvas, not cards)
- Reduced motion respected (full graceful degradation)

---

## 📁 Folder Structure (Workspace: C:\Users\lenovo\Desktop\yoo\)

```
noire-review-summary.md     # Review findings and action items (already created)
noire-agent-plan.md         # THIS FILE — AI agent project plan
```

---

## 🚀 Phase 01 — Startup Tasks (IMMEDIATE)

| Task | Priority | Owner | Success Criteria |
|------|----------|-------|-----------------|
| ~~Replace placeholder phone in `src/lib/site.ts`~~ | 🔴 Critical | Tech Architect | ✅ Resolved — placeholder phone/WhatsApp removed entirely; contact is concierge email only |
| Implement `CollectionStage` for ACT VII (no card grid) | 🔴 Critical | UI Engineer + 3D Engineer | 4 products rendered via ProductCanvas + editorial tabs; NOT card-grid; anti-slop Rule 06 compliant |
| Add `aria-label` landmarks to each act section | 🟠 High | Accessibility Engineer | ✅ Done — all 8 acts carry `aria-label="Act N: <Name>"`, SSR-verified |
| Verify sensory word (ACT VI) accessibility | 🟠 High | Accessibility Engineer | ✅ Done — words are real SSR text in a labelled `<ol>`; regression suite confirms |
| Run `node scripts/probe-overflow.js` | 🟠 High | Responsive Engineer | No horizontal overflow at any viewport width; fixed before launch |
| Real-device Lighthouse + cellular test | 🟠 High | QA + Creative Director | After Vercel deploy; mobile perf ≥90; LCP acceptable on Slow-4G |
| Run Puppeteer regression suite | 🟠 High | QA Engineer | CI integration; 12 groups / 162 checks all passing |
| Final creative polish subtraction pass | 🟡 Medium | Creative Director + all engineers | What can disappear/slow down/be simpler; website passes final quality bar |

**Phase 01 Complete When**: All 🔴 and 🟠 tasks done; real-device test passed; creative polish complete.

---

## 📐 Phase 02 — Architecture (Already Laid Foundation)

**Already Completed** (from codebase analysis):
- ✅ App Router structure (next build, src/app/)
- ✅ shadcn/ui for functional UI (Button, Dialog, Drawer, Sheet, etc.)
- ✅ 3D architecture: ChocolateWorld → CameraRig → LightingRig → CacaoPod → CacaoBean → ChocolateBar → ChocolatePiece → Particles → Environment
- ✅ Animation model: Lenis + GSAP + ScrollTrigger; React refs/GSAP/Three.js for high-frequency; React state for UI state
- ✅ State architecture: selectedProduct, cartItems, quantities, menuOpen, cartOpen, productModalOpen, soundEnabled, motionPreference
- ✅ Responsive architecture: desktop/full 3D, tablet/reduced, mobile/simplified
- ✅ Performance model: lazy-load heavy 3D, compressed models/textures, adaptive complexity
- ✅ Performance budgets met: Route JS 41.1 kB, First Load 128 kB, Frame desktop 6.51 MB, Frame mobile 1.16 MB

**Architecture Validation**: System supports both cinematic experience and commerce CTAs without conflicts.

---

## 🎨 Phase 03 — Static Foundation

**Goals**: Navigation, hero layout, all 8 story sections, footer, typography.  
**Goal**: "The website should already look good with all animation disabled."

### Key Components

| Component | Priority | Notes |
|-----------|----------|-------|
| **NoireNavigation** | High | Transparent → compact → solid based on scroll (Section 30) |
| **Hero layout** | High | Cacao bean 3D, "Before chocolate becomes chocolate..." text, scroll indicator (Section 12) |
| **Act I-VIII sections** | High | Each with clear goal, visual, copy, interaction (NOIRÉ.md Sections 03-09) |
| **Typography** | High | One expressive serif + one modern sans; large scale contrast |
| **Color system** | High | Cacao black #080604, dark cocoa #1A100B, roasted cacao #342015, warm ivory #F3E8D3, muted copper #9B6742 |
| **Grid system** | Medium | 12-column desktop, 8-column tablet, 4-column mobile; intentional asymmetry |
| **Spacing system** | Medium | 8px scale: 8, 16, 24, 32, 48, 64, 96, 128, 192px |
| **Border radius** | Medium | Sm: 2px, Md: 6px, Lg: 10px; avoid pill-shaped UI |

### Deliverables
- Fully marked-up HTML for all 8 acts, navigation, hero, footer
- Visual design works with motion disabled and 3D disabled

### Success Criteria
- Page is visually complete and meaningful with CSS animation: `none` and 3D disabled

---

## 🧩 Phase 04 — UI System

### shadcn Components to Use
```
Button, Dialog, Drawer, Sheet, Navigation Menu, Tooltip, Tabs, Accordion, Carousel, Separator, Progress, Scroll Area, Input, Select
```

### NOIRÉ-Specific Wrappers Required

| Component | Key Buttons/Usage | Anti-Slop Check |
|-----------|------------------|-----------------|
| **NoireButton** | Primary: ENTER THE CHOCOLATE ROOM<br>Secondary: SHOP COLLECTION<br>Product: ADD TO BAG<br>Utility: BAG, MENU, CLOSE, BACK | Use design tokens, not library defaults; max 3 magnetic buttons |
| **NoireDialog** | Ingredients, origin, allergens, shipping | Adapted cinematic modal; no frosted glass; NOIRÉ tokens |
| **NoireSheet** | Mobile nav, product details | Modal/panel pattern; elegant staggered reveals |
| **NoireTabs** | ORIGIN 72, DARK SEA SALT, ROASTED HAZELNUT, MADAGASCAR MILK | Editorial labels; NO pill-shaped tabs (Section 37) |
| **NoireTooltip** | Chocolate surface, packaging, ingredient texture | Only where lens effect has meaning (Section 35) |
| **NoireNavigation** | Transparent → compact → solid | Based on scroll position (Section 30) |

### Checkpoints (per NOIRÉ.md Rule 28)
- [ ] Extract behavior from shadcn components
- [ ] Remove default visual style completely
- [ ] Apply NOIRÉ tokens (colors, spacing, radius)
- [ ] Adapt to story context (not generic)

### Deliverables
- All wrappers built, visually normalized to NOIRÉ
- shadcn components are invisible — visitor feels custom design

### Success Criteria
- No library aesthetic leaks through; all components feel part of NOIRÉ cinematic world

---

## 🌐 Phase 05 — Cinematic UI

### Selected Aceternity Patterns (extract behavior only, restyle)

| Pattern | NOIRÉ-Specific Adaptation |
|---------|--------------------------|
| **Magnetic Button** | Max 3: ENTER THE CHOCOLATE ROOM, SHOP COLLECTION, ADD TO BAG; not for every button |
| **Sticky Scroll** | Selective story sections only; NOT entire website |
| **Lens Effect** | Chocolate surface, packaging, ingredient texture only |
| **Following Pointer** | Subtle cursor changes: DRAG/ENTER/TASTE/VIEW states; small circular cursor; never main attraction (Section 32) |
| **Parallax Hero** | Controlled, story-driven; NOT continuous |
| **Animated Tooltip** | Only where useful (Section 64) |
| **Animated Modal** | Carefully adapted cinematic modal (Section 40) |
| **Floating/Resizable Navbar** | Elegant; NOT demo-styled |

### Implementation Principles (NOIRÉ.md Rule 28)
- [ ] Extract behavior from library components
- [ ] Remove default visual style completely
- [ ] Apply NOIRÉ tokens (colors, spacing, radius, typography)
- [ ] Adapt to story (never copy demo styling)

### Deliverables
- All patterns adapted, restyled, story-integrated
- Every pattern feels part of NOIRÉ world, not generic library demo

### Success Criteria
- Visitor can't tell which library components were used; visual language is 100% custom NOIRÉ

---

## 🕹️ Phase 06 — 3D World

### 3D Architecture (NOIRÉ.md Section 15)
```
ChocolateWorld
├── CameraRig
├── LightingRig
├── CacaoPod        (Act II)
├── CacaoBean       (Act I & transitions)
├── ChocolateBar    (Act IV hero)
├── ChocolatePiece  (Acts V-VI)
├── Particles       (atmospheric only)
└── Environment
```

### Asset Strategy (Section 14)
- **Recommended**: `/models/cacao-pod.glb`, `/models/cacao-bean.glb`, `/models/chocolate-bar.glb`, `/models/chocolate-piece.glb`, `/models/packaging.glb`
- **NOT**: Dozens of assets; keep small number of high-quality assets
- Quality over quantity: chocolate must feel organic, rough, slightly imperfect, warm, edible, physical

### Material System (Section 16)
- Support: base color, roughness, specular response, normal detail, micro variation, subtle imperfections
- Prefer textures over complicated procedural shaders
- Chocolate must NOT feel: plastic, rubber, toy-like CGI
- Target: organic, rough, warm, edible, physical

### Lighting System (Section 17)
- Scene A (Origin): dark, moody, cooler shadows, small rim light
- Scene B (Transformation): warmer, slightly brighter, more dimensional
- Scene C (Chocolate reveal): strong directional key, warm highlight, deep shadow
- Scene D (Final): soft, quiet, minimal

### Particle System (Section 18)
- Only: cacao dust, tiny fragments, airborne dust, very small organic particles
- Counts adapt to device capability
- Device levels: HIGH (full), MEDIUM (reduced), LOW (minimal/static fallback)

### WebGL Fallback (Section 53)
- If WebGL unavailable: 3D scene → premium image/video fallback
- Preserve: story, typography, content, navigation, commerce
- Never show technical error to visitor

### Device Capability Levels (Section 52)
- HIGH: full 3D, full particles, higher texture quality
- MEDIUM: reduced particles, lighter textures, simplified effects
- LOW: minimal 3D, static fallback, minimal particles

### Deliverables
- Fully functional 3D world with all scenes, materials, lighting, particles
- Device capability adaptation
- WebGL fallback that preserves entire experience

### Success Criteria
- 3D feels organic and edible, never plastic-looking
- Story fully accessible without 3D
- Fallback works; visitor sees never a technical error

---

## 📜 Phase 07 — Scroll Engine

### Scroll System (NOIRÉ.md Section 19)
- **Lenis**: Smooths wheel events; touch/keyboard native (not smoothed)
- **GSAP + ScrollTrigger**: Drives camera, 3D, lighting, text, particles, scene transitions

### Scroll Timeline (Section 20) — 8 segments across 8 acts

| Segment | Pct | Controls |
|---------|-----|----------|
| 0–15% | 15% | Camera far → closer; bean small → larger; text fade in; light begins revealing |
| 15–30% | 15% | Camera moves inward; bean dominant; environment emerges; particles appear |
| 30–50% | 20% | Bean → transformed state; process typography; camera travels; lighting changes |
| 50–70% | 20% | Chocolate bar appears; camera orbits; light becomes warm; product dominates |
| 70–85% | 15% | Bar cracks; pieces separate; one piece approaches |
| 85–100% | 15% | Scene empties; one piece remains; final statement; CTA |

### Motion Principles (Section 22)
- Motion should feel: slow, weighted, organic, cinematic, expensive
- Avoid: bouncy, random, hyperactive, constant

### Key Implementation
- [ ] Lenis integration: smooth scroll, native touch/keyboard
- [ ] ScrollTrigger scenes for each act boundary
- [ ] Camera choreography: push/in, pull out, orbit, dolly, slight pan (NO constant rotation) (Section 21)
- [ ] 3D object transformations synchronized with scroll
- [ ] Lighting changes per scene (A→B→C→D)
- [ ] Typography appearance/disappear per act
- [ ] Particle behavior per segment
- [ ] Scene transitions between acts

### Deliverables
- Complete scroll engine: Lenis → GSAP ScrollTrigger → all scene changes across 8 acts

### Success Criteria
- Scroll tells the story cinematically
- Motion is restrained, not continuous
- Stillness exists between dramatic moments
- Camera never constantly rotates (film camera principles)

---

## 📖 Phase 08 — Story Choreography

### Act-by-Act Implementation

| Act | Key Elements | Priority |
|-----|-------------|----------|
| I — Craving | Almost-black screen, single bean, "Before chocolate becomes chocolate...", camera slowly approaches | 🔴 High |
| II — Origin | Cacao pod, humidity, dark earth, soft particles, words: SOIL/HEAT/TIME/HANDS | 🔴 High |
| III — Transformation | FERMENT→DRY→ROAST→CRUSH→CONCH; visual transformation bean→chocolate | 🔴 High |
| IV — The Chocolate | 72% CACAO hero, "Nothing unnecessary," product reveal | 🔴 High |
| V — The Break | Bar cracks, pieces separate, one piece floats forward | 🔴 High (one of biggest moments) |
| VI — Sensory | Single piece, soft light, empty background. Words: BITTER→WARM→DEEP→GONE (one per viewport) | 🔴 Critical |
| VII — Collection | ORIGIN 72, DARK SEA SALT, ROASTED HAZELNUT, MADAGASCAR MILK. Each: name, description, cacao %, weight, tasting notes, product visual, 3D interaction, Add to Bag | 🔴 High (but: CollectionStage, NOT card grid) |
| VIII — Ending | Final piece, "Some things deserve to be savored slowly," CTA: ENTER THE CHOCOLATE ROOM | 🔴 High |

### Story Progress (Section 63)
- Subtle progress: 01 ORIGIN → 02 CRAFT → 03 CACAO → 04 TASTE
- Helps orientation without dashboard feel

### Deliverables
- All 8 acts fully implemented with proper narrative pacing, camera movements, visual transitions

### Success Criteria
- Visitor feels one continuous cinematic journey from beginning to end
- Each act has clear purpose; no gratuitous sections

---

## 🛒 Phase 09 — Product Experience

### Product Data (Section 44)
```ts
export interface Product {
  id: string;
  name: string;
  cacaoPercentage?: number;
  price: number;
  currency: string;
  weight?: string;
  description: string;
  tastingNotes: string[];
  model?: string;
  image?: string;
}
```
Stored in: `src/data/products.ts`

### 4 SKUs
- ORIGIN 72, DARK SEA SALT, ROASTED HAZELNUT, MADAGASCAR MILK

### Product Stage Architecture (Section 36)
```
CollectionStage
├── ProductNavigation (shadcn Tabs as editorial labels: ORIGIN 72, DARK SEA SALT, ROASTED HAZELNUT, MADAGASCAR MILK)
├── ProductCanvas (3D product viewer; NOT card grid)
├── ProductInformation (generous whitespace: PRODUCT, CACAO %, ORIGIN, WEIGHT, TASTING NOTES, PRICE, ADD TO BAG)
├── TastingNotes (editorial: ██ bars under CACAO, BITTERNESS, SWEETNESS, BODY — understated)
└── AddToBag (micro physical animation; NOT generic toast)
```

### Add-to-Bag Experience (Section 41)
- Sequence: CLICK → button feedback → micro product animation → bag count +1 → subtle confirmation
- Avoid: generic toast-first interaction
- Use: shadcn Button + custom motion + bag state

### Cart (Section 42): shadcn Sheet (desktop) / Drawer (mobile). Must actually work.

### Commerce State (Section 43)
- Initial: selectedProduct, cartItems, quantities, menuOpen, cartOpen, productModalOpen, soundEnabled, motionPreference

### Product Modal (Section 40): shadcn Dialog or carefully adapted cinematic modal. Useful for: ingredients, origin, allergens, shipping.

### Deliverables
- Working: product selection → 3D viewer → tasting notes → Add to Bag → cart drawer with accurate state

### Success Criteria
- Purchasing journey feels physical and cinematic, not generic e-commerce
- Cart state is accurate
- CTAs are pre-filled mailto: to concierge (no fake checkout)

---

## 📱 Phase 10 — Responsive

### Responsive Strategy (Section 49)

| Device | 3D | Particles | Camera | Typography |
|--------|----|-----------|--------|------------|
| Desktop | Full cinematic | Full count | Full choreography | Larger |
| Tablet | Reduced | Medium count | Simplified | Medium |
| Mobile | Lighter, simplified | Reduced count | Shorter transitions | Adapted, touch-first |

### Mobile Touch Interactions (Section 50)
- Tap, swipe, drag, press, scroll
- Do NOT require hover
- Anything hover-only on desktop must have touch equivalent

### Mobile Navigation (Section 31)
```
NOIRÉ

STORY
COLLECTION
ABOUT
BAG

─────────────

CHOCOLATE, UNHURRIED.
```
- Staggered reveals
- shadcn Sheet

### Key Responsive Tasks
- [ ] Frame sets: desktop (192 WebP), mobile (64 WebP, every 3rd frame) (AUDIT.md Section 1)
- [ ] Viewport width detection at runtime selects correct manifest
- [ ] 3D complexity adaptation per device level (HIGH/MEDIUM/LOW) (Section 52)
- [ ] Particle count adaptation
- [ ] Touch equivalents for all hover interactions
- [ ] Navigation: mobile uses shadcn Sheet structure (above)
- [ ] Tablet sits between desktop and mobile

### Deliverables
- Fully functional at desktop, tablet, mobile
- Mobile is intentional design, not shrunken desktop

### Success Criteria
- On mobile, story still coheres
- Touch interactions work
- 3D adapts gracefully or falls back to premium images

---

## ♿ Phase 11 — Accessibility

### Required (Section 55)
- Semantic HTML
- Keyboard navigation (entire site with keyboard alone)
- Visible focus states
- ARIA where appropriate
- Accessible names for all interactive elements
- Reasonable contrast (documented: ivory/cacao-black 16.66:1, copper text 5.69:1, copper-bright 8.26:1)
- Dialog focus management
- Drawer keyboard behavior
- Reduced motion (full graceful degradation)
- Touch support

### Screen Reader Considerations
- All content is SSR HTML — crawlers see all 8 acts without JS
- "Skip to content" first focusable
- **Act boundaries should have `aria-label` landmarks**
- Sensory words (BITTER/WARM/DEEP/GONE) need accessible announcement
- 3D viewer needs keyboard alternative or clear "skip" instruction

### Accessibility Tasks (from earlier analysis)

| Task | Priority | Status |
|------|----------|--------|
| Add `aria-label` to each act section | High | Not yet |
| Ensure sensory word announcements work | High | Not yet |
| 3D viewer keyboard alternative/skip | High | Not yet |
| Fix horizontal overflow at mobile | Medium | Run `node scripts/probe-overflow.js` |
| Dynamic lazy-loaded content has ARIA live regions | Medium | Verify |
| "Skip to content" functional + first focusable | Medium | Verify |
| Focus styles visible on all interactive | Medium | Verify |
| Modals/drawers: Escape key, keyboard trap | Medium | Verify |
| Color contrast already passing | ✅ | Documented |

### Deliverables
- Full accessibility validation: screen reader, keyboard-only, reduced motion, contrast

### Success Criteria
- Website perceivable, operable, understandable for all users including assistive technology

---

## ⚡ Phase 12 — Performance

### Performance Priorities (Section 51)
1. Fast initial content
2. Lazy 3D
3. Optimized assets
4. Stable layout
5. Smooth scroll
6. Adaptive complexity
7. No blocking initial render with full 3D

### Performance Budgets (from AUDIT.md)

| Metric | Target | Current |
|--------|--------|---------|
| Route JS (`/`) | <50 kB | 41.1 kB ✓ |
| First Load JS | <150 kB | 128 kB ✓ |
| Frame payload (desktop) | <8 MB | 6.51 MB ✓ |
| Frame payload (mobile) | <4 MB | 1.16 MB ✓ |
| Lighthouse mobile perf | ≥90 | 90–95 ✓ |
| Lighthouse desktop perf | ≥90 | 100 ✓ |
| LCP (mobile) | <2.5s | 2.6–3.3s (margin) |
| CLS | 0 | 0 ✓ |
| TBT (mobile) | <150ms | 110–130ms ✓ |

### Performance Tasks
- [ ] 3D lazy-load verification (async chunks; mounts near Act VII, particles idle-time) (AUDIT.md Section 1)
- [ ] Model optimization (4 GLB files in public/models/)
- [ ] Texture compression
- [ ] Bundle analysis and reduction
- [ ] Frame pipeline: `node scripts/convert-frames.mjs` maintained
- [ ] No unnecessary React rerenders for high-frequency animation (Section 46: use refs, GSAP, Three.js)
- [ ] Console/runtime error check
- [ ] Smooth animation at all viewport widths

### Web Vitals Monitoring
- LCP, CLS, FID, TBT, SI
- Real-user monitoring post-deploy
- CI integration with Puppeteer suite (`node scripts/test-browser.js`: 12 groups / 162 checks)

### Deliverables
- Performance budget met
- No console errors, no runtime errors
- Smooth animation
- Fast initial load

### Success Criteria
- Lighthouse: mobile ≥90, desktop 100
- Real-device test recommended post-deploy

---

## ✅ Phase 13 — QA

### QA Checklist (Section 67)

| Category | Items |
|----------|-------|
| **Initial loading** | First paint, time to interactive, no CLS, LCP acceptable |
| **Navigation** | All links work; nav state changes (transparent→compact→solid); mobile sheet opens/closes |
| **Scroll** | All 8 acts transition smoothly; camera choreography; motion principles upheld |
| **3D** | Cacao/chocolate materials look organic; lighting convincing; WebGL fallback; device capability adaptation |
| **Animations** | Motion restrained, not continuous; reduced motion works; stillness exists between dramatic moments |
| **Product interaction** | Product selection; 3D viewer responds; Add to Bag micro-animation; cart state accurate |
| **Mobile** | Touch gestures work; navigation sheet; 3D adaptation; no horizontal overflow |
| **Tablet** | sits between desktop and mobile; appropriate complexity |
| **Desktop** | Full cinematic experience; all interactions |
| **Keyboard** | Entire site navigable with keyboard alone; focus visible; act navigation via aria-labels |
| **Reduced motion** | Full gracefully degrades; no motion when prefers-reduced-motion |
| **WebGL fallback** | Premium image/video shown if WebGL unavailable; no technical error visible |
| **Console** | No errors, warnings |
| **Runtime** | No JavaScript errors in browser |
| **Network** | Optimal asset loading; no waterfall bottlenecks |

### Deliverables
- Actual browser verification completed
- All QA items pass

### Success Criteria
- Website open in browser; all functionality verified from beginning to end

---

## 🎨 Phase 14 — Creative Polish

### Subtraction Pass (Section 66)
Ask: What can disappear? What can slow down? What can breathe? What can be simpler? What feels generic? What looks copied? What competes with the hero? What animation has no narrative purpose?

### Final Quality Bar (Section 72)
Website must look intentionally designed even with:
- [ ] Animation disabled ✅ (anti-slop Rule 09)
- [ ] 3D disabled ✅ (fallback preserved)
- [ ] Slow network ✅ (performance budgets met)
- [ ] Mobile viewport ✅ (responsive built)

### One Final Question
> Would a visitor remember NOIRÉ tomorrow?

If not: **simplify, refine and remove.**

### Deliverables
- Subtraction complete
- Website passes final quality bar

### Success Criteria
- Visitor remembers the experience, not just the effects
- NOIRÉ feels like one coherent brand

---

## 👥 Agent Assignments (per NOIRÉ.md Sections 67-69)

| Agent | Mission | Deliver |
|-------|---------|---------|
| **01 — Creative Director** | Create creative direction before code | Brand system, storyboard, typography, color, composition, animation principles, anti-slop rules, component map |
| **02 — Tech Architect** | Create maintainable architecture | Next.js structure, TypeScript structure, shadcn setup, component boundaries, 3D architecture, state model, animation model, responsive model, performance model |
| **03 — UI Engineer** | Build functional design system | NoireButton, NoireDialog, NoireSheet, NoireTabs, NoireTooltip, NoireNavigation — all visually belonging to NOIRÉ |
| **04 — Experience Engineer** | Adapt selected cinematic component patterns | Magnetic Button, Sticky Scroll Reveal, Parallax, Lens, Following Pointer, Animated Tooltip, Animated Modal — behavior extracted, restyled for NOIRÉ |
| **05 — 3D Engineer** | Build the visual world | Scene, camera, lighting, materials, objects, particles, fallback |
| **06 — Motion Engineer** | Create the cinematic timeline | Lenis, GSAP, ScrollTrigger, camera choreography, scene transitions, object transformations, typography animation |
| **07 — Commerce Engineer** | Make the storefront interaction real | Product state, product selection, Add to Bag, cart, quantity, subtotal, drawer |
| **08 — Responsive Engineer** | Ensure story works on all screen sizes | Desktop, tablet, mobile, touch, low-power |
| **09 — Accessibility Engineer** | Verify accessibility | Semantic structure, keyboard, focus, reduced motion, contrast, modal behavior, drawer behavior |
| **10 — QA + Creative Director** | Open website in browser | Verify both engineering quality AND creative quality; fix anything that fails |

---

## 📦 Dependencies

### Core (from package.json)
```bash
npm install three
npm install @react-three/fiber
npm install @react-three/drei
npm install gsap
npm install lenis
```

### UI Library
- shadcn/ui: Button, Dialog, Drawer, Sheet, Navigation Menu, Tooltip, Tabs, Accordion, Carousel, Separator, Progress, Scroll Area, Input, Select

### Selected Patterns (from Aceternity)
- Magnetic Button, Sticky Scroll Reveal, Parallax, Lens, Following Pointer, Animated Tooltip, Animated Modal, Floating/Resizable Navbar

### Do NOT Install
- Dependencies merely because they're trendy
- Every dependency must serve the story

---

## 🏁 Immediate Next Steps (Start PHASE 01 NOW)

| # | Task | Owner | Deadline |
|---|------|-------|----------|
| 1 | Replace placeholder phone in `src/lib/site.ts` | Tech Architect | Before Vercel deploy |
| 2 | Implement `CollectionStage` for ACT VII (no card grid) | UI Engineer + 3D Engineer | Before QA |
| 3 | Add `aria-label` landmarks to each act section | Accessibility Engineer | Before launch |
| 4 | Verify sensory word (ACT VI) accessibility | Accessibility Engineer | Before launch |
| 5 | Run `node scripts/probe-overflow.js` | Responsive Engineer | Before launch |
| 6 | Real-device Lighthouse + cellular test | QA + Creative Director | After Vercel deploy |
| 7 | Run Puppeteer regression suite | QA Engineer | CI integration |
| 8 | Final creative polish subtraction pass | Creative Director + all engineers | Before v1.0 |

---

## ✅ Final Quality Checklist (Summary)

### Brand
- [ ] Brand feels distinctive
- [ ] Voice feels human
- [ ] Copy is restrained
- [ ] Luxury does not feel cliché

### Visual
- [ ] Typography is strong
- [ ] Composition is intentional
- [ ] Negative space exists
- [ ] Chocolate looks realistic
- [ ] Lighting is believable
- [ ] Colors are consistent
- [ ] No generic gradients
- [ ] No visual clutter

### Motion
- [ ] Scroll tells the story
- [ ] Camera feels cinematic
- [ ] Transitions are smooth
- [ ] Motion is restrained
- [ ] Stillness exists
- [ ] No random effects
- [ ] Reduced motion works

### Components
- [ ] Library components visually normalized
- [ ] No copied demos
- [ ] No unnecessary components
- [ ] UI is consistent
- [ ] State is predictable

### 3D
- [ ] Cacao looks believable
- [ ] Chocolate looks edible
- [ ] Lighting is convincing
- [ ] Material is realistic
- [ ] Models are optimized
- [ ] WebGL fallback works

### Commerce
- [ ] Product selection works
- [ ] Add to Bag works
- [ ] Quantity works
- [ ] Remove works
- [ ] Subtotal works
- [ ] Cart opens/closes
- [ ] Mobile cart works

### Responsive
- [ ] Desktop works
- [ ] Tablet works
- [ ] Mobile works
- [ ] Touch works
- [ ] No text overflow
- [ ] No broken layouts

### Accessibility
- [ ] Keyboard navigation
- [ ] Focus states
- [ ] Accessible controls
- [ ] Reduced motion
- [ ] Dialog accessibility
- [ ] Drawer accessibility

### Performance
- [ ] 3D lazy-loads
- [ ] Images optimized
- [ ] Models optimized
- [ ] Textures optimized
- [ ] No unnecessary dependencies
- [ ] No console errors
- [ ] No runtime errors
- [ ] Smooth animation

---

## 🎯 Non-Negotiables (Must Not Violate)

1. **No generic SaaS layout** — 8-act chocolate narrative, not Hero/Features/Benefits/Testimonials/Pricing/FAQ/CTA/Footer

2. **No animation without purpose** — Every motion supports: STORY, HIERARCHY, PHYSICALITY, INTERACTION, MATERIALITY, or TRANSITION

3. **No random 3D** — Only cacao/pod/bean/bar/piece; 3D must belong to chocolate world

4. **No purple/blue/pink/neon/rainbow gradients** — Warm, dark, edible, tactile palette only

5. **No fake luxury** — Luxury from spacing, material, typography, lighting, pacing, craft

6. **No card-grid addiction** — Product architecture: CollectionStage with ProductCanvas, NOT cards

7. **Reduced motion respected** — Full graceful degradation (prefers-reduced-motion)

8. **Commerce reality-checked** — No fake cart, no fake checkout. CTAs are pre-filled mailto: to concierge.

9. **Story is indexable** — Full HTML content, SSR. No crawler dependency on JS.

10. **Component libraries invisible** — shadcn/ui and Aceternity patterns: behavior-only; visual fully restyled to NOIRÉ tokens.

---

**Plan Version**: 1.0  
**Plan Generated**: From GitHub repository sinzo8771-prog/NOIRE analysis  
**Workspace**: C:\Users\lenovo\Desktop\yoo\  
**Key File**: `noire-agent-plan.md` (this file)

**The goal**: Visitor experiences NOIRÉ as one coherent cinematic brand, almost tasting the chocolate by the end. The component library is completely invisible. The website looks intentionally designed with animation disabled, 3D disabled, and on mobile.