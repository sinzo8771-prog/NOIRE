"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Product } from "@/data/products";
import { ProductSwitcher } from "./ProductSwitcher";
import { TastingNotes } from "./TastingNotes";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";
import { mailtoLink } from "@/lib/site";

// The 3D viewer (three.js + drei + GLB loader) is a separate async chunk that
// only downloads once the section approaches the viewport (Phase 1.2).
const Product3DViewer = dynamic(() => import("./Product3DViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[#F3E8D3]/30 text-[10px] uppercase tracking-widest">
      Preparing the reserve bar…
    </div>
  ),
});

interface ProductStageProps {
  selectedProduct: Product;
  onSelectProduct: (product: Product) => void;
}

export function ProductStage({
  selectedProduct,
  onSelectProduct,
}: ProductStageProps) {
  const viewerAreaRef = useRef<HTMLDivElement | null>(null);
  const [viewerNear, setViewerNear] = useState(false);

  // Activate the heavy 3D viewer only when Act VII is within ~400px of the
  // viewport — below-the-fold visitors never pay for it (Phase 1.2).
  useEffect(() => {
    const el = viewerAreaRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setViewerNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setViewerNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const inquiryHref = mailtoLink(
    `Inquiry — ${selectedProduct.name} (${selectedProduct.cacaoPercentage}% Cacao)`,
    `Hello NOIRÉ concierge,\n\nI would like to inquire about ${selectedProduct.name} — ${selectedProduct.subtitle} (${selectedProduct.cacaoPercentage}% cacao, ${selectedProduct.origin}).\n\nPlease tell me about availability and the next tasting dates.\n\nThank you.`
  );

  return (
    <div className="space-y-10">
      <ProductSwitcher
        selectedProduct={selectedProduct}
        onSelectProduct={onSelectProduct}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left: 3D Product Canvas */}
        <div className="lg:col-span-6" ref={viewerAreaRef}>
          <div className="w-full h-[380px] sm:h-[460px]">
            {viewerNear ? (
              <Product3DViewer
                modelPath={selectedProduct.model}
                productName={selectedProduct.name}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center border border-[#342015] rounded-[2px] bg-[#0F0A07] text-[#F3E8D3]/30 text-[10px] uppercase tracking-widest">
                Reserve bar preview
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Narrative & Tasting Notes */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#9B6742] text-[11px] uppercase tracking-widest font-sans">
              <Sparkles className="w-3 h-3" />
              <span>{selectedProduct.harvest}</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl tracking-wide font-normal text-[#F3E8D3]">
              {selectedProduct.name}
            </h3>
            <p className="font-editorial italic text-base text-[#9B6742]">
              {selectedProduct.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-[#F3E8D3]/70 leading-relaxed pt-2">
              {selectedProduct.description}
            </p>
          </div>

          {/* Tasting Notes and Metrics */}
          <TastingNotes product={selectedProduct} />

          {/* Inquiry CTA — no fake commerce (Phase 3) */}
          <div className="pt-6 border-t border-[#342015] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="block text-[10px] uppercase tracking-widest text-[#F3E8D3]/40">
                Artisanal Bar
              </span>
              <span className="text-xs text-[#F3E8D3]/70">
                {selectedProduct.weight} &bull; {selectedProduct.origin}
              </span>
            </div>

            <Button asChild>
              <a
                href={inquiryHref}
                className="h-12 px-8 text-xs uppercase tracking-widest-editorial flex items-center justify-center space-x-2 bg-[#F3E8D3] hover:bg-[#DEC3A9] text-[#080604]"
              >
                <Mail className="w-4 h-4" />
                <span>Request This Bar</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
