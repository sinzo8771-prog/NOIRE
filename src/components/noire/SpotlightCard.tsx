"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  role?: string;
  ariaLabelledby?: string;
}

/**
 * Cursor-tracking copper spotlight (21st spotlight-card pattern,
 * brand-native). A radial glow follows the pointer inside the frame;
 * the overlay is pointer-events-none and purely decorative (aria-hidden).
 * No listeners on touch devices or under reduced motion.
 */
export function SpotlightCard({ children, className, id, role, ariaLabelledby }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = -400;
    let y = -400;
    const paint = () => {
      raf = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      x = -400;
      y = -400;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={ref} id={id} role={role} aria-labelledby={ariaLabelledby} className={cn("group relative", className)}>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, -400px) var(--my, -400px), rgba(210,154,107,0.14), transparent 65%)",
        }}
      />
    </div>
  );
}
