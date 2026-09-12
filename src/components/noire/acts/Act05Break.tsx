"use client";

import { Button } from "@/components/ui/button";

interface Act05BreakProps {
  /** Plays the audible snap effect. */
  onPlaySnap: () => void;
}

/**
 * Act V — The Break.
 *
 * P0.5 addressed: no "exactly body temperature" absolute.
 */
export function Act05Break({ onPlaySnap }: Act05BreakProps) {
  return (
    <section
      id="act-5"
      aria-label="Act V: The Break"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
    >
      <div className="max-w-2xl space-y-6">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-mono">
          Act V &bull; The Break <span className="text-ivory/60">&middot; 05 / 08</span>
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-normal text-ivory leading-tight">
          A snap you feel in your fingertips.
        </h2>
        <p className="text-sm sm:text-base text-ivory/70 leading-relaxed">
          Tempering forms the crisp Form V crystal structure &mdash; the quiet architecture
          behind a porcelain-clean snap. The fractured edge reveals a dark, silky grain that
          melts slowly and evenly on the tongue.
        </p>
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={onPlaySnap}
            className="border-cacao-700 text-copper-text hover:border-copper text-xs uppercase tracking-widest backdrop-blur-sm"
          >
            Audition the Snap
          </Button>
        </div>
      </div>
    </section>
  );
}