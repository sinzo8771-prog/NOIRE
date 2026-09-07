"use client";

import { CONC_PROCESS } from "@/data/products";

/**
 * Act III — Transformation (process strip).
 *
 * Conche duration is centralised in CONC_PROCESS (src/data/products.ts).
 * Resolved 2026-09-06 (owner ruling): 72 hours — headline and product
 * data match; do NOT change the numbers independently.
 */
export function Act03Transformation() {
  return (
    <section
      id="act-3"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
    >
      <div className="max-w-3xl space-y-8">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-sans">
          Act III &bull; Transformation <span className="text-ivory/60">&middot; 03 / 08</span>
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-normal text-ivory leading-tight">
                    The {CONC_PROCESS.HEADLINE}.
        </h2>
        <p className="text-sm sm:text-base text-ivory/70 leading-relaxed">
          Slow conching is where flavor is decided. NOIRÉ lets heavy traditional granite stone
          wheels roll the mass unhurriedly for {CONC_PROCESS.NARRATIVE} &mdash; softening harsher
          tannins while delicate floral notes and deep fruit sugars awaken.
        </p>

        {/* Sequential process timeline — hairline rules + copper ticks, not boxes */}
        <ol className="grid grid-cols-2 sm:grid-cols-5 gap-x-3 gap-y-6 pt-6">
          {[
            { step: "01", name: "FERMENT", desc: "Banana leaf wrap" },
            { step: "02", name: "SUN DRY", desc: "Teak drying beds" },
            { step: "03", name: "SLOW ROAST", desc: "Gentle convective air" },
            { step: "04", name: "CRUSH", desc: "Pure roasted nibs" },
            { step: "05", name: "STONE CONCHE", desc: CONC_PROCESS.DURATION },
          ].map((s) => (
            <li key={s.step} className="border-t border-cacao-700/40 pt-4 space-y-1">
              <span className="text-[10px] tracking-[0.25em] text-copper-text font-sans">{s.step}</span>
              <p className="text-xs uppercase tracking-wider font-semibold text-ivory">
                {s.name}
              </p>
              <p className="text-[10px] text-ivory/50">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}