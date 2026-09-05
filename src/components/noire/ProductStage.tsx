"use client";

import { useState, Suspense } from "react";
import { Product } from "@/data/products";
import { ProductSwitcher } from "./ProductSwitcher";
import { TastingNotes } from "./TastingNotes";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Check, Rotate3D, Sparkles } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float, Environment } from "@react-three/drei";

interface ProductStageProps {
  selectedProduct: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

function Bar3DModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  return (
    <primitive
      object={scene.clone()}
      scale={[0.85, 0.85, 0.85]}
      rotation={[0.3, 0.4, 0.1]}
      position={[0, 0, 0]}
    />
  );
}

function Product3DViewer({ modelPath }: { modelPath: string }) {
  return (
    <div className="relative w-full h-[380px] sm:h-[460px] bg-[#0F0A07] border border-[#342015] rounded-[2px] overflow-hidden flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center space-y-3 text-[#F3E8D3]/40">
            <span className="w-8 h-8 border border-[#9B6742] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] uppercase tracking-widest">
              Rendering 3D Bar
            </span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 40 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 6, 4]} intensity={2.2} color="#FFF5EA" />
          <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#9B6742" />
          <spotLight
            position={[0, 5, 2]}
            intensity={1.8}
            angle={0.6}
            penumbra={0.8}
            color="#FFF2DC"
          />
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <Bar3DModel modelPath={modelPath} />
          </Float>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </Suspense>

      {/* Orbit cue indicator */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#F3E8D3]/40 pointer-events-none">
        <Rotate3D className="w-3.5 h-3.5 text-[#9B6742]" />
        <span>Drag to rotate</span>
      </div>

      {/* Terroir stamp */}
      <div className="absolute top-4 right-4 text-[9px] uppercase tracking-widest text-[#9B6742] border border-[#9B6742]/40 px-2 py-0.5 rounded-[1px]">
        Hand Cast 80g
      </div>
    </div>
  );
}

export function ProductStage({
  selectedProduct,
  onSelectProduct,
  onAddToCart,
}: ProductStageProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(selectedProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="space-y-10">
      <ProductSwitcher
        selectedProduct={selectedProduct}
        onSelectProduct={onSelectProduct}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left: 3D Product Canvas */}
        <div className="lg:col-span-6">
          <Product3DViewer modelPath={selectedProduct.model} />
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

          {/* Pricing & Add to Bag */}
          <div className="pt-6 border-t border-[#342015] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-[#F3E8D3]/40">
                Artisanal Bar
              </span>
              <span className="font-mono text-2xl font-normal text-[#F3E8D3]">
                {formatPrice(selectedProduct.price)}
              </span>
            </div>

            <Button
              onClick={handleAdd}
              disabled={added}
              className={`h-12 px-8 text-xs uppercase tracking-widest-editorial flex items-center justify-center space-x-2 transition-all duration-300 ${
                added
                  ? "bg-[#342015] text-[#9B6742] border border-[#9B6742]"
                  : "bg-[#F3E8D3] hover:bg-[#DEC3A9] text-[#080604]"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-[#9B6742]" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
