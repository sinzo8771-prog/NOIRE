"use client";

import { useEffect, useRef } from "react";

/**
 * P2 wayfinding: a slim scroll-progress hairline for viewports below xl,
 * where the StoryProgress rail is hidden. Reads native scroll position via
 * rAF and writes only to the bar's transform — scrolling never triggers a
 * React re-render. Decorative duplicate of the rail/counters, hence hidden
 * from assistive tech.
 */
export function ScrollProgressHairline() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    let parked = true;
    const read = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    // Write only on change; park the loop when settled, wake on scroll.
    const tick = () => {
      raf = 0;
      const progress = read();
      if (progress !== last) {
        last = progress;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${progress})`;
        }
        raf = requestAnimationFrame(tick);
      } else {
        parked = true;
      }
    };
    const wake = () => {
      if (parked) {
        parked = false;
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      window.removeEventListener("scroll", wake);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] xl:hidden"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-copper"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
