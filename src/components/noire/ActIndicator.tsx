"use client";

import { ACTS, actNumeral } from "@/data/acts";

interface ActIndicatorProps {
  activeAct: number; // 1 to 8
}

/**
 * P2 wayfinding: a below-xl chapter marker. The StoryProgress rail is
 * xl-only, so phone and tablet viewers lose chapter orientation mid-film;
 * the hairline answers "how far" while this answers "which chapter."
 *
 * Passive and pointer-events-none — orientation only, never intercepts
 * touch. Chapter changes are announced politely so assistive tech carries
 * the same orientation the rail gives desktop readers via aria-current.
 * z-20 sits under the mobile menu overlay (z-30) so it vanishes on open.
 */
export function ActIndicator({ activeAct }: ActIndicatorProps) {
  const current = ACTS.find((a) => a.id === activeAct) ?? ACTS[0];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-20 flex justify-center xl:hidden"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <p
        aria-live="polite"
        className="inline-flex items-center gap-2.5 bg-cacao-950/80 backdrop-blur-md border border-cacao-700/60 rounded-[2px] px-4 py-2 text-[10px] uppercase tracking-[0.3em] font-mono whitespace-nowrap"
      >
        <span aria-hidden="true" className="text-copper-text">
          {actNumeral(current.id)}
        </span>
        <span aria-hidden="true" className="text-ivory/30">
          &mdash;
        </span>
        <span aria-hidden="true" className="text-ivory/80">
          {current.label}
        </span>
        <span className="sr-only">
          {`Chapter ${actNumeral(current.id)} of 08, ${current.label}`}
        </span>
      </p>
    </div>
  );
}
