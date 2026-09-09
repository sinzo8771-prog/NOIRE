"use client";

import { Product } from "@/data/products";
import { CountUp } from "@/components/noire/CountUp";

interface TastingNotesProps {
  product: Product;
}

export function TastingNotes({ product }: TastingNotesProps) {
  return (
    <div className="space-y-6 pt-4 text-ivory">
      {/* Cacao intensity headline — the one number that matters at a glance */}
      <div className="flex items-baseline justify-between border-b border-cacao-700 pb-3">
        <span className="text-[11px] uppercase tracking-widest-editorial text-ivory/60">
          Cacao Content
        </span>
        <span className="font-display text-2xl text-copper-text">
          {product.cacaoPercentage}%
        </span>
      </div>

      {/* Flavor Notes — the craving cue, always visible */}
      <div className="space-y-2">
        <span className="block text-[10px] uppercase tracking-widest text-ivory/60">
          Tasting Notes
        </span>
        <div className="flex flex-wrap gap-2">
          {product.tastingNotes.map((note) => (
            <span
              key={note}
              className="text-[11px] tracking-wider px-2.5 py-1 bg-cacao-850 border border-cacao-700 text-ivory/80 rounded-[2px]"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* P2 distill: everything below is evidence for the curious, not the
          craving. Native disclosure keeps it keyboard and screen-reader free.
          Weight and harvest live beside the CTA and the harvest line above,
          so they are not repeated here. */}
      <details className="group pt-2 border-t border-cacao-700/60">
        <summary className="cursor-pointer list-none flex items-center justify-between py-3 text-[10px] uppercase tracking-widest text-ivory/60 hover:text-ivory/80 transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-copper">
          <span>Palate & Provenance</span>
          <span aria-hidden="true" className="text-copper-text text-sm leading-none transition-transform duration-300 group-open:rotate-45">
            +
          </span>
        </summary>

        {/* Sensory metric bars */}
        <div className="space-y-3.5 pb-2">
          {product.metrics.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="flex justify-between text-[11px] text-ivory/80 tracking-wide">
                <span>{metric.label}</span>
                <span className="text-copper-text font-mono text-[10px]">
                  <CountUp value={metric.value} suffix="%" duration={1100} />
                </span>
              </div>
              <div className="h-[3px] w-full bg-cacao-850 overflow-hidden rounded-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-cacao-700 to-copper transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Terroir and process — weight/harvest already shown at the CTA */}
        <div className="pt-2 space-y-3 text-[11px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <span className="block text-ivory/60 text-[10px] uppercase tracking-wider">
                Terroir
              </span>
              <span className="text-ivory/90">{product.origin}</span>
            </div>
            <div>
              <span className="block text-ivory/60 text-[10px] uppercase tracking-wider">
                Conche & Temper
              </span>
              <span className="text-ivory/90">{product.roastProfile}</span>
            </div>
          </div>
          <div>
            <span className="block text-ivory/60 text-[10px] uppercase tracking-wider">
              Ingredients
            </span>
            <span className="text-ivory/90">{product.ingredients.join(" · ")}</span>
          </div>
          <div>
            <span className="block text-ivory/60 text-[10px] uppercase tracking-wider">
              Allergen
            </span>
            <span className="text-ivory/80">{product.allergens}</span>
          </div>
        </div>
      </details>
    </div>
  );
}
