"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Product } from "@/data/products";
import { ProductSwitcher } from "./ProductSwitcher";
import { TastingNotes } from "./TastingNotes";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";
import { mailtoLink } from "@/lib/site";
import { ConciergeFallback } from "./ConciergeContact";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

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
  // P5.4 — devices without WebGL never pay for the 3D chunk and instead get a
  // static reserve-bar visual + the product information + Request This Bar CTA.
  const { hasWebGL } = useDeviceCapability();

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
        {/* Left: 3D Product Canvas (WebGL fallback below if unavailable) */}
        <div className="lg:col-span-6" ref={viewerAreaRef}>
          <div className="w-full h-[380px] sm:h-[460px]">
            {viewerNear ? (
              hasWebGL ? (
                <Product3DViewer
                  modelPath={selectedProduct.model}
                  productName={selectedProduct.name}
                  productWeight={selectedProduct.weight}
                />
              ) : (
                <StaticReservePreview product={selectedProduct} />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center border border-[#342015] rounded-[2px] bg-[#0F0A07] text-[#F3E8D3]/30 text-[10px] uppercase tracking-widest">
                Reserve bar preview
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Narrative & Tasting Notes (tabpanel for the tabs) */}
        <div
          id="noire-product-panel"
          role="tabpanel"
          aria-labelledby={`tab-${selectedProduct.id}`}
          className="lg:col-span-6 space-y-8"
        >
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
                data-noire-event="request_bar_click"
                data-noire-product={selectedProduct.id}
                title="Request this bar — replies within one day, personally"
                className="h-12 px-8 text-xs uppercase tracking-widest-editorial flex items-center justify-center space-x-2 bg-[#F3E8D3] hover:bg-[#DEC3A9] text-[#080604]"
              >
                <Mail className="w-4 h-4" />
                <span>Request This Bar</span>
              </a>
            </Button>
          </div>

          {/* P1 handoff fallback: open address + copy + reply promise */}
          <ConciergeFallback label={`request ${selectedProduct.id}`} />
        </div>
      </div>
    </div>
  );
}
/**
 * P5.4 — static fallback shown when WebGL is unavailable or the 3D viewer
 * fails. Product information and the Request This Bar CTA always remain
 * reachable beside this visual.
 */
function StaticReservePreview({ product }: { product: Product }) {
  return (
    <div
      role="img"
      aria-label={`${product.name} — static reserve bar rendering. Request via the concierge.`}
      className="w-full h-full flex flex-col items-center justify-center gap-4 border border-[#342015] rounded-[2px] bg-gradient-to-b from-[#1A100B] to-[#0F0A07] text-center px-6"
    >
      <span className="font-display text-3xl sm:text-4xl tracking-[0.2em] text-[#F3E8D3]/90">
        {product.name}
      </span>
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#9B6742]">
        {product.weight} &bull; {product.cacaoPercentage}% Cacao
      </span>
      <span className="text-[10px] uppercase tracking-widest text-[#F3E8D3]/40 max-w-[240px] leading-relaxed">
        The 3D reserve visual is unavailable on this device &mdash; request the
        bar directly below.
      </span>
    </div>
  );
}
