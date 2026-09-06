"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { NoireNavigation } from "@/components/noire/NoireNavigation";
import { StoryProgress } from "@/components/noire/StoryProgress";
import { NoireCursor } from "@/components/noire/NoireCursor";
import { ChocolateRoomModal } from "@/components/noire/ChocolateRoomModal";
import { ProductStage } from "@/components/noire/ProductStage";
import { NoireFooter } from "@/components/noire/NoireFooter";
import { CinematicScrollCanvas } from "@/components/noire/CinematicScrollCanvas";
import { PRODUCTS, Product } from "@/data/products";
import { useAudio } from "@/hooks/useAudio";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// three.js / react-three-fiber live in this async chunk only — it is mounted
// during idle time after first paint and skipped entirely under reduced motion
const AmbientParticles = dynamic(
  () => import("@/components/noire/AmbientParticles"),
  { ssr: false }
);

export default function Home() {
  // Live scroll progress lives in a ref: the cinematic canvas reads it every
  // animation frame directly, so scrolling never triggers a React re-render
  const scrollProgressRef = useRef(0);
  const [activeAct, setActiveAct] = useState(1);
  const lenisRef = useRef<Lenis | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { soundEnabled, toggleSound, playSnap, playTick } = useAudio();
  const { particleCount } = useDeviceCapability();

  // Keep a stable handle on playSnap so the Lenis instance is never recreated
  // (recreating it mid-scroll would interrupt velocity and cause jank)
  const playSnapRef = useRef(playSnap);
  useEffect(() => {
    playSnapRef.current = playSnap;
  }, [playSnap]);

  const actFromProgress = (progress: number): number => {
    if (progress < 0.12) return 1;
    if (progress < 0.26) return 2;
    if (progress < 0.42) return 3;
    if (progress < 0.58) return 4;
    if (progress < 0.72) return 5;
    if (progress < 0.85) return 6;
    if (progress < 0.94) return 7;
    return 8;
  };

  // Scroll driver: Lenis smooth scrolling on the cinematic path; a passive
  // native-scroll tracker when the user prefers reduced motion (Phase 2)
  useEffect(() => {
    if (prefersReducedMotion) {
      let prevAct = 1;
      const onNativeScroll = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        scrollProgressRef.current = progress;

        const nextAct = actFromProgress(progress);
        if (nextAct !== prevAct) {
          prevAct = nextAct;
          setActiveAct(nextAct);
          if (nextAct === 5) {
            playSnapRef.current();
          }
        }
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      onNativeScroll();
      return () => window.removeEventListener("scroll", onNativeScroll);
    }

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

      const nextAct = actFromProgress(progress);

      // Only re-render when the chapter actually changes, not every frame
      if (nextAct !== prevAct) {
        prevAct = nextAct;
        setActiveAct(nextAct);

        // Trigger snap sound effect when entering Act 5 (The Break)
        if (nextAct === 5) {
          playSnapRef.current();
        }
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  // Ambient particle layer mounts during idle time after first paint; never
  // under reduced motion (Phase 1.2 + Phase 2)
  useEffect(() => {
    if (prefersReducedMotion || particleCount <= 0) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idleId: number | null = null;
    let timeoutId: number | null = null;
    const mount = () => setShowParticles(true);
    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(mount, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(mount, 1500);
    }
    return () => {
      if (idleId !== null) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion, particleCount]);

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
      elem.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  const scrollToAct = (actNumber: number) => {
    scrollToSectionId(`act-${actNumber}`);
  };

  return (
    <main className="relative min-h-screen bg-[#080604] text-[#F3E8D3] selection:bg-[#9B6742] selection:text-[#F3E8D3]">
      {/* Accessibility: jump straight to the story (Phase 2) */}
      <a href="#act-1" className="skip-link">
        Skip to content
      </a>

      <NoireCursor />

      {/* Cinematic Frame-by-Frame Scrubbing Canvas Background */}
      <CinematicScrollCanvas progressRef={scrollProgressRef} totalFrames={192} />

      {/* Floating 3D Atmospheric Cacao Particles Layer (idle-mounted lazy chunk) */}
      {showParticles && particleCount > 0 && (
        <AmbientParticles count={particleCount} />
      )}

      {/* Fixed Navigation Header */}
      <NoireNavigation
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        activeAct={activeAct}
        onNavigate={scrollToSectionId}
      />

      {/* Story Chapter Navigation Bar */}
      <StoryProgress activeAct={activeAct} onSelectAct={scrollToAct} />

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
            <div className="space-y-4 max-w-sm bg-[#080604]/40 backdrop-blur-sm p-6 border-l border-[#342015] rounded-[2px]">
              <span className="text-[10px] uppercase tracking-widest text-[#9B6742]">
                Terroir Note
              </span>
              <p className="font-editorial italic text-sm text-[#F3E8D3]/70 leading-relaxed">
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
          ACT VII — COLLECTION (showcase, not commerce)
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




