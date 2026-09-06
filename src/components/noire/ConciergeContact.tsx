"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CONCIERGE_EMAIL } from "@/lib/site";

/**
 * P1 concierge-handoff hardening: the reply promise shown beside every
 * conversion point. One shared sentence so the SLA never drifts per surface.
 */
export const CONCIERGE_REPLY_PROMISE = "Replies within one day, personally.";

async function copyAddress(): Promise<boolean> {
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard?.writeText
    ) {
      await navigator.clipboard.writeText(CONCIERGE_EMAIL);
      return true;
    }
  } catch {
    // Clipboard API unavailable or denied — fall through to legacy path.
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = CONCIERGE_EMAIL;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

interface CopyEmailButtonProps {
  className?: string;
  /** Analytics label distinguishing where the copy happened. */
  label?: string;
}

/**
 * Copies the concierge address. The address itself is always rendered as
 * visible text next to this button, so a denied clipboard is a minor
 * inconvenience, never a dead end.
 */
export function CopyEmailButton({ className = "", label }: CopyEmailButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");

  const onCopy = async () => {
    const ok = await copyAddress();
    setState(ok ? "copied" : "manual");
    window.setTimeout(() => setState("idle"), 2600);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      data-noire-event="concierge_copy_click"
      data-noire-label={label ?? "copy concierge email"}
      aria-label="Copy concierge email address"
      className={`inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-widest text-[#F3E8D3]/60 hover:text-[#F3E8D3] transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9B6742] ${className}`}
    >
      {state === "copied" ? (
        <Check className="w-3.5 h-3.5 text-[#9B6742]" aria-hidden="true" />
      ) : (
        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
      )}
      <span aria-live="polite">
        {state === "copied"
          ? "Copied"
          : state === "manual"
            ? "Copy it manually"
            : "Copy"}
      </span>
    </button>
  );
}

interface ConciergeFallbackProps {
  className?: string;
  label?: string;
}

/**
 * Rendered beside every mailto CTA: the address in the open (no hidden
 * destination), a copy path, and the reply promise. Short human voice kept.
 */
export function ConciergeFallback({ className = "", label }: ConciergeFallbackProps) {
  return (
    <p
      className={`text-[11px] leading-relaxed text-[#F3E8D3]/50 ${className}`}
    >
      <span>No email app open? Write directly to </span>
      <a
        href={`mailto:${CONCIERGE_EMAIL}`}
        data-noire-event="contact_click"
        data-noire-label={label ? `${label} fallback address` : "fallback address"}
        className="text-[#F3E8D3]/80 hover:text-[#F3E8D3] underline underline-offset-4 decoration-[#9B6742]/60 transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9B6742]"
      >
        {CONCIERGE_EMAIL}
      </a>
      <span aria-hidden="true"> · </span>
      <CopyEmailButton label={label} />
      <span className="block mt-1 text-[#9B6742]/90 uppercase tracking-widest text-[10px]">
        {CONCIERGE_REPLY_PROMISE}
      </span>
    </p>
  );
}
