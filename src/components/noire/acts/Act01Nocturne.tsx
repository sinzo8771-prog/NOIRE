"use client";

import { ArrowDown } from "lucide-react";

import { mailtoLink } from "@/lib/site";

interface Act01NocturneProps {
  /** Lenis-aware navigation to the Reserve Collection (P1.1 escape path). */
  onExploreCollection: () => void;
}

/**
 * Act I — Hero variant "Nocturne" (OpenDesign Luxury composition × NOIRÉ brand).
 *
 * Generated under `design-systems/noire/DESIGN.md`: Luxury structure
 * (eyebrow → monumental headline → support → primary action, generous
 * whitespace) rendered strictly in NOIRÉ tokens (cacao/ivory/copper,
 * `.font-display` / `.font-editorial`).
 *
 * Differs from `Act01Craving` (left-aligned editorial) with a centered,
 * symmetrical nocturne composition and a primary concierge CTA.
 * Nocturne is the default hero; the original is kept at `?hero=classic`.
 */
export function Act01Nocturne({ onExploreCollection }: Act01NocturneProps) {
  return (
    <section
      id="act-1"
      className="grain-overlay relative z-10 min-h-screen flex flex-col px-6 sm:px-12 pt-36 pb-16 max-w-7xl mx-auto text-center"
    >
      {/* Eyebrow with hairlines */}
      <div className="flex items-center justify-center gap-6">
        <span aria-hidden="true" className="h-px w-16 sm:w-28 bg-cacao-700/60" />
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-mono">
          Act I &bull; The Craving <span className="text-ivory/60">&middot; 01 / 08</span>
        </span>
        <span aria-hidden="true" className="h-px w-16 sm:w-28 bg-cacao-700/60" />
      </div>

      {/* Central monumental composition */}
      <div className="my-auto py-20 space-y-8 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-ivory/50">
          Before chocolate becomes chocolate&hellip;
        </p>
        <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl font-normal tracking-tight text-ivory leading-[0.95]">
          Darkness,
          <br />
          tempered.
        </h1>
        <p className="font-editorial text-xl sm:text-2xl text-copper-bright italic leading-relaxed max-w-xl mx-auto">
          Single-origin cacao, hand-tempered in small batches. The quiet art of
          deliberate patience.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-2">
          <a
            href={mailtoLink(
              "Request a Tasting — NOIRÉ Atelier",
              "Hello NOIRÉ concierge,\n\nI would like to request a tasting.\n"
            )}
            data-noire-event="request_tasting_click"
            data-noire-label="hero nocturne request tasting"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-8 py-3 text-[11px] sm:text-xs uppercase tracking-[0.3em] font-sans bg-copper-surface hover:bg-copper-hover text-ivory transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
          >
            Request a Tasting
          </a>
          <button
            type="button"
            onClick={onExploreCollection}
            data-noire-event="navigation_click"
            data-noire-label="hero nocturne explore collection"
            data-noire-target="#act-7"
            className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] text-[10px] sm:text-xs uppercase tracking-[0.3em] text-copper-text hover:text-ivory transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-copper rounded-[2px] py-1 px-1 font-sans"
          >
            Explore the Reserve Collection <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      {/* Provenance hairline footer (wraps safely at 360px) */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-8 border-t border-cacao-700/40 text-[10px] sm:text-xs text-ivory/50 uppercase tracking-widest">
        <span>Single-origin cacao</span>
        <div className="flex items-center space-x-2 animate-drift">
          <span>Scroll to begin film journey</span>
          <ArrowDown className="w-3.5 h-3.5 text-copper-text" />
        </div>
        <span>Atelier Reserve</span>
      </div>
    </section>
  );
}
