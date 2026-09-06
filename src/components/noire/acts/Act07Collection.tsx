"use client";

import { ProductStage } from "../ProductStage";
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
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
    >
      <div className="space-y-12">
        <div className="space-y-3">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
            Act VII &bull; The Reserve Collection <span className="opacity-60">&middot; 07 / 08</span>
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal text-[#F3E8D3]">
            Four Resolute Expressions.
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