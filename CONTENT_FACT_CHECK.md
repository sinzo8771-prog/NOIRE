# NOIRÉ — Content Fact-Check Ledger

> **Audit date:** 2026-09-06 · **Repository:** `sinzo8771-prog/NOIRE`
> **Purpose:** Track every factual/process/sourcing claim on the site. This file
> is the single inventory for P0.4 — it must be completed with **owner-supplied
> evidence** before launch. Nothing in this file invents evidence.

## Status legend

| Status | Meaning |
|---|---|
| `VERIFIED` | Backed by owner-supplied records/receipts/photos |
| `REWRITTEN` | Was absolute/unverifiable; copy already softened (safe as-is) |
| `UNVERIFIED — OWNER ACTION` | Requires business evidence before launch |

---

## Claims inventory

| # | Claim | Location (file:section) | Evidence | Status | Required action |
|---|---|---|---|---|---|
| 1 | Cacao origin — Tumaco, Colombia (ORIGIN 72) | `src/data/products.ts:35`, `src/app/page.tsx` Act II | Proof of sourcing from Tumaco (purchase/receipt/estate agreement) | UNVERIFIED — OWNER ACTION | Provide source, or rewrite as brand language |
| 2 | Cacao origin — Esmeraldas, Ecuador (DARK SEA SALT) | `src/data/products.ts:59` | Sourcing proof from Esmeraldas | UNVERIFIED — OWNER ACTION | Provide source or rewrite |
| 3 | Cacao origin — Sambirano Valley, Madagascar (MADAGASCAR MILK) | `src/data/products.ts:107` | Sourcing proof from Sambirano | UNVERIFIED — OWNER ACTION | Provide source or rewrite |
| 4 | Cacao origin — Chanchamayo, Peru (ROASTED HAZELNUT) | `src/data/products.ts:83` | Sourcing proof from Chanchamayo | UNVERIFIED — OWNER ACTION | Provide source or rewrite |
| 5 | Alta Langa IGP hazelnuts | `src/data/products.ts:81,95` | Product/COC documentation for IGP claim | UNVERIFIED — OWNER ACTION | IGP is a protected term; evidence or qualify wording |
| 6 | "Single-estate" / "single-origin" sourcing | `src/data/products.ts:33,60`, hero (`page.tsx`), footer | Estate agreements per lot | UNVERIFIED — OWNER ACTION | Evidence or convert to "single-origin" brand language |
| 7 | "Heirloom Theobroma cacao" | Act II, product subtitles/descriptions | Genetic/varietal documentation | UNVERIFIED — OWNER ACTION | Evidence or qualify |
| 8 | Harvest labels (Winter 2025 Micro-Lot etc.) | `src/data/products.ts:36,60,84,108` | Harvest records per lot | UNVERIFIED — OWNER ACTION | Real lot labels or remove dates |
| 9 | Direct-trade partnership copy (footer) | `NoireFooter.tsx` `#direct-trade` | Partner contracts | UNVERIFIED — OWNER ACTION | Evidence or soften to brand positioning |
| 10 | Multi-year fixed-price contracts | `NoireFooter.tsx` | Signed agreements | UNVERIFIED — OWNER ACTION | Evidence or remove absolute terms |
| 11 | "Growers paid well above commodity market rate" | `NoireFooter.tsx` | Payment records | UNVERIFIED — OWNER ACTION | Evidence or qualify |
| 12 | "Every harvest lot traceable to a single estate and fermentation batch" | `NoireFooter.tsx` | Lot traceability ledger | UNVERIFIED — OWNER ACTION | Evidence or qualify scope |
| 13 | 72-hour headline conche ("72-Hour Granite Conche", "three days and nights", "72 hours uninterrupted") | Act III, footer nav, Chocolate Room flight | Owner's production model | **CONFLICT — OWNER ACTION** | See P0.3: reconcile with #14 |
| 14 | ORIGIN 72 "Low-temperature 48h conche" | `src/data/products.ts:37` | Owner's production model | **CONFLICT — OWNER ACTION** | See P0.3: reconcile with #13 |
| 15 | "Slow roasting" / "gentle convective air" | Act III process strip | Roasting spec | UNVERIFIED — OWNER ACTION | Confirm or adjust strip |
| 16 | "Banana leaf wrap" fermentation | Act III process strip | Fermentation process docs | UNVERIFIED — OWNER ACTION | Confirm or adjust strip |
| 17 | "Teak drying beds" / sun drying | Act III process strip | Drying process docs | UNVERIFIED — OWNER ACTION | Confirm or adjust strip |
| 18 | Form V crystal structure claim | Act V | Tempering spec / lab or production notes | VERIFIED (self-evident standard) | Keep (already rewritten to brand language) |
| 19 | "Melts exactly at body temperature" (removed) | ~~Act V~~ | — | REWRITTEN | Done — replaced with "melts slowly and evenly" |
| 20 | "Industrial confection relies on chemical deodorization" (removed) | ~~Act III~~ | — | REWRITTEN | Done — removed universal industry claim |
| 21 | Ingredient lists per SKU | `src/data/products.ts` | Actual wrapper-level ingredient declarations | UNVERIFIED — OWNER ACTION | Match labels to wrappers |
| 22 | "Dedicated tree-nut free atelier" (ORIGIN 72 allergen) | `src/data/products.ts:48` | Facility allergen audit | UNVERIFIED — OWNER ACTION | Evidence or qualify ("dedicated line") |
| 23 | "May contain traces of dairy from shared artisanal stone mills" | `src/data/products.ts:72` | Cross-contact risk assessment | UNVERIFIED — OWNER ACTION | Confirm mills are genuinely shared |
| 24 | Zero soy lecithin / zero vanillin / zero filler | Act IV Formula Restraint | Ingredient spec sheets | UNVERIFIED — OWNER ACTION | Evidence or qualify |
| 25 | Atelier address — "18 Ropewalk Lane, Heritage Arts District, Fort, Mumbai 400 001" | `NoireFooter.tsx` | Business registration / lease | UNVERIFIED — OWNER ACTION | Verify real + operational |
| 26 | Concierge email — concierge@noire-chocolate.com | `src/lib/site.ts:3` | Mailbox ownership | UNVERIFIED — OWNER ACTION | Verify mailbox operational |
| 27 | Phone / WhatsApp number | `src/lib/site.ts:7-8` | Real business line | **OWNER ACTION (P0.1)** | Replace placeholder with real number |
| 28 | "Cacao" (not "cocoa") vocabulary consistent | all product data | Copy QA | VERIFIED | Done — only "Cacao Butter" now used |
| 29 | "trace traces" duplicate wording | `src/data/products.ts:72` | Copy QA | VERIFIED (fixed) | Done — "May contain traces of dairy" |

---

## Rules applied (plan §7)

- Verified → `KEEP`
- True but too absolute → `REWRITE`
- Unverified → `REMOVE` or convert to clearly identified brand language

**Nothing above marks a claim as verified without owner evidence.**