"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type CloudsProps = {
  children?: ReactNode;
  opacity?: number;
  speed?: number;
  density?: number;
  cover?: number;
  wind?: number;
};

/**
 * Trial wrapper for the canvas-ui Clouds component (trial only — not default).
 *
 * Activates ONLY with `?trial=clouds`, and only when all guards pass:
 * fine pointer (no mobile GPU cost), no reduced-motion preference, and
 * browser-idle mount via dynamic import (zero First Load JS impact —
 * `@/components/canvasui/Clouds` lives in its own async chunk).
 *
 * Whisper-quiet settings: low opacity/coverage, slow drift. The component
 * cleans up its own WebGL context on unmount; without the param this
 * renders a bare fragment (zero DOM/behavior change).
 */
export function HeroMist({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [Clouds, setClouds] = useState<ComponentType<CloudsProps> | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("trial") !== "clouds") return;
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let cancelled = false;
    const mount = () => {
      import("@/components/canvasui/Clouds").then(
        (m) => {
          if (!cancelled) setClouds(() => m.Clouds as ComponentType<CloudsProps>);
        },
        () => undefined
      );
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(mount, { timeout: 3000 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }
    const t = window.setTimeout(mount, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [prefersReducedMotion]);

  if (!Clouds) return <>{children}</>;
  return (
    <Clouds opacity={0.32} speed={0.35} density={1.6} cover={0.05} wind={0.5}>
      {children}
    </Clouds>
  );
}
