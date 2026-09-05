"use client";

import { Product, PRODUCTS } from "@/data/products";

interface ProductSwitcherProps {
  selectedProduct: Product;
  onSelectProduct: (product: Product) => void;
}

export function ProductSwitcher({
  selectedProduct,
  onSelectProduct,
}: ProductSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="NOIRÉ reserve chocolate bars"
      className="flex flex-wrap gap-4 sm:gap-8 border-b border-[#342015] pb-4"
    >
      {PRODUCTS.map((prod) => {
        const isActive = selectedProduct.id === prod.id;
        return (
          <button
            key={prod.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectProduct(prod)}
            className={`group relative pb-2 text-xs sm:text-sm uppercase tracking-widest-editorial transition-all duration-300 focus:outline-none ${
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
