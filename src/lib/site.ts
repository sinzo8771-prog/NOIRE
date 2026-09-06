export const SITE_URL = "https://noireee.vercel.app";

export const CONCIERGE_EMAIL = "concierge@noire-chocolate.com";

// NOTE (owner action required): placeholder business line — replace with the
// real atelier number before launch. Referenced by tel: and wa.me links.
export const ATELIER_PHONE_DISPLAY = "+91 98200 00000";
export const ATELIER_PHONE_E164 = "+919820000000";

export function mailtoLink(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${CONCIERGE_EMAIL}?${params.toString()}`;
}
