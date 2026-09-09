"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface HeroCutRevealProps {
  /** single line of headline text (split lines into separate instances) */
  children: string;
  className?: string;
}

/**
 * 21st/Cnippet-style vertical cut reveal, brand-tuned for NOIRÉ heroes —
 * dependency-free. Characters wipe upward from overflow masks, staggered
 * outward from the center on the brand expo curve.
 *
 * Zero animation libraries by design: the motion package cost +44 kB First
 * Load for one headline. Full text lives in an sr-only node; animated
 * chars are aria-hidden duplicates. Reduced motion renders plain text.
 */
export function HeroCutReveal({ children, className }: HeroCutRevealProps) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [reduced ]);

  if (reduced) return <>{children}</>;

  const chars = Array.from(children);
  const center = (chars.length - 1) / 2;
  const order = chars
    .map((_, i) => i)
    .sort((a, b) => Math.abs(a - center) - Math.abs(b - center));

  return (
    <span className={cn("inline", className)}>
      <span className="sr-only">{children}</span>
      {chars.map((ch, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <span
            className={cn(
              "inline-block will-change-transform transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible ? "translate-y-0" : "translate-y-[110%]"
            )}
            style={{ transitionDelay: `${order.indexOf(i) * 35}ms` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
