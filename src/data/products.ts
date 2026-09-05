export interface TastingMetric {
  label: string;
  value: number; // 0 to 100
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  cacaoPercentage: number;
  price: number;
  currency: string;
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
    price: 890,
    currency: "INR",
    weight: "80g",
    origin: "Tumaco, Colombia",
    harvest: "Winter 2025 Micro-Lot",
    roastProfile: "Low-temperature 48h conche",
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
    price: 920,
    currency: "INR",
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
    allergens: "May contain trace traces of dairy from shared artisanal stone mills.",
    flavorAccent: "Brine & Wild Citrus",
    accentColor: "#A68A78",
    model: "/models/chocolate-bar.glb",
  },
  {
    id: "roasted-hazelnut",
    name: "ROASTED HAZELNUT",
    subtitle: "68% Cacao with Piedmont Nocciola",
    cacaoPercentage: 68,
    price: 950,
    currency: "INR",
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
    price: 890,
    currency: "INR",
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
    ingredients: ["Madagascar Cacao (55%)", "Grass-fed Whole Milk Powder", "Organic Cane Sugar", "Cocoa Butter"],
    allergens: "Contains Milk.",
    flavorAccent: "Raspberry & Caramel Cream",
    accentColor: "#C29574",
    model: "/models/chocolate-bar.glb",
  },
];
