"use client";

import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { NoireNavigation } from "@/components/noire/NoireNavigation";
import { StoryProgress } from "@/components/noire/StoryProgress";
import { NoireCursor } from "@/components/noire/NoireCursor";
import { NoireCart } from "@/components/noire/NoireCart";
import { ChocolateRoomModal } from "@/components/noire/ChocolateRoomModal";
import { ProductStage } from "@/components/noire/ProductStage";
import { NoireFooter } from "@/components/noire/NoireFooter";
import { CinematicScrollCanvas } from "@/components/noire/CinematicScrollCanvas";
import { Canvas } from "@react-three/fiber";
import { Particles } from "@/three/Particles";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useAudio } from "@/hooks/useAudio";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Live scroll progress lives in a ref: the cinematic canvas reads it every
  // animation frame directly, so scrolling never triggers a React re-render
  const scrollProgressRef = useRef(0);
  const [activeAct, setActiveAct] = useState(1);
  const lenisRef = useRef<Lenis | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  const {
    items: cartItems,
    isOpen: cartOpen,
    setIsOpen: setCartOpen,
    addItem: addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount: cartCount,
    subtotal,
  } = useCart();

  const { soundEnabled, toggleSound, playSnap, playTick } = useAudio();
  const { particleCount } = useDeviceCapability();

  // Keep a stable handle on playSnap so the Lenis instance is never recreated
  // (recreating it mid-scroll would interrupt velocity and cause jank)
  const playSnapRef = useRef(playSnap);
  useEffect(() => {
    playSnapRef.current = playSnap;
  }, [playSnap]);

  // Lenis smooth scroll setup and scroll tracking
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    let prevAct = 1;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      // Ref write only — the canvas loop consumes this without React
      scrollProgressRef.current = progress;

      // Determine active act based on scroll progress
      let currentAct: number;
      if (progress < 0.12) currentAct = 1;
      else if (progress < 0.26) currentAct = 2;
      else if (progress < 0.42) currentAct = 3;
      else if (progress < 0.58) currentAct = 4;
      else if (progress < 0.72) currentAct = 5;
      else if (progress < 0.85) currentAct = 6;
      else if (progress < 0.94) currentAct = 7;
      else currentAct = 8;

      // Only re-render when the chapter actually changes, not every frame
      if (currentAct !== prevAct) {
        prevAct = currentAct;
        setActiveAct(currentAct);

        // Trigger snap sound effect when entering Act 5 (The Break)
        if (currentAct === 5) {
          playSnapRef.current();
        }
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToSectionId = (sectionId: string) => {
    const elem = document.getElementById(sectionId);
    if (!elem) return;
    // Route through Lenis so programmatic navigation honors the same
    // smoothing/easing as wheel scrolling instead of fighting it
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(elem, {
        duration: 1.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAct = (actNumber: number) => {
    scrollToSectionId(`act-${actNumber}`);
  };

  return (
    <main className="relative min-h-screen bg-[#080604] text-[#F3E8D3] selection:bg-[#9B6742] selection:text-[#F3E8D3]">
      <NoireCursor />

      {/* Cinematic Frame-by-Frame Scrubbing Canvas Background */}
      <CinematicScrollCanvas progressRef={scrollProgressRef} totalFrames={192} />

      {/* Floating 3D Atmospheric Cacao Particles Layer */}
      {particleCount > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[1] w-full h-full">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ alpha: true }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.5} />
            <Particles count={particleCount} opacity={0.35} />
          </Canvas>
        </div>
      )}

      {/* Fixed Navigation Header */}
      <NoireNavigation
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        activeAct={activeAct}
        onNavigate={scrollToSectionId}
      />

      {/* Story Chapter Navigation Bar */}
      <StoryProgress activeAct={activeAct} onSelectAct={scrollToAct} />

      {/* Cart Drawer */}
      <NoireCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        subtotal={subtotal}
      />

      {/* The Chocolate Room Reservation Modal */}
      <ChocolateRoomModal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
      />

      {/* ─────────────────────────────────────────────────────────────
          ACT I — THE CRAVING
      ───────────────────────────────────────────────────────────── */}
      <section
        id="act-1"
        className="relative z-10 min-h-screen flex flex-col justify-between px-6 sm:px-12 pt-36 pb-16 max-w-7xl mx-auto"
      >
        <div className="space-y-3">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
            Act I &bull; The Craving
          </span>
          <p className="text-xs uppercase tracking-widest text-[#F3E8D3]/50">
            Before chocolate becomes chocolate...
          </p>
        </div>

        {/* Central Editorial Composition */}
        <div className="my-auto py-24 space-y-6 max-w-2xl">
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[#F3E8D3] leading-[0.95]">
            Something worth waiting for.
          </h1>
          <p className="font-editorial text-xl sm:text-2xl text-[#9B6742] italic max-w-lg leading-relaxed">
            Unhurried heat. Single-estate heirloom beans. The quiet art of deliberate patience.
          </p>
        </div>

        {/* Scroll down prompt */}
        <div className="flex items-center justify-between pt-8 border-t border-[#342015]/40 text-xs text-[#F3E8D3]/40 uppercase tracking-widest">
          <span>01 / 08</span>
          <div className="flex items-center space-x-2 animate-bounce">
            <span>Scroll to begin film journey</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#9B6742]" />
          </div>
          <span>Atelier Reserve</span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT II — ORIGIN
      ───────────────────────────────────────────────────────────── */}
      <section
        id="act-2"
        className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
              Act II &bull; Origin & Canopy
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-normal text-[#F3E8D3] leading-tight">
              Where the wild pod awakens.
            </h2>
            <p className="text-sm sm:text-base text-[#F3E8D3]/70 leading-relaxed max-w-md">
              High in the biodiverse rainforests of Tumaco and Esmeraldas, heirloom Theobroma cacao grows under the shade of banana palms and mahogany trees. Rich volcanic soil, equatorial rainfall, and unhurried natural pollination.
            </p>

            {/* Asymmetrical visual composition words */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {["SOIL", "HEAT", "TIME", "HANDS"].map((word) => (
                <div
                  key={word}
                  className="p-4 bg-[#120B07]/80 border border-[#342015] rounded-[2px] backdrop-blur-sm"
                >
                  <span className="font-display text-lg tracking-widest text-[#9B6742]">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-end">
            <div className="p-8 border border-[#342015]/60 bg-[#0F0A07]/70 backdrop-blur-md max-w-sm space-y-3 rounded-[2px]">
              <span className="text-[10px] uppercase tracking-widest text-[#9B6742]">
                Terroir Note
              </span>
              <p className="font-editorial text-sm italic text-[#F3E8D3]/80 leading-relaxed">
                &ldquo;A cacao tree requires five seasons to produce its first harvest. We honor that patience by never accelerating the cure.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT III — TRANSFORMATION
      ───────────────────────────────────────────────────────────── */}
      <section
        id="act-3"
        className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
      >
        <div className="max-w-3xl space-y-8">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
            Act III &bull; Transformation
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal text-[#F3E8D3] leading-tight">
            The 72-Hour Granite Conche.
          </h2>
          <p className="text-sm sm:text-base text-[#F3E8D3]/70 leading-relaxed">
            Industrial confection relies on chemical deodorization and high heat. NOIRÉ employs traditional heavy granite stone wheels rolling uninterrupted for three days and nights. Volatile tannins soften; delicate floral notes and deep fruit sugars awaken.
          </p>

          {/* Sequential Process Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6">
            {[
              { step: "01", name: "FERMENT", desc: "Banana leaf wrap" },
              { step: "02", name: "SUN DRY", desc: "Teak drying beds" },
              { step: "03", name: "SLOW ROAST", desc: "Gentle convective air" },
              { step: "04", name: "CRUSH", desc: "Pure roasted nibs" },
              { step: "05", name: "STONE CONCHE", desc: "72 hours uninterrupted" },
            ].map((s) => (
              <div
                key={s.step}
                className="p-3.5 bg-[#120B07]/85 border border-[#342015] rounded-[2px] backdrop-blur-sm space-y-1"
              >
                <span className="text-[9px] font-mono text-[#9B6742]">{s.step}</span>
                <p className="text-xs uppercase tracking-wider font-semibold text-[#F3E8D3]">
                  {s.name}
                </p>
                <p className="text-[10px] text-[#F3E8D3]/50">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT IV — THE CHOCOLATE
      ───────────────────────────────────────────────────────────── */}
      <section
        id="act-4"
        className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
              Act IV &bull; The Reveal
            </span>
            <h2 className="font-display text-5xl sm:text-7xl font-normal text-[#F3E8D3] leading-[0.95]">
              72% CACAO.
              <br />
              <span className="font-editorial italic text-[#9B6742]">
                Nothing unnecessary.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#F3E8D3]/70 leading-relaxed max-w-lg">
              Cast in calibrated molds with crisp beveled snap gutters. Stamped with the singular NOIRÉ mark. The surface gleams with microscopic cocoa butter crystals aligned to perfection.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-end">
            <div className="border-l border-[#342015] pl-8 space-y-4 max-w-xs bg-[#080604]/40 backdrop-blur-sm p-4 rounded-[2px]">
              <span className="text-[10px] uppercase tracking-widest text-[#9B6742]">
                Formula Restraint
              </span>
              <p className="text-xs text-[#F3E8D3]/60 leading-relaxed">
                72% Tumaco Cacao. 28% Raw Unrefined Cane Sugar. A whisper of cold-pressed cocoa butter. Zero soy lecithin. Zero vanillin. Zero filler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT V — THE BREAK
      ───────────────────────────────────────────────────────────── */}
      <section
        id="act-5"
        className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
      >
        <div className="max-w-2xl space-y-6">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
            Act V &bull; The Break
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal text-[#F3E8D3] leading-tight">
            A snap you feel in your fingertips.
          </h2>
          <p className="text-sm sm:text-base text-[#F3E8D3]/70 leading-relaxed">
            Proper temper produces Form V beta crystals. When snapped, it sounds crisp like clean porcelain. The fractured edge reveals a dark, silky crystalline grain that melts at exactly body temperature.
          </p>
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={playSnap}
              className="border-[#342015] text-[#9B6742] hover:border-[#9B6742] text-xs uppercase tracking-widest backdrop-blur-sm"
            >
              Audition the Snap
            </Button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT VI — SENSORY EXPERIENCE
      ───────────────────────────────────────────────────────────── */}
      <section
        id="act-6"
        className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
      >
        <div className="space-y-12 max-w-3xl">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
            Act VI &bull; Sensory Progression
          </span>

          {/* Sequential Taste Evolution */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              {
                word: "BITTER.",
                desc: "An initial bold shock of dark roasted bean tannins that clears the palate.",
              },
              {
                word: "WARM.",
                desc: "Body heat melts the cocoa butter, releasing leather, oak, and dried black fig.",
              },
              {
                word: "DEEP.",
                desc: "A rich tobacco and molasses resonance that lingers across the throat.",
              },
              {
                word: "GONE.",
                desc: "Dissolves cleanly without greasy residue. Leaving only quiet craving.",
              },
            ].map((s) => (
              <div key={s.word} className="space-y-3 p-4 bg-[#120B07]/70 border border-[#342015]/80 rounded-[2px] backdrop-blur-sm">
                <h3 className="font-display text-3xl sm:text-4xl text-[#9B6742] font-normal">
                  {s.word}
                </h3>
                <p className="text-xs text-[#F3E8D3]/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT VII — COLLECTION & COMMERCE
      ───────────────────────────────────────────────────────────── */}
      <section
        id="act-7"
        className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 py-32 max-w-7xl mx-auto"
      >
        <div className="space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
              Act VII &bull; The Reserve Collection
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-normal text-[#F3E8D3]">
              Four Resolute Expressions.
            </h2>
          </div>

          <ProductStage
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(product) => {
              addToCart(product);
              playTick();
            }}
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT VIII — ENDING & THE CHOCOLATE ROOM
      ───────────────────────────────────────────────────────────── */}
      <section
        id="act-8"
        className="relative z-10 min-h-[85vh] flex flex-col justify-center items-center text-center px-6 sm:px-12 py-32 max-w-4xl mx-auto"
      >
        <div className="space-y-8 p-8 sm:p-12 bg-[#080604]/80 border border-[#342015] backdrop-blur-md rounded-[2px]">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9B6742] font-sans">
            Act VIII &bull; Epilogue
          </span>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F3E8D3] leading-tight">
            Some things deserve
            <br />
            <span className="font-editorial italic text-[#9B6742]">
              to be savored slowly.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#F3E8D3]/70 max-w-lg mx-auto leading-relaxed">
            Visit our quiet atelier salon in Mumbai for bespoke single-estate tasting flights and stone-conche pairing experiences.
          </p>

          <div className="pt-6">
            <Button
              onClick={() => setRoomModalOpen(true)}
              className="bg-[#9B6742] hover:bg-[#835534] text-[#F3E8D3] text-xs uppercase tracking-widest-editorial px-10 py-6 whitespace-normal"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Enter the Chocolate Room</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <NoireFooter />
    </main>
  );
}
