"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  /** per-word stagger in ms */
  stagger?: number;
}

/**
 * Masked word-rise headline reveal (21st-style text reveal, brand-native).
 * Words slide up from an overflow mask with an expo ease and stagger.
 * Text content is unchanged (suite-safe). Reduced motion renders plainly.
 */
export function TextReveal({ children, className, stagger = 45 }: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) return <span className={className}>{children}</span>;

  // Split on explicit line breaks only (<br /> children stay grouped);
  // plain strings split into words. Non-string children pass through.
  const words: ReactNode[] =
    typeof children === "string"
      ? children.split(" ").map((w, i, a) => (i < a.length - 1 ? `${w}\u00A0` : w))
      : [children];

  return (
    <span ref={ref} className={cn("inline", className)} aria-label={typeof children === "string" ? children : undefined}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <span
            aria-hidden={i > 0 || undefined}
            className={cn(
              "inline-block will-change-transform transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible ? "translate-y-0" : "translate-y-[110%]"
            )}
            style={{ transitionDelay: `${i * stagger}ms` }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}
