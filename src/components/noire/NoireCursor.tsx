"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function NoireCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Only enable on fine pointer devices (desktop mouse)
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch || reducedMotion) return;

    // Track position in a ref and paint on rAF: mousemove fires far more
    // often than frames render, so coalescing keeps the main thread free
    let pendingX = -100;
    let pendingY = -100;
    let rafId: number | null = null;

    const paint = () => {
      rafId = null;
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${pendingX}px, ${pendingY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      // Functional update: React bails out when the state is already true,
      // so this does not re-render or re-run the effect per mousemove
      setIsVisible(true);
      if (rafId === null) {
        rafId = requestAnimationFrame(paint);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest("[role='tab']") ||
        target?.closest("canvas")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
    // Only re-register when the motion preference changes; visibility is
    // handled with functional state updates so listeners stay stable
  }, [reducedMotion]);

  if (!isVisible || reducedMotion) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
    >
      <div
        className={`rounded-full border border-copper transition-all duration-300 ease-out ${
          isHovering
            ? "h-8 w-8 bg-copper/15 scale-125 border-ivory/80"
            : "h-3 w-3 bg-ivory scale-100"
        }`}
      />
    </div>
  );
}
