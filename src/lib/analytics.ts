"use client";

/**
 * Lightweight analytics event layer (P7).
 *
 * NOIRÉ has no analytics vendor configured (no GA ID was provided), so this
 * module records business-relevant interaction events into an in-page queue
 * and broadcasts them as a CustomEvent. A future integration can consume
 * `window.__NOIRE_EVENTS__` / the "noire:track" event without touching the
 * components.
 *
 * Only business-question events are emitted — never scroll ticks, frame
 * progress, particle updates, or animation frames (plan §47).
 */

export type NoireEventName =
  | "navigation_click"
  | "request_tasting_click"
  | "request_bar_click"
  | "product_selected"
  | "chocolate_room_open"
  | "contact_click"
  | "whatsapp_click"
  | "phone_click";

export interface NoireEvent {
  name: NoireEventName;
  /** epoch ms — dedupe/sortable */
  ts: number;
  props?: Record<string, string | number | undefined>;
}

declare global {
  interface Window {
    __NOIRE_EVENTS__?: NoireEvent[];
  }
}

export function trackEvent(
  name: NoireEventName,
  props?: Record<string, string | number | undefined>
): void {
  if (typeof window === "undefined") return;
  const event: NoireEvent = { name, ts: Date.now(), props };
  const queue = (window.__NOIRE_EVENTS__ ??= []);
  queue.push(event);
  window.dispatchEvent(
    new CustomEvent<NoireEvent>("noire:track", { detail: event })
  );
}

/**
 * One delegated click listener covers every element carrying
 * `data-noire-event`. Attribute metadata:
 *   data-noire-label    — optional human label
 *   data-noire-product  — product id where relevant
 *   data-noire-target   — navigation target (act/section or href)
 */
export function initAnalytics(): () => void {
  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const el = target?.closest?.("[data-noire-event]") as HTMLElement | null;
    if (!el) return;
    const name = el.dataset.noireEvent as NoireEventName | undefined;
    if (!name) return;
    trackEvent(name, {
      label: el.dataset.noireLabel,
      product: el.dataset.noireProduct,
      target: el.dataset.noireTarget ?? el.getAttribute("href") ?? undefined,
    });
  };
  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}