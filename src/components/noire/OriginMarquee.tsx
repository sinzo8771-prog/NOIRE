"use client";

import { PRODUCTS } from "@/data/products";

/**
 * Origin marquee — infinite provenance strip between Sensory and Collection.
 * Origins derive from `src/data/products.ts` (no new claims). The second
 * half is aria-hidden duplication for a seamless loop. Pauses on hover;
 * the global reduced-motion kill-switch stills it for those who ask.
 */
export function OriginMarquee() {
  const items = [...PRODUCTS.map((p) => p.origin), "Single-Origin Cacao"];
  return (
    <section
      id="origins"
      aria-label="Cacao origins"
      className="relative z-10 border-y border-cacao-700/40 py-5 overflow-hidden"
    >
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap pr-10">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length || undefined}
            className="flex items-center gap-10 text-[11px] uppercase tracking-[0.3em] font-mono text-ivory/60"
          >
            {t}
            <span aria-hidden="true" className="text-copper-text">
              &middot;
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
