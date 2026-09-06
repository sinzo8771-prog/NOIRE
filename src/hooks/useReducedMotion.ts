"use client";

import { useState, useEffect } from "react";

export const MOTION_PREF_KEY = "noire-motion";

/** Dispatched on window after the stored motion preference changes. */
export const MOTION_PREF_EVENT = "noire-motion-change";

/** "off" = force reduced, "on" = force motion, null = follow the OS. */
export function readMotionOverride(): "off" | "on" | null {
  try {
    const v = localStorage.getItem(MOTION_PREF_KEY);
    return v === "off" || v === "on" ? v : null;
  } catch {
    return null;
  }
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const override = readMotionOverride();
      // Explicit visitor override wins in BOTH directions — this lets someone
      // on a machine whose OS forces reduced motion still opt into the
      // cinematic scrubber (and vice versa).
      setPrefersReducedMotion(override ? override === "off" : mediaQuery.matches);
    };

    update();

    const handler = () => update();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    }
    window.addEventListener(MOTION_PREF_EVENT, update);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      }
      window.removeEventListener(MOTION_PREF_EVENT, update);
    };
  }, []);

  return prefersReducedMotion;
}
