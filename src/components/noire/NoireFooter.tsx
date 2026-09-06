"use client";

import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { ACTS, actNumeral } from "@/data/acts";
import { CopyEmailButton, CONCIERGE_REPLY_PROMISE } from "./ConciergeContact";
import {
  mailtoLink,
  CONCIERGE_EMAIL,
  ATELIER_PHONE_CONFIGURED,
  ATELIER_PHONE_DISPLAY,
  ATELIER_PHONE_E164,
} from "@/lib/site";

export function NoireFooter() {
  const tastingMailto = mailtoLink(
    "Tasting request — NOIRÉ Atelier",
    "Hello NOIRÉ concierge,\n\nI would like to book a tasting visit at the Fort atelier.\n\nPreferred dates:\nParty size:\n\nThank you."
  );

  return (
    <footer className="relative bg-[#050302] border-t border-[#342015]/40 text-[#F3E8D3] pt-24 pb-16 px-6 sm:px-12 z-20">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Brand Manifesto Column */}
          <div className="md:col-span-6 space-y-6">
            <h3 className="font-display text-3xl sm:text-4xl tracking-[0.2em] font-normal text-[#F3E8D3]">
              NOIRÉ
            </h3>
            <p className="text-sm font-editorial italic text-[#9B6742] max-w-md text-balance leading-relaxed">
              &ldquo;Some things cannot be accelerated without stripping their soul. We roast slowly, conche for days, and temper by hand.&rdquo;
            </p>
            <p className="text-xs text-[#F3E8D3]/50 max-w-md leading-relaxed">
              All NOIRÉ cacao is sourced via transparent direct-trade partnerships with agroforestry smallholders in Tumaco, Esmeraldas, and Sambirano. No palm fats. No artificial emulsifiers.
            </p>
          </div>

          {/* Navigation Links — the same eight chapters as the rail */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-widest-editorial text-[#9B6742]">
              Story Chapters
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F3E8D3]/70">
              {ACTS.map((act) => (
                <li key={act.id}>
                  <a
                    href={`#${act.target}`}
                    data-noire-event="navigation_click"
                    data-noire-label={`footer ${act.label.toLowerCase()}`}
                    data-noire-target={`#${act.target}`}
                    className="hover:text-[#F3E8D3] transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9B6742]"
                  >
                    {actNumeral(act.id)} — {act.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Atelier details */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-widest-editorial text-[#9B6742]">
              Atelier Coordinates
            </h4>
            <p className="text-xs text-[#F3E8D3]/70 leading-relaxed">
              18 Ropewalk Lane, Heritage Arts District
              <br />
              Fort, Mumbai 400 001
            </p>
            <ul className="space-y-2.5 text-xs text-[#F3E8D3]/70">
              <li>
                <a
                  href={mailtoLink("Hello NOIRÉ Atelier")}
                  data-noire-event="contact_click"
                  data-noire-label="concierge email"
                  className="inline-flex items-center space-x-2 hover:text-[#F3E8D3] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#9B6742]" />
                  <span>{CONCIERGE_EMAIL}</span>
                </a>
              </li>
              <li>
                <CopyEmailButton label="footer concierge email" />
              </li>
              {/* Phone and WhatsApp stay hidden until the real atelier line
                  is configured (ATELIER_PHONE_CONFIGURED in src/lib/site.ts)
                  — no live links to a placeholder number. */}
              {ATELIER_PHONE_CONFIGURED && (
                <li>
                  <a
                    href={`tel:${ATELIER_PHONE_E164}`}
                    data-noire-event="phone_click"
                    className="inline-flex items-center space-x-2 hover:text-[#F3E8D3] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#9B6742]" />
                    <span>{ATELIER_PHONE_DISPLAY}</span>
                  </a>
                </li>
              )}
              {ATELIER_PHONE_CONFIGURED && (
                <li>
                  <a
                    href={`https://wa.me/${ATELIER_PHONE_E164.replace("+", "")}?text=${encodeURIComponent(
                      "Hello NOIRÉ — I'd like to arrange a tasting visit."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-noire-event="whatsapp_click"
                    className="inline-flex items-center space-x-2 hover:text-[#F3E8D3] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#9B6742]" />
                    <span>WhatsApp the atelier</span>
                  </a>
                </li>
              )}
            </ul>
            <p className="text-[10px] uppercase tracking-widest text-[#9B6742]/90">
              {CONCIERGE_REPLY_PROMISE}
            </p>
            <a
              href={tastingMailto}
              data-noire-event="request_tasting_click"
              data-noire-label="footer tasting booking"
              className="inline-block text-[10px] uppercase tracking-widest text-[#9B6742] underline underline-offset-4 hover:text-[#F3E8D3] transition-colors"
            >
              Tasting visits by advance appointment — book by email
            </a>
          </div>
        </div>

        {/* Real content behind the two former dead links (Phase 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section
            id="allergen-declarations"
            className="space-y-4 p-6 border border-[#342015]/60 bg-[#0A0705] rounded-[2px] scroll-mt-28"
          >
            <h4 className="text-[11px] uppercase tracking-widest-editorial text-[#9B6742]">
              Allergen Declarations
            </h4>
            <ul className="space-y-3 text-xs text-[#F3E8D3]/60 leading-relaxed">
              {PRODUCTS.map((p) => (
                <li key={p.id} className="space-y-0.5">
                  <span className="block text-[#F3E8D3]/80 uppercase tracking-wider text-[10px]">
                    {p.name} — {p.cacaoPercentage}%
                  </span>
                  <span>{p.allergens}</span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-[#F3E8D3]/40 leading-relaxed">
              Full ingredient lists are printed on every wrapper. If you live
              with severe allergies, write to the concierge before a tasting
              visit — flights are prepared to order.
            </p>
          </section>

          <section
            id="direct-trade"
            className="space-y-4 p-6 border border-[#342015]/60 bg-[#0A0705] rounded-[2px] scroll-mt-28"
          >
            <h4 className="text-[11px] uppercase tracking-widest-editorial text-[#9B6742]">
              Direct Trade Transparency
            </h4>
            <p className="text-xs text-[#F3E8D3]/60 leading-relaxed">
              We buy directly from agroforestry smallholder cooperatives in
              Tumaco (Colombia), Esmeraldas (Ecuador) and the Sambirano Valley
              (Madagascar) on multi-year fixed-price contracts — growers are
              paid well above commodity market rate, and every harvest lot in
              the Reserve Collection is traceable to a single estate and
              fermentation batch.
            </p>
            <p className="text-xs text-[#F3E8D3]/60 leading-relaxed">
              Questions about a specific bar? The concierge will share the
              harvest and fermentation records for any lot on request.
            </p>
          </section>
        </div>

        <Separator className="bg-[#342015]/40" />

        {/* Bottom copyright and anti-slop signature */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F3E8D3]/40 space-y-4 sm:space-y-0">
          <p>&copy; {new Date().getFullYear()} NOIRÉ ATELIER. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px] text-[#9B6742]">
            Chocolate, Unhurried.
          </p>
          <div className="flex space-x-6 text-[11px]">
            <a href="#allergen-declarations" className="hover:text-[#F3E8D3]/70 transition-colors">
              Allergen Declarations
            </a>
            <a href="#direct-trade" className="hover:text-[#F3E8D3]/70 transition-colors">
              Direct Trade Transparency
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


