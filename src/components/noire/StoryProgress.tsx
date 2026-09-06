"use client";

import { ACTS, actNumeral } from "@/data/acts";

interface StoryProgressProps {
  activeAct: number; // 1 to 8
  onSelectAct: (act: number) => void;
}

export function StoryProgress({ activeAct, onSelectAct }: StoryProgressProps) {
  return (
    <aside
      aria-label="Story chapter progression"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col space-y-1 select-none"
    >
      {ACTS.map((act) => {
        const isActive = activeAct === act.id;
        return (
          <button
            key={act.id}
            onClick={() => onSelectAct(act.id)}
            className="group flex items-center justify-end space-x-3 py-2 text-right rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9B6742]"
            aria-label={`Jump to Act ${actNumeral(act.id)}: ${act.label}`}
            aria-current={isActive ? "location" : undefined}
          >
            <span
              className={`text-[10px] uppercase tracking-widest font-sans transition-all duration-300 ${
                isActive
                  ? "opacity-100 text-[#F3E8D3] font-medium"
                  : "opacity-40 group-hover:opacity-70 text-[#F3E8D3]/60"
              }`}
            >
              {actNumeral(act.id)} {act.label}
            </span>
            <span
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? "w-5 h-[2px] bg-[#9B6742]"
                  : "w-2 h-[1px] bg-[#342015] group-hover:bg-[#F3E8D3]/50"
              }`}
            />
          </button>
        );
      })}
    </aside>
  );
}
