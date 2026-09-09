"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL = 90; // seconds — a slow, deliberate tasting
const PHASES = [
  { until: 30, label: "Breathe in — aroma first." },
  { until: 60, label: "Let it rest — melt slowly." },
  { until: TOTAL, label: "Notice what lingers." },
] as const;

const R = 54;
const CIRC = 2 * Math.PI * R;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/**
 * Guided 90-second tasting timer for the Tasting Ritual interlude.
 * Timestamp math (not tick counting) so background tabs don't drift.
 * Clearly a contemplative ritual guide — no factual claims, no analytics.
 */
export function TastingTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, (endAt.current - Date.now()) / 1000);
      setElapsed(TOTAL - left);
      if (left <= 0) setRunning(false);
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const startPause = () => {
    if (running) {
      setRunning(false);
    } else {
      endAt.current = Date.now() + (TOTAL - elapsed) * 1000;
      setRunning(true);
    }
  };
  const reset = () => {
    setRunning(false);
    setElapsed(0);
  };

  const phase = PHASES.find((p) => elapsed < p.until) ?? PHASES[PHASES.length - 1];
  const done = elapsed >= TOTAL;
  const progress = Math.min(1, elapsed / TOTAL);

  return (
    <div
      id="tasting-timer"
      className="mt-14 mx-auto max-w-sm border-t border-cacao-700/40 pt-10"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/60 font-mono">
        The ninety-second ritual
      </p>
      <div className="relative mx-auto mt-6 h-40 w-40">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="64" cy="64" r={R} fill="none" strokeWidth="2" className="stroke-cacao-700" />
          <circle
            cx="64"
            cy="64"
            r={R}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-copper-text transition-[stroke-dashoffset] duration-300"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl text-ivory" data-testid="timer-time">
            {fmt(TOTAL - elapsed)}
          </span>
        </div>
      </div>
      <p aria-live="polite" className="mt-4 font-editorial italic text-lg text-copper-bright" data-testid="timer-phase">
        {done ? "Slowly savored." : phase.label}
      </p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={startPause}
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-8 py-2.5 text-[11px] uppercase tracking-[0.3em] font-sans bg-copper-surface hover:bg-copper-hover text-ivory transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
        >
          {running ? "Pause" : elapsed > 0 && !done ? "Resume" : "Begin"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] font-sans text-copper-text hover:text-ivory transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-copper"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
