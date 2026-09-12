"use client";

import { PRODUCTS } from "@/data/products";

/**
 * Act IV — The Reveal.
 *
 * The flagship ORIGIN 72 numbers are derived from the authoritative product
 * data (P6.2): if the flagship rows change, this marketing copy follows.
 */
export function Act04Reveal() {
  const flagship = PRODUCTS[0];
  const originName = flagship.origin.split(",")[0]; // "Tumaco"
  const sugarPct = 100 - flagship.cacaoPercentage;

  return (
    <section
      id="act-4"
      aria-label="Act IV: The Chocolate"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-mono">
            Act IV &bull; The Reveal <span className="text-ivory/60">&middot; 04 / 08</span>
          </span>
          <h2 className="font-display text-5xl sm:text-7xl font-normal text-ivory leading-[0.95]">
            {flagship.cacaoPercentage}% CACAO.
            <br />
            <span className="font-editorial italic text-copper-bright">
              Nothing unnecessary.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-ivory/70 leading-relaxed max-w-lg">
            Cast in calibrated molds with crisp beveled snap gutters. Stamped with the singular
            NOIRÉ mark. The surface gleams with microscopic cacao butter crystals aligned to
            perfection.
          </p>
        </div>

        <div className="lg:col-span-5 flex justify-end">
          <div className="border-l border-cacao-700 pl-8 space-y-4 max-w-xs bg-cacao-950/40 backdrop-blur-sm p-4 rounded-[2px]">
            <span className="text-[10px] uppercase tracking-widest text-copper-text">
              Formula Restraint
            </span>
            <p className="text-xs text-ivory/60 leading-relaxed">
              {flagship.cacaoPercentage}% {originName} Cacao. {sugarPct}% Raw Unrefined Cane
              Sugar. A whisper of cold-pressed cacao butter. Zero soy lecithin. Zero vanillin.
              Zero filler.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}