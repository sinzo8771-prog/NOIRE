"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PRODUCTS } from "@/data/products";

const BASE_PX_PER_SEC = 60;

/**
 * Origin marquee — dual-loop provenance band between Sensory and Collection.
 * Row one drifts forward (origins from `src/data/products.ts`, no new
 * claims); row two counter-scrolls (craft steps from Act III). Each row
 * duplicates its content with an aria-hidden half for a seamless loop.
 *
 * Driven directly by rAF (translateX in pixels, modulo half-width) instead
 * of CSS animations: retiming a CSS animation restarts its iteration and
 * judders, while an integrator loop stays perfectly smooth under scroll
 * velocity bends, direction flips, and hover pauses alike.
 *
 * Reduced motion (OS setting OR site Motion toggle): no loop at all,
 * tracks render static. Loop pauses while hovered. The rAF loop runs only
 * while the band is on screen.
 */
export function OriginMarquee() {
  const items = [...PRODUCTS.map((p) => p.origin), "Single-Origin Cacao"];
  const craft = [
    "Ferment",
    "Sun Dry",
    "Slow Roast",
    "Crush",
    "Stone Conche",
    "Concierge Only",
  ] as const;
  const sectionRef = useRef<HTMLElement>(null);
  const tracksRef = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const tracks = tracksRef.current.filter((t): t is HTMLDivElement => !!t);
    if (!section || tracks.length === 0) return;

    let lastY = window.scrollY;
    let vel = 0; // px per frame, decayed
    let offset = 0;
    let lastT = performance.now();
    let raf = 0;
    let hovered = false;
    let visible = false;

    const half = (el: HTMLDivElement) => el.scrollWidth / 2;

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.1, (now - lastT) / 1000);
      lastT = now;
      vel *= 0.94;
      if (Math.abs(vel) < 0.5) vel = 0;
      const boost = Math.min(Math.abs(vel) / 40, 4);
      const dir = vel === 0 ? 0 : Math.sign(vel);
      // px/sec: base drift plus scroll-energy kick, toward scroll direction
      const speed = hovered ? 0 : BASE_PX_PER_SEC * (1 + boost * 2) * (dir === 0 ? 1 : dir);
      offset += speed * dt;
      tracks.forEach((track, i) => {
        const h = half(track);
        if (h <= 0) return;
        const o = ((offset % h) + h) % h;
        // Row two mirrors: starts one half back so both loops stay seamless.
        track.style.transform = `translate3d(${i === 0 ? -o : -(h - o)}px, 0, 0)`;
      });
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onScroll = () => {
      vel += window.scrollY - lastY;
      lastY = window.scrollY;
      kick();
    };
    const onEnter = () => {
      hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      },
      { threshold: 0 }
    );
    io.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointerleave", onLeave);
    kick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointerleave", onLeave);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const row = (list: readonly string[], index: number, hidden: boolean) => (
    <div
      ref={(el) => {
        tracksRef.current[index] = el;
      }}
      aria-hidden={hidden || undefined}
      className="flex w-max items-center gap-10 whitespace-nowrap pr-10 will-change-transform"
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
      ref={sectionRef}
      aria-label="Cacao origins"
      className="relative z-10 border-y border-cacao-700/40 py-5 overflow-hidden space-y-4"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      {row(items, 0, false)}
      {row(craft, 1, true)}
    </section>
  );
}
