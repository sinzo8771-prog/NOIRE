"use client";

/**
 * Act II — Origin & Canopy (static editorial section).
 */
export function Act02Origin() {
  return (
    <section
      id="act-2"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-8">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-mono">
            Act II &bull; Origin & Canopy <span className="text-ivory/60">&middot; 02 / 08</span>
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal text-ivory leading-tight">
            Where the wild pod awakens.
          </h2>
          <p className="text-sm sm:text-base text-ivory/70 leading-relaxed max-w-md">
            High in the biodiverse rainforests of Tumaco and Esmeraldas, Theobroma cacao
            grows under the shade of banana palms and mahogany trees. Rich volcanic soil, equatorial
            rainfall, and unhurried natural pollination.
          </p>

          {/* Terroir strip — hairline rules, not boxes (brand) */}
          <div
            role="list"
            aria-label="Terroir principles"
            className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-y border-cacao-700/40 py-5"
          >
            {["SOIL", "HEAT", "TIME", "HANDS"].map((word) => (
              <span
                key={word}
                role="listitem"
                className="font-display text-lg tracking-widest text-copper-text"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 flex justify-end">
          <div className="space-y-4 max-w-sm bg-cacao-950/40 backdrop-blur-sm p-6 border-l border-cacao-700 rounded-[2px]">
            <span className="text-[10px] uppercase tracking-widest text-copper-text">
              Terroir Note
            </span>
            <p className="font-editorial italic text-sm text-ivory/70 leading-relaxed">
              &ldquo;A cacao tree requires five seasons to produce its first harvest. We honor that
              patience by never accelerating the cure.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}