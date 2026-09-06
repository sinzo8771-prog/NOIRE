"use client";

import { CONC_PROCESS } from "@/data/products";

/**
 * Act III — Transformation (process strip).
 *
 * NOTE (P0.3 pending): the conche duration strings are now centralised in
 * CONC_PROCESS (src/data/products.ts) so a reconciling edit touches one
 * constant, not four files. The product data ("Low-temperature 48h conche")
 * vs. the headline ("72 hours") contradiction remains pending owner
 * confirmation — do NOT change the numbers independently.
 */
export function Act03Transformation() {
  return (
    <section
      id="act-3"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
    >
      <div className="max-w-3xl space-y-8">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
          Act III &bull; Transformation
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-normal text-[#F3E8D3] leading-tight">
                    The {CONC_PROCESS.HEADLINE}.
        </h2>
        <p className="text-sm sm:text-base text-[#F3E8D3]/70 leading-relaxed">
          Slow conching is where flavor is decided. NOIRÉ lets heavy traditional granite stone
          wheels roll the mass unhurriedly for {CONC_PROCESS.NARRATIVE} &mdash; softening harsher
          tannins while delicate floral notes and deep fruit sugars awaken.
        </p>

        {/* Sequential Process Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6">
          {[
            { step: "01", name: "FERMENT", desc: "Banana leaf wrap" },
            { step: "02", name: "SUN DRY", desc: "Teak drying beds" },
            { step: "03", name: "SLOW ROAST", desc: "Gentle convective air" },
            { step: "04", name: "CRUSH", desc: "Pure roasted nibs" },
            { step: "05", name: "STONE CONCHE", desc: CONC_PROCESS.DURATION },
          ].map((s) => (
            <div
              key={s.step}
              className="p-3.5 bg-[#120B07]/85 border border-[#342015] rounded-[2px] backdrop-blur-sm space-y-1"
            >
              <span className="text-[9px] font-mono text-[#9B6742]">{s.step}</span>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#F3E8D3]">
                {s.name}
              </p>
              <p className="text-[10px] text-[#F3E8D3]/50">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}