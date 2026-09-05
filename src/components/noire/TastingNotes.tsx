"use client";

import { Product } from "@/data/products";

interface TastingNotesProps {
  product: Product;
}

export function TastingNotes({ product }: TastingNotesProps) {
  return (
    <div className="space-y-6 pt-4 text-[#F3E8D3]">
      {/* Cacao intensity headline */}
      <div className="flex items-baseline justify-between border-b border-[#342015] pb-3">
        <span className="text-[11px] uppercase tracking-widest-editorial text-[#F3E8D3]/60">
          Cacao Content
        </span>
        <span className="font-display text-2xl text-[#9B6742]">
          {product.cacaoPercentage}%
        </span>
      </div>

      {/* Sensory metric bars */}
      <div className="space-y-3.5">
        <span className="block text-[10px] uppercase tracking-widest text-[#F3E8D3]/50">
          Palate Architecture
        </span>
        {product.metrics.map((metric) => (
          <div key={metric.label} className="space-y-1">
            <div className="flex justify-between text-[11px] text-[#F3E8D3]/80 tracking-wide">
              <span>{metric.label}</span>
              <span className="text-[#9B6742] font-mono text-[10px]">
                {metric.value}%
              </span>
            </div>
            <div className="h-[3px] w-full bg-[#1A100B] overflow-hidden rounded-[1px]">
              <div
                className="h-full bg-gradient-to-r from-[#342015] to-[#9B6742] transition-all duration-700 ease-out"
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Flavor Notes Tags */}
      <div className="space-y-2 pt-2">
        <span className="block text-[10px] uppercase tracking-widest text-[#F3E8D3]/50">
          Tasting Notes
        </span>
        <div className="flex flex-wrap gap-2">
          {product.tastingNotes.map((note) => (
            <span
              key={note}
              className="text-[11px] tracking-wider px-2.5 py-1 bg-[#1A100B] border border-[#342015] text-[#F3E8D3]/80 rounded-[2px]"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Terroir & Origin Micro Details */}
      <div className="pt-2 grid grid-cols-2 gap-4 text-[11px] border-t border-[#342015]/60">
        <div>
          <span className="block text-[#F3E8D3]/40 text-[10px] uppercase tracking-wider">
            Terroir
          </span>
          <span className="text-[#F3E8D3]/90">{product.origin}</span>
        </div>
        <div>
          <span className="block text-[#F3E8D3]/40 text-[10px] uppercase tracking-wider">
            Conche & Temper
          </span>
          <span className="text-[#F3E8D3]/90">{product.roastProfile}</span>
        </div>
      </div>
    </div>
  );
}
