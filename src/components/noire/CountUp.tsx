"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CountUpProps {
  /** target value (e.g. 72 from products.ts) */
  value: number;
  /** rendered after the number, e.g. "%" */
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * Ease-out count-up for factual metrics (cacao %). Animates from 0 on first
 * entry into view; reduced motion renders the final value immediately.
 * Value always comes from data — never hardcoded.
 */
export function CountUp({ value, suffix = "", className, duration = 1400 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const started = useRef(false);
  const runId = useRef(0);

  // Replay whenever the target value changes (e.g. product switch).
  useEffect(() => {
    started.current = false;
    setN(reduced ? value : 0);
    const el = ref.current;
    if (reduced || !el) return;
    let raf = 0;
    const id = ++runId.current;
    const run = () => {
      const t0 = performance.now();
      const step = (t: number) => {
        if (id !== runId.current) return;
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        setN(Math.round(eased * value));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  );
}
