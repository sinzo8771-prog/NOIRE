"use client";

interface StoryProgressProps {
  activeAct: number; // 1 to 8
  onSelectAct: (act: number) => void;
}

const ACTS = [
  { id: 1, label: "The Craving", target: "act-1" },
  { id: 2, label: "Origin", target: "act-2" },
  { id: 3, label: "Transformation", target: "act-3" },
  { id: 4, label: "The Chocolate", target: "act-4" },
  { id: 5, label: "The Break", target: "act-5" },
  { id: 6, label: "Sensory", target: "act-6" },
  { id: 7, label: "Collection", target: "act-7" },
  { id: 8, label: "Savor", target: "act-8" },
];

export function StoryProgress({ activeAct, onSelectAct }: StoryProgressProps) {
  return (
    <aside
      aria-label="Story chapter progression"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col space-y-3 select-none"
    >
      {ACTS.map((act) => {
        const isActive = activeAct === act.id;
        return (
          <button
            key={act.id}
            onClick={() => onSelectAct(act.id)}
            className="group flex items-center justify-end space-x-3 text-right focus:outline-none"
            aria-label={`Jump to Act 0${act.id}: ${act.label}`}
          >
            <span
              className={`text-[10px] uppercase tracking-widest font-sans transition-all duration-300 ${
                isActive
                  ? "opacity-100 text-[#F3E8D3] font-medium"
                  : "opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 text-[#F3E8D3]/50"
              }`}
            >
              0{act.id} {act.label}
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
