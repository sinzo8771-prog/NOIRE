"use client";

import { mailtoLink } from "@/lib/site";

interface ReserveDropProps {
  /** Lenis-aware navigation to the Reserve Collection (P1.1 escape path). */
  onExploreCollection: () => void;
}

const RULES = [
  {
    title: "Numbered micro-lot runs",
    body: "Small batches leave the atelier from time to time. Each run is numbered.",
  },
  {
    title: "Announced through the concierge",
    body: "The reserve list hears first — availability never sits on a shelf.",
  },
  {
    title: "Retired runs never return",
    body: "When a run ends, it ends. The collection keeps what endures.",
  },
] as const;

/**
 * Interlude — The Reserve Drop (OpenDesign Luxury composition × NOIRÉ brand).
 *
 * Generated under `design-systems/noire/DESIGN.md`. A non-act section
 * (`id="reserve-drop"`) so the eight-act film, rail, and progress mapping
 * stay intact. Split-editorial layout deliberately differs from the
 * centered TastingRitual. Copy is brand positioning only — no dates,
 * quantities, prices, or bar names — so CONTENT_FACT_CHECK.md needs
 * no new rows.
 */
export function ReserveDrop({ onExploreCollection }: ReserveDropProps) {
  return (
    <section
      id="reserve-drop"
      aria-labelledby="reserve-drop-heading"
      className="relative z-10 px-6 sm:px-12 py-28 sm:py-36 max-w-7xl mx-auto"
    >
      <div className="grid sm:grid-cols-2 gap-12 sm:gap-16 items-start">
        <div className="space-y-8 text-left">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-mono">
            Interlude &bull; The Reserve Drop
          </span>
          <h2
            id="reserve-drop-heading"
            className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-ivory leading-[1.02]"
          >
            Small batches,
            <br />
            <span className="font-editorial italic text-copper-bright">gone quietly.</span>
          </h2>
          <p className="font-editorial text-xl text-copper-text italic leading-relaxed max-w-md">
            From time to time, a micro-lot leaves the atelier. Those on the
            list are asked first.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-2">
            <a
              href={mailtoLink(
                "Join the Reserve List — NOIRÉ Atelier",
                "Hello NOIRÉ concierge,\n\nPlease add me to the reserve list.\n"
              )}
              data-noire-event="request_bar_click"
              data-noire-label="reserve drop join list"
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-8 py-3 text-[11px] sm:text-xs uppercase tracking-[0.3em] font-sans bg-copper-surface hover:bg-copper-hover text-ivory transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
            >
              Join the Reserve List
            </a>
            <button
              type="button"
              onClick={onExploreCollection}
              data-noire-event="navigation_click"
              data-noire-label="reserve drop explore collection"
              data-noire-target="#act-7"
              className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] text-[10px] sm:text-xs uppercase tracking-[0.3em] text-copper-text hover:text-ivory transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-copper rounded-[2px] py-1 px-1 font-sans"
            >
              Explore the Collection <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>

        <div className="space-y-0 border-t border-cacao-700/40">
          {RULES.map((r) => (
            <div
              key={r.title}
              className="border-b border-cacao-700/40 py-7 space-y-2 text-left"
            >
              <h3 className="font-display text-2xl text-ivory">{r.title}</h3>
              <p className="text-sm text-ivory/70 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
