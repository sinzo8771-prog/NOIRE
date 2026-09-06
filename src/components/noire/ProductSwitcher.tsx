"use client";

import { Product, PRODUCTS } from "@/data/products";

interface ProductSwitcherProps {
  selectedProduct: Product;
  onSelectProduct: (product: Product) => void;
}

/**
 * P1.9 — the tablist/tab/tabpanel wiring is fully accessible: each tab has a
 * visible:focus state, aria-selected, an id, and aria-controls referencing the
 * shared panel rendered by ProductStage.
 */
export function ProductSwitcher({
  selectedProduct,
  onSelectProduct,
}: ProductSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="NOIRÉ reserve chocolate bars"
      className="flex flex-wrap gap-2 sm:gap-8 border-b border-[#342015] pb-4"
    >
      {PRODUCTS.map((prod) => {
        const isActive = selectedProduct.id === prod.id;
        return (
          <button
            key={prod.id}
            id={`tab-${prod.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="noire-product-panel"
            onClick={() => onSelectProduct(prod)}
            data-noire-event="product_selected"
            data-noire-product={prod.id}
            className={`group relative py-2 px-1 text-xs sm:text-sm uppercase tracking-widest-editorial transition-all duration-300 rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9B6742] cursor-pointer ${
              isActive
                ? "text-[#F3E8D3] font-medium"
                : "text-[#F3E8D3]/40 hover:text-[#F3E8D3]/80"
            }`}
          >
            <span>{prod.name}</span>
            <span className="ml-2 text-[10px] text-[#9B6742]">
              {prod.cacaoPercentage}%
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#9B6742]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
