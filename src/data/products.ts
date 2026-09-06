export interface TastingMetric {
  label: string;
  value: number; // 0 to 100
}

// NOTE: No price fields. NOIRÉ is a showcase/atelier site — availability and
// pricing run through the concierge (see the "Request This Bar" mailto CTA in
// ProductStage), not a checkout (Phase 3 of noire-website-plan.md).

/**
 * P6.3 — Single source of truth for the headline conche process claim.
 *
 * The brand advertises a long, unhurried stone-conche process across Act III
 * (headline + process strip), the footer nav link, and the Chocolate Room
 * flight name. Each of those strings previously duplicated the same numbers
 * independently; they are centralised here so a reconciling edit touches
 * exactly one constant instead of four files.
 *
 * Resolved 2026-09-06 (owner ruling): 72 hours wins. The per-product
 * roastProfile below matches the headline.
 */
export const CONC_PROCESS = {
  /** Headline claim — used in Act III <h2> and Chocolate Room flight name. */
  HEADLINE: "72-Hour Granite Conche",
  /** Short phrase for the footer nav link. */
  FOOTER_LABEL: "The 72-Hour Conche",
  /** Duration string for the process strip step. */
  DURATION: "72 hours uninterrupted",
  /** Narrative duration — "three days and nights" in Act III prose. */
  NARRATIVE: "three days and nights",
} as const;

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  cacaoPercentage: number;
  weight: string;
  origin: string;
  harvest: string;
  roastProfile: string;
  description: string;
  tastingNotes: string[];
  metrics: TastingMetric[];
  ingredients: string[];
  allergens: string;
  flavorAccent: string;
  accentColor: string;
  model: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "origin-72",
    name: "ORIGIN 72",
    subtitle: "Pure Single Origin Dark Chocolate",
    cacaoPercentage: 72,
    weight: "80g",
    origin: "Tumaco, Colombia",
    harvest: "Winter 2025 Micro-Lot",
    roastProfile: "Low-temperature 72-hour conche",
    description:
      "A resolute, pure bar born from deep Colombian rainforest canopy. Characterized by earthen tobacco warmth, dried figs, and an unhurried, satin melt.",
    tastingNotes: ["Black Currant", "Leather & Oak", "Dried Plum", "Dark Molasses"],
    metrics: [
      { label: "Cacao Intensity", value: 85 },
      { label: "Bitterness", value: 65 },
      { label: "Sweetness", value: 30 },
      { label: "Velvet Body", value: 92 },
    ],
    ingredients: ["Organic Tumaco Cacao Beans (72%)", "Unrefined Cane Sugar", "Single-press Cacao Butter"],
    allergens: "Processed in a dedicated tree-nut free atelier.",
    flavorAccent: "Deep Earth & Fig",
    accentColor: "#9B6742",
    model: "/models/chocolate-bar.glb",
  },
  {
    id: "dark-sea-salt",
    name: "DARK SEA SALT",
    subtitle: "70% Arriba Cacao with Flaked Maldon",
    cacaoPercentage: 70,
    weight: "80g",
    origin: "Esmeraldas, Ecuador",
    harvest: "Single Estate Spring Harvest",
    roastProfile: "Slow drum roast, hand-tempered",
    description:
      "Wild floral heirloom Arriba Nacional cacao illuminated by delicate pyramids of hand-harvested flaked sea salt that bloom across the palate in rhythmic waves.",
    tastingNotes: ["Floral Jasmine", "Wild Citrus", "Flaked Sea Mineral", "Smoked Toffee"],
    metrics: [
      { label: "Cacao Intensity", value: 78 },
      { label: "Bitterness", value: 55 },
      { label: "Sweetness", value: 38 },
      { label: "Velvet Body", value: 88 },
    ],
    ingredients: ["Ecuadorian Heirloom Cacao (70%)", "Raw Turbinado Sugar", "Cacao Butter", "Hand-harvested Sea Salt"],
    allergens: "May contain traces of dairy from shared artisanal stone mills.",
    flavorAccent: "Brine & Wild Citrus",
    accentColor: "#A68A78",
    model: "/models/chocolate-bar.glb",
  },
  {
    id: "roasted-hazelnut",
    name: "ROASTED HAZELNUT",
    subtitle: "68% Cacao with Piedmont Nocciola",
    cacaoPercentage: 68,
    weight: "80g",
    origin: "Chanchamayo, Peru & Alta Langa, Italy",
    harvest: "Late Autumn Harvest",
    roastProfile: "Wood-fired stone ground",
    description:
      "Slowly toasted Alta Langa IGP hazelnuts folded whole and crushed into dark Peruvian cacao. Intense praline aroma with a satisfying, tactile crunch.",
    tastingNotes: ["Toasted Praline", "Brown Butter", "Honeyed Walnut", "Warm Spice"],
    metrics: [
      { label: "Cacao Intensity", value: 72 },
      { label: "Bitterness", value: 45 },
      { label: "Sweetness", value: 42 },
      { label: "Velvet Body", value: 95 },
    ],
    ingredients: ["Peruvian Cacao Beans (68%)", "Piedmont Hazelnuts IGP (22%)", "Cane Sugar", "Bourbon Vanilla"],
    allergens: "Contains tree nuts (Hazelnuts).",
    flavorAccent: "Roasted Hazelnut & Praline",
    accentColor: "#B57B4C",
    model: "/models/chocolate-bar.glb",
  },
  {
    id: "madagascar-milk",
    name: "MADAGASCAR MILK",
    subtitle: "55% High-Percentage Dark-Milk",
    cacaoPercentage: 55,
    weight: "80g",
    origin: "Sambirano Valley, Madagascar",
    harvest: "Estate Fermented Reserve",
    roastProfile: "Gentle convective roast",
    description:
      "A revelation for those who think milk chocolate cannot be complex. High-cacao Sambirano beans bring raspberry and passionfruit brightness tempered by golden grass-fed cream.",
    tastingNotes: ["Red Berries", "Clotted Cream", "Clementine", "Soft Caramel"],
    metrics: [
      { label: "Cacao Intensity", value: 60 },
      { label: "Bitterness", value: 28 },
      { label: "Sweetness", value: 50 },
      { label: "Velvet Body", value: 98 },
    ],
    ingredients: ["Madagascar Cacao (55%)", "Grass-fed Whole Milk Powder", "Organic Cane Sugar", "Cacao Butter"],
    allergens: "Contains Milk.",
    flavorAccent: "Raspberry & Caramel Cream",
    accentColor: "#C29574",
    model: "/models/chocolate-bar.glb",
  },
];
