"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface Act08SavorProps {
  onOpenRoom: () => void;
}

/**
 * Act VIII — Epilogue & the Chocolate Room.
 */
export function Act08Savor({ onOpenRoom }: Act08SavorProps) {
  return (
    <section
      id="act-8"
      className="relative z-10 min-h-[85vh] flex flex-col justify-center items-center text-center px-6 sm:px-12 py-32 max-w-4xl mx-auto"
    >
      <div className="space-y-8 p-8 sm:p-12 bg-[#080604]/80 border border-[#342015] backdrop-blur-md rounded-[2px]">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
          Act VIII &bull; Epilogue
        </span>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F3E8D3] leading-tight">
          Some things deserve
          <br />
          <span className="font-editorial italic text-[#9B6742]">
            to be savored slowly.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-[#F3E8D3]/70 max-w-lg mx-auto leading-relaxed">
          Visit our quiet atelier salon in Mumbai for bespoke single-estate tasting flights and
          stone-conche pairing experiences.
        </p>

        <div className="pt-6">
          <Button
            onClick={onOpenRoom}
            data-noire-event="chocolate_room_open"
            className="bg-[#9B6742] hover:bg-[#835534] text-[#F3E8D3] text-xs uppercase tracking-widest-editorial px-10 py-6 whitespace-normal"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Enter the Chocolate Room</span>
          </Button>
        </div>
      </div>
    </section>
  );
}