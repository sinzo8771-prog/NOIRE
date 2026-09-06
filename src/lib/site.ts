export const SITE_URL = "https://noireee.vercel.app";

export const CONCIERGE_EMAIL = "concierge@noire-chocolate.com";

// P1 hardening: the atelier line is still a placeholder. Phone and WhatsApp
// rows render ONLY when this flag is true — a false affordance to a fake
// number is worse than no number. Flip it the day the real line is live.
// NOTE (owner action required): replace the placeholder business line below
// with the real atelier number before launch. Referenced by tel: and wa.me
// links in NoireFooter (gated on ATELIER_PHONE_CONFIGURED).
export const ATELIER_PHONE_CONFIGURED = false;
export const ATELIER_PHONE_DISPLAY = "+91 98200 00000";
export const ATELIER_PHONE_E164 = "+919820000000";

export function mailtoLink(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${CONCIERGE_EMAIL}?${params.toString()}`;
}
