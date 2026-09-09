"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { mailtoLink } from "@/lib/site";
import { Reveal } from "@/components/noire/Reveal";

/**
 * Atelier notes — concierge FAQ. Every answer is verbatim site copy
 * (footer / tasting / reserve sections), so CONTENT_FACT_CHECK.md needs
 * no new rows. Plain buttons: natively keyboard-operable, no JS motion
 * to neutralise. No analytics — toggles aren't business questions.
 */
const NOTES = [
  {
    q: "How do I book a tasting?",
    a: "Tastings are by advance appointment. Write to the concierge and the atelier will arrange your visit.",
    mailto: mailtoLink(
      "Request a Tasting — NOIRÉ Atelier",
      "Hello NOIRÉ concierge,\n\nI would like to request a tasting.\n"
    ),
  },
  {
    q: "Where is the atelier?",
    a: "18 Ropewalk Lane, Heritage Arts District, Fort, Mumbai 400 001.",
    mailto: null,
  },
  {
    q: "How do reserve drops work?",
    a: "Micro-lot bars leave the atelier in numbered runs, and the reserve list hears first. Join through the concierge.",
    mailto: mailtoLink(
      "Join the Reserve List — NOIRÉ Atelier",
      "Hello NOIRÉ concierge,\n\nPlease add me to the reserve list.\n"
    ),
  },
  {
    q: "I have allergies. What should I do?",
    a: "Write to the concierge before your tasting so the atelier can guide you.",
    mailto: mailtoLink(
      "Allergy question — NOIRÉ Atelier",
      "Hello NOIRÉ concierge,\n\nI have a question about allergens before booking a tasting.\n"
    ),
  },
] as const;

export function AtelierNotes() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="atelier-notes"
      aria-labelledby="atelier-notes-heading"
      className="relative z-10 px-6 sm:px-12 py-28 sm:py-36 max-w-3xl mx-auto"
    >
      <Reveal className="text-center space-y-8">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-mono">
          Interlude &bull; Atelier Notes
        </span>
        <h2
          id="atelier-notes-heading"
          className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-ivory leading-[1.02]"
        >
          Asked, <span className="font-editorial italic text-copper-bright">answered.</span>
        </h2>
      </Reveal>

      <div className="mt-14 border-t border-cacao-700/40">
        {NOTES.map((n, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={n.q} delay={i * 60}>
              <div className="border-b border-cacao-700/40">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`atelier-note-panel-${i}`}
                  id={`atelier-note-btn-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 min-h-[44px] py-6 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-copper rounded-[2px] group"
                >
                  <span
                    className={`font-display text-xl sm:text-2xl transition-colors ${
                      isOpen ? "text-copper-bright" : "text-ivory group-hover:text-copper-bright"
                    }`}
                  >
                    {n.q}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`w-5 h-5 shrink-0 text-copper-text transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div id={`atelier-note-panel-${i}`} role="region" aria-labelledby={`atelier-note-btn-${i}`} className="pb-7 space-y-4">
                    <p className="text-sm sm:text-base text-ivory/70 leading-relaxed max-w-xl">{n.a}</p>
                    {n.mailto && (
                      <a
                        href={n.mailto}
                        className="inline-flex items-center min-h-[44px] text-[11px] uppercase tracking-[0.3em] font-sans text-copper-text hover:text-ivory transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
                      >
                        Write to the concierge <span aria-hidden="true" className="ml-2">&rarr;</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
