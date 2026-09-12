"use client";

import { HeroCutReveal } from "@/components/noire/HeroCutReveal";

import { ArrowDown } from "lucide-react";

interface Act01CravingProps {
  /** Lenis-aware navigation to the Reserve Collection (P1.1 escape path). */
  onExploreCollection: () => void;
}

/**
 * Act I — The Craving (hero).
 *
 * Contains the restrained "Explore the Reserve Collection" secondary action so
 * repeat visitors can skip the cinematic preamble without a shop-like UI.
 */
export function Act01Craving({ onExploreCollection }: Act01CravingProps) {
  return (
    <section
      id="act-1"
      aria-label="Act I: The Craving"
      className="relative z-10 min-h-screen flex flex-col justify-between px-6 sm:px-12 pt-36 pb-16 max-w-7xl mx-auto"
    >
      <div className="space-y-3">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-mono">
          <span className="sm:hidden">Act I &middot; 01 / 08</span>
          <span className="hidden sm:inline">
            Act I &bull; The Craving <span className="text-ivory/60">&middot; 01 / 08</span>
          </span>
        </span>
        <p className="text-xs uppercase tracking-widest text-ivory/60">
          Before chocolate becomes chocolate...
        </p>
      </div>

      {/* Central Editorial Composition */}
      <div className="my-auto py-24 space-y-8 max-w-2xl">
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-ivory leading-[0.95]">
          <HeroCutReveal>Something worth waiting for.</HeroCutReveal>
        </h1>
        <p className="font-editorial text-xl sm:text-2xl text-copper-bright italic max-w-lg leading-relaxed">
          Unhurried heat. Single-origin cacao. The quiet art of deliberate patience.
        </p>
        <button
          type="button"
          onClick={onExploreCollection}
          data-noire-event="navigation_click"
          data-noire-label="hero explore collection"
          data-noire-target="#act-7"
          className="inline-flex items-center gap-2 min-h-[44px] text-[10px] sm:text-xs uppercase tracking-[0.3em] text-copper-text hover:text-ivory transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-copper rounded-[2px] py-1"
        >
          Explore the Reserve Collection <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      {/* Scroll down prompt */}
      <div className="flex items-center justify-between pt-8 border-t border-cacao-700/40 text-xs text-ivory/60 uppercase tracking-widest">
        <span>01 / 08</span>
        <div className="flex items-center space-x-2 animate-drift">
          <span>Scroll to begin film journey</span>
          <ArrowDown className="w-3.5 h-3.5 text-copper-text" />
        </div>
        <span>Atelier Reserve</span>
      </div>
    </section>
  );
}