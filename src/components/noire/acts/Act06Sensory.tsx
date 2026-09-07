"use client";

interface Act06SensoryProps {
  /** Lenis-aware navigation to the Reserve Collection (P1.1 escape path). */
  onExploreCollection: () => void;
}

const SEQUENCE = [
  {
    word: "BITTER.",
    desc: "An initial bold shock of dark roasted bean tannins that clears the palate.",
  },
  {
    word: "WARM.",
    desc: "Body heat melts the cacao butter, releasing leather, oak, and dried black fig.",
  },
  {
    word: "DEEP.",
    desc: "A rich tobacco and molasses resonance that lingers across the throat.",
  },
  {
    word: "GONE.",
    desc: "Dissolves cleanly without greasy residue, leaving only quiet craving.",
  },
];

// Restrained staircase: each successive step drifts further right on sm+.
const OFFSETS = ["", "sm:pl-12", "sm:pl-24", "sm:pl-36"];

/**
 * Act VI — Sensory Progression.
 *
 * P1.8: the four boxed "cards" were replaced with an asymmetric editorial
 * staircase — oversized serif words with restrained hairline separators.
 */
export function Act06Sensory({ onExploreCollection }: Act06SensoryProps) {
  return (
    <section
      id="act-6"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-5xl mx-auto"
    >
      <div className="space-y-10">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-mono">
          Act VI &bull; Sensory Progression <span className="text-ivory/60">&middot; 06 / 08</span>
        </p>

        <ol className="border-t border-cacao-700">
          {SEQUENCE.map((s, i) => (
            <li
              key={s.word}
              className={`border-b border-cacao-700/70 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-[minmax(0,260px)_1fr] gap-3 sm:items-baseline transition-transform duration-500 ${OFFSETS[i]}`}
            >
              <h2 className="font-display text-4xl sm:text-5xl text-copper-bright font-normal leading-none">
                {s.word}
              </h2>
              <p className="text-xs sm:text-sm text-ivory/70 leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>

        {/* Quiet escape path to the collection (P1.1) */}
        <button
          type="button"
          onClick={onExploreCollection}
          data-noire-event="navigation_click"
          data-noire-label="act6 explore collection"
          data-noire-target="#act-7"
          className="inline-flex items-center gap-2 min-h-[44px] text-[10px] uppercase tracking-[0.3em] text-copper-text hover:text-ivory transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-copper rounded-[2px] py-1"
        >
          Continue to the Reserve Collection <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </section>
  );
}