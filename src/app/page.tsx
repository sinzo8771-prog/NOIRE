"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { NoireNavigation } from "@/components/noire/NoireNavigation";
import { StoryProgress } from "@/components/noire/StoryProgress";
import { NoireCursor } from "@/components/noire/NoireCursor";
import { ScrollProgressHairline } from "@/components/noire/ScrollProgressHairline";import { ChocolateRoomModal } from "@/components/noire/ChocolateRoomModal";
import { NoireFooter } from "@/components/noire/NoireFooter";
import { CinematicScrollCanvas } from "@/components/noire/CinematicScrollCanvas";
import { Act01Craving } from "@/components/noire/acts/Act01Craving";
import { Act01Nocturne } from "@/components/noire/acts/Act01Nocturne";
import { HeroMist } from "@/components/noire/HeroMist";
import { Act02Origin } from "@/components/noire/acts/Act02Origin";
import { Act03Transformation } from "@/components/noire/acts/Act03Transformation";
import { Act04Reveal } from "@/components/noire/acts/Act04Reveal";
import { Act05Break } from "@/components/noire/acts/Act05Break";
import { Act06Sensory } from "@/components/noire/acts/Act06Sensory";
import { Act07Collection } from "@/components/noire/acts/Act07Collection";
import { Act08Savor } from "@/components/noire/acts/Act08Savor";
import { TastingRitual } from "@/components/noire/TastingRitual";
import { ReserveDrop } from "@/components/noire/ReserveDrop";
import { OriginMarquee } from "@/components/noire/OriginMarquee";
import { AtelierNotes } from "@/components/noire/AtelierNotes";
import { PRODUCTS, Product } from "@/data/products";
import { useAudio } from "@/hooks/useAudio";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { initAnalytics } from "@/lib/analytics";

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

  // OpenDesign hero A/B: Nocturne is the default hero; `?hero=classic`
  // restores the original Craving hero for comparison.
  // Applied post-hydration (not in render) so SSR HTML always matches the
  // first client paint — no hydration mismatch. Preview-only mechanism.
  const [heroVariant, setHeroVariant] = useState<"nocturne" | "classic">("nocturne");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("hero") === "classic") {
      setHeroVariant("classic");
    }
  }, []);

  const { soundEnabled, toggleSound, playSnap } = useAudio();
  const { particleCount } = useDeviceCapability();

  // Keep a stable handle on playSnap so the Lenis instance is never recreated
  const playSnapRef = useRef(playSnap);
  useEffect(() => {
    playSnapRef.current = playSnap;
  }, [playSnap]);

  // P7 analytics: one delegated click listener for every [data-noire-event]
  const analyticsInitedRef = useRef(false);
  useEffect(() => {
    if (analyticsInitedRef.current) return;
    analyticsInitedRef.current = true;
    return initAnalytics();
  }, []);

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
  // native-scroll tracker when the user prefers reduced motion
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
      duration: 1.35,
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
      scrollProgressRef.current = progress;

      const nextAct = actFromProgress(progress);
      if (nextAct !== prevAct) {
        prevAct = nextAct;
        setActiveAct(nextAct);
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
  // under reduced motion (P5.5 — particle budget comes from useDeviceCapability)
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

  const scrollToAct = (actNumber: number) => scrollToSectionId(`act-${actNumber}`);
  const goToCollection = () => scrollToSectionId("act-7");

  return (
    <main className="relative min-h-screen bg-cacao-950 text-ivory selection:bg-copper selection:text-ivory">
      {/* Accessibility: jump straight to the story */}
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

      {/* Slim progress hairline for viewports below xl (rail is xl-only) */}
      <ScrollProgressHairline />

      {/* The Chocolate Room Reservation Modal */}
      <ChocolateRoomModal
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
      />

      {/* ── The Eight Acts ─────────────────────────────────────────────── */}
      {/* Trial: ?trial=clouds wraps the hero in canvas-ui mist (HeroMist) */}
      <HeroMist>
        {heroVariant === "classic" ? (
          <Act01Craving onExploreCollection={goToCollection} />
        ) : (
          <Act01Nocturne onExploreCollection={goToCollection} />
        )}
      </HeroMist>
      <Act02Origin />
      <Act03Transformation />
      <Act04Reveal />
      <Act05Break onPlaySnap={playSnap} />
      <Act06Sensory onExploreCollection={goToCollection} />
      <OriginMarquee />
      <Act07Collection
        selectedProduct={selectedProduct}
        onSelectProduct={setSelectedProduct}
      />
      <Act08Savor onOpenRoom={() => setRoomModalOpen(true)} />

      {/* Interlude (not an act — the eight-act rail is untouched) */}
      <TastingRitual onOpenRoom={() => setRoomModalOpen(true)} />
      <ReserveDrop onExploreCollection={goToCollection} />
      <AtelierNotes />

      <NoireFooter />
    </main>
  );
}