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
      {/* Open editorial finale — hairline frame, not a box (brand) */}
      <div className="space-y-8 py-12 sm:py-16 px-2 sm:px-8 border-y border-cacao-700/40">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-sans">
          Act VIII &bull; Epilogue <span className="text-ivory/60">&middot; 08 / 08</span>
        </span>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-ivory leading-tight">
          Some things deserve
          <br />
          <span className="font-editorial italic text-copper-text">
            to be savored slowly.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-ivory/70 max-w-lg mx-auto leading-relaxed">
          Visit our quiet atelier salon in Mumbai for bespoke single-origin tasting flights and
          stone-conche pairing experiences.
        </p>

        <div className="pt-6">
          <Button
            onClick={onOpenRoom}
            data-noire-event="chocolate_room_open"
            className="bg-copper-surface hover:bg-copper-hover text-ivory text-xs uppercase tracking-widest-editorial px-10 py-6 whitespace-normal"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Enter the Chocolate Room</span>
          </Button>
        </div>
      </div>
    </section>
  );
}