"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PRODUCTS } from "@/data/products";

const BASE_DURATION = 36; // seconds — calm drift at rest

/**
 * Origin marquee — infinite provenance strip between Sensory and Collection.
 * Origins derive from `src/data/products.ts` (no new claims). The second
 * half is aria-hidden duplication for a seamless loop. Pauses on hover;
 * the global reduced-motion kill-switch stills it for those who ask.
 *
 * Alive, not busy: scroll velocity bends the drift — faster + forward on
 * scroll down, reversed on scroll up — then eases back to the base pace.
 * The rAF loop only runs while velocity settles (no idle battery cost).
 */
export function OriginMarquee() {
  const items = [...PRODUCTS.map((p) => p.origin), "Single-Origin Cacao"];
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;
    let lastY = window.scrollY;
    let vel = 0;
    let raf = 0;
    const onScroll = () => {
      vel += window.scrollY - lastY;
      lastY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      vel *= 0.92;
      if (Math.abs(vel) < 0.4) {
        vel = 0;
        track.style.animationDuration = "";
        raf = 0;
        return;
      }
      const boost = Math.min(Math.abs(vel) / 40, 4);
      track.style.animationDuration = `${BASE_DURATION / (1 + boost * 2)}s`;
      track.style.animationDirection = vel > 0 ? "normal" : "reverse";
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section
      id="origins"
      aria-label="Cacao origins"
      className="relative z-10 border-y border-cacao-700/40 py-5 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        ref={trackRef}
        className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap pr-10"
      >
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
