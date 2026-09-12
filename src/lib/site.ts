export const SITE_URL = "https://noireee.vercel.app";

export const CONCIERGE_EMAIL = "concierge@noire-chocolate.com";

// The atelier has no public phone/WhatsApp channel. All contact runs through
// the concierge email (mailto: CTAs across the site) — nothing to configure.

export function mailtoLink(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${CONCIERGE_EMAIL}?${params.toString()}`;
}
