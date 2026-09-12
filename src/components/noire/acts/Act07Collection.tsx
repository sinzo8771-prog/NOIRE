"use client";

import { ProductStage } from "../ProductStage";
import { TextReveal } from "@/components/noire/TextReveal";
import { Product } from "@/data/products";

interface Act07CollectionProps {
  selectedProduct: Product;
  onSelectProduct: (product: Product) => void;
}

/**
 * Act VII — The Reserve Collection (showcase, not commerce).
 */
export function Act07Collection({
  selectedProduct,
  onSelectProduct,
}: Act07CollectionProps) {
  return (
    <section
      id="act-7"
      aria-label="Act VII: Collection"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
    >
      <div className="space-y-12">
        <div className="space-y-3">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-copper-text font-mono">
            Act VII &bull; The Reserve Collection <span className="text-ivory/60">&middot; 07 / 08</span>
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal text-ivory">
            <TextReveal>Four Resolute Expressions.</TextReveal>
          </h2>
        </div>

        <ProductStage
          selectedProduct={selectedProduct}
          onSelectProduct={onSelectProduct}
        />
      </div>
    </section>
  );
}