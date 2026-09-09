"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PRODUCTS } from "@/data/products";

const BASE_DURATION = 36; // seconds — calm drift at rest

const CRAFT = [
  "Ferment",
  "Sun Dry",
  "Slow Roast",
  "Crush",
  "Stone Conche",
  "Concierge Only",
] as const;

/**
 * Origin marquee — dual-loop provenance band between Sensory and Collection.
 * Row one drifts forward (origins from `src/data/products.ts`, no new
 * claims); row two counter-scrolls (craft steps from Act III). Each row
 * duplicates its content with an aria-hidden half for a seamless loop.
 * Pauses on hover; the global reduced-motion kill-switch stills both.
 *
 * Alive, not busy: scroll velocity bends both drifts — faster + forward on
 * scroll down, reversed on scroll up — then eases back to the base pace.
 * The rAF loop only runs while velocity settles (no idle battery cost).
 */
export function OriginMarquee() {
  const items = [...PRODUCTS.map((p) => p.origin), "Single-Origin Cacao"];
  const tracksRef = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const tracks = tracksRef.current.filter((t): t is HTMLDivElement => !!t);
    if (tracks.length === 0) return;
    // Row base directions: origins drift forward, craft counter-scrolls.
    const baseDir = ["normal", "reverse"];
    let lastY = window.scrollY;
    let vel = 0;
    let raf = 0;
    const settle = () => {
      tracks.forEach((track, i) => {
        track.style.animationDuration = "";
        track.style.animationDirection = baseDir[i] ?? "normal";
      });
    };
    const onScroll = () => {
      vel += window.scrollY - lastY;
      lastY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      vel *= 0.92;
      // Snap tiny residuals to rest: Lenis re-sync dribbles sub-pixel
      // scroll events after every jump, which would otherwise hold the
      // loop (and a ~33s near-base pace) open forever.
      if (Math.abs(vel) < 2.5) {
        vel = 0;
        settle();
        raf = 0;
        return;
      }
      const boost = Math.min(Math.abs(vel) / 40, 4);
      const down = vel > 0;
      tracks.forEach((track, i) => {
        track.style.animationDuration = `${BASE_DURATION / (1 + boost * 2)}s`;
        // Scroll direction bends both rows; row two keeps its mirrored base.
        track.style.animationDirection =
          (baseDir[i] ?? "normal") === "normal"
            ? down
              ? "normal"
              : "reverse"
            : down
              ? "reverse"
              : "normal";
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // When reduced motion is requested (OS setting OR the site Motion
  // toggle via useReducedMotion), render the track static: no CSS
  // animation class at all, so the marquee stills exactly like every
  // other motion surface instead of drifting on alone.
  const trackClass = reduced
    ? "flex w-max items-center gap-10 whitespace-nowrap pr-10"
    : "animate-marquee flex w-max items-center gap-10 whitespace-nowrap pr-10";

  const row = (
    list: readonly string[],
    index: number,
    reverse: boolean,
    hidden: boolean
  ) => (
    <div
      ref={(el) => {
        tracksRef.current[index] = el;
      }}
      aria-hidden={hidden || undefined}
      className={trackClass}
      style={reverse && !reduced ? { animationDirection: "reverse" } : undefined}
    >
      {[...list, ...list].map((t, i) => (
        <span
          key={i}
          aria-hidden={hidden || i >= list.length || undefined}
          className="flex items-center gap-10 text-[11px] uppercase tracking-[0.3em] font-mono text-ivory/60"
        >
          {t}
          <span aria-hidden="true" className="text-copper-text">
            &middot;
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section
      id="origins"
      aria-label="Cacao origins"
      className="relative z-10 border-y border-cacao-700/40 py-5 overflow-hidden space-y-4"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      {row(items, 0, false, false)}
      {row(CRAFT, 1, true, true)}
    </section>
  );
}
