"use client";

import { mailtoLink } from "@/lib/site";

interface TastingRitualProps {
  /** Opens the Chocolate Room reservation modal. */
  onOpenRoom: () => void;
}

const MOVEMENTS = [
  {
    n: "01",
    title: "Look",
    body: "Hold the bar to the light. A deep, even sheen — no bloom, no hurry.",
  },
  {
    n: "02",
    title: "Breathe",
    body: "Break a square and breathe in before tasting. Aroma arrives first.",
  },
  {
    n: "03",
    title: "Melt",
    body: "Let it rest on the tongue and melt slowly. Notice what lingers.",
  },
] as const;

/**
 * Interlude — The Tasting Ritual (OpenDesign Luxury composition × NOIRÉ brand).
 *
 * Generated under `design-systems/noire/DESIGN.md`. A non-act section
 * (`id="tasting"`) so the eight-act film, rail, and progress mapping stay
 * intact. Copy is sensory guidance only — no session specifics, prices, or
 * addresses — so CONTENT_FACT_CHECK.md needs no new rows.
 */
export function TastingRitual({ onOpenRoom }: TastingRitualProps) {
  return (
    <section
      id="tasting"
      aria-labelledby="tasting-heading"
      className="relative z-10 px-6 sm:px-12 py-28 sm:py-36 max-w-5xl mx-auto text-center"
    >
      <div className="space-y-8">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-sans">
          Interlude &bull; The Tasting Ritual
        </span>
        <h2
          id="tasting-heading"
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-ivory leading-[1.02]"
        >
          Taste in three
          <br />
          <span className="font-editorial italic text-copper-text">movements.</span>
        </h2>
        <p className="font-editorial text-xl sm:text-2xl text-copper-text italic leading-relaxed max-w-xl mx-auto">
          A quiet method for loud chocolate. Nothing required but attention.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-10 sm:gap-8 mt-16 text-left">
        {MOVEMENTS.map((m) => (
          <div key={m.n} className="border-t border-cacao-700/40 pt-6 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/50 font-sans">
              {m.n}
            </span>
            <h3 className="font-display text-2xl text-ivory">{m.title}</h3>
            <p className="text-sm text-ivory/70 leading-relaxed">{m.body}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-14">
        <a
          href={mailtoLink(
            "Request a Tasting — NOIRÉ Atelier",
            "Hello NOIRÉ concierge,\n\nI would like to request a tasting.\n"
          )}
          data-noire-event="request_tasting_click"
          data-noire-label="tasting ritual request tasting"
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-8 py-3 text-[11px] sm:text-xs uppercase tracking-[0.3em] font-sans bg-copper-surface hover:bg-copper-hover text-ivory transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
        >
          Request a Tasting
        </a>
        <button
          type="button"
          onClick={onOpenRoom}
          data-noire-event="chocolate_room_open"
          data-noire-label="tasting ritual chocolate room"
          className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] text-[10px] sm:text-xs uppercase tracking-[0.3em] text-copper-text hover:text-ivory transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-copper rounded-[2px] py-1 px-1 font-sans"
        >
          Enter the Chocolate Room <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <p className="mt-10 text-xs uppercase tracking-widest text-ivory/50">
        Every tasting is arranged privately through the concierge.
      </p>
    </section>
  );
}
