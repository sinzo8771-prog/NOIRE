"use client";

import { Separator } from "@/components/ui/separator";

export function NoireFooter() {
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

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-widest-editorial text-[#9B6742]">
              Atelier & Salon
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F3E8D3]/70">
              <li>
                <a href="#act-1" className="hover:text-[#F3E8D3] transition-colors">
                  The Story
                </a>
              </li>
              <li>
                <a href="#act-2" className="hover:text-[#F3E8D3] transition-colors">
                  Origin & Terroir
                </a>
              </li>
              <li>
                <a href="#act-3" className="hover:text-[#F3E8D3] transition-colors">
                  The 72-Hour Conche
                </a>
              </li>
              <li>
                <a href="#act-7" className="hover:text-[#F3E8D3] transition-colors">
                  Reserve Editions
                </a>
              </li>
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
              <br />
              concierge@noire-chocolate.com
            </p>
            <p className="text-[10px] uppercase tracking-widest text-[#F3E8D3]/40 pt-2">
              Tasting visits by advance appointment
            </p>
          </div>
        </div>

        <Separator className="bg-[#342015]/40" />

        {/* Bottom copyright and anti-slop signature */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F3E8D3]/40 space-y-4 sm:space-y-0">
          <p>&copy; {new Date().getFullYear()} NOIRÉ ATELIER. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px] text-[#9B6742]">
            Chocolate, Unhurried.
          </p>
          <div className="flex space-x-6 text-[11px]">
            <span className="hover:text-[#F3E8D3]/70 cursor-pointer">Allergen Declarations</span>
            <span className="hover:text-[#F3E8D3]/70 cursor-pointer">Direct Trade Transparency</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
