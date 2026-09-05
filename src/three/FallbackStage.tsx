"use client";

import Image from "next/image";

interface FallbackStageProps {
  act: number;
}

export function FallbackStage({ act }: FallbackStageProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <div className="relative w-[500px] h-[500px] max-w-[80vw] max-h-[80vw] rounded-full bg-gradient-to-b from-[#1A100B] to-[#080604] border border-[#342015]/40 flex items-center justify-center p-8 opacity-80">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full border border-[#9B6742]/40 flex items-center justify-center">
            <span className="font-display text-4xl text-[#9B6742]">
              {act === 1 && "I"}
              {act === 2 && "II"}
              {act === 3 && "III"}
              {act === 4 && "IV"}
              {act === 5 && "V"}
              {act === 6 && "VI"}
              {act === 7 && "VII"}
              {act === 8 && "VIII"}
            </span>
          </div>
          <p className="text-xs uppercase tracking-widest text-[#F3E8D3]/50">
            NOIRÉ Atelier Terroir
          </p>
        </div>
      </div>
    </div>
  );
}
