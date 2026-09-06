/**
 * Canonical story chapters — the single vocabulary for the 8-act journey.
 *
 * P1 nav-unification: desktop header groups, mobile overlay, footer links,
 * and the StoryProgress rail all derive from this list, so every surface
 * names the same acts in the same order with the same targets.
 */
export interface ActChapter {
  id: number;
  label: string;
  target: string;
}

export const ACTS: ActChapter[] = [
  { id: 1, label: "The Craving", target: "act-1" },
  { id: 2, label: "Origin", target: "act-2" },
  { id: 3, label: "Transformation", target: "act-3" },
  { id: 4, label: "The Chocolate", target: "act-4" },
  { id: 5, label: "The Break", target: "act-5" },
  { id: 6, label: "Sensory", target: "act-6" },
  { id: 7, label: "Collection", target: "act-7" },
  { id: 8, label: "Savor", target: "act-8" },
];

export function actNumeral(id: number): string {
  return id < 10 ? `0${id}` : `${id}`;
}
