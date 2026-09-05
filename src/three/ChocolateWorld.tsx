"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";
import { CacaoBean } from "./CacaoBean";
import { CacaoPod } from "./CacaoPod";
import { ChocolateBar } from "./ChocolateBar";
import { ChocolatePiece } from "./ChocolatePiece";
import { ChocolateBreak } from "./ChocolateBreak";
import { Particles } from "./Particles";
import { FallbackStage } from "./FallbackStage";

interface ChocolateWorldProps {
  scrollProgress: number; // 0 to 1
  activeAct: number; // 1 to 8
  hasWebGL: boolean;
  particleCount: number;
}

function SceneChoreographer({
  scrollProgress,
  activeAct,
  particleCount,
}: {
  scrollProgress: number;
  activeAct: number;
  particleCount: number;
}) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const warmLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ camera }) => {
    // Smooth camera dolly and angle based on scroll progress
    // Act 1: camera at z=7.5 -> pushes to z=4.5
    // Act 2: camera pulls out slightly to z=6.5 to frame pod
    // Act 4: camera orbits to angle
    // Act 5: camera close for break
    if (scrollProgress < 0.15) {
      const p = scrollProgress / 0.15;
      camera.position.set(0, 0, 7.5 - p * 3.0);
      camera.lookAt(0, 0, 0);
    } else if (scrollProgress < 0.35) {
      const p = (scrollProgress - 0.15) / 0.2;
      camera.position.set(p * 1.5, -p * 0.5, 4.5 + p * 2.0);
      camera.lookAt(0, 0, 0);
    } else if (scrollProgress < 0.55) {
      const p = (scrollProgress - 0.35) / 0.2;
      camera.position.set(1.5 - p * 2.5, 0, 6.5 - p * 1.0);
      camera.lookAt(0, 0, 0);
    } else if (scrollProgress < 0.75) {
      const p = (scrollProgress - 0.55) / 0.2;
      camera.position.set(-1.0 + p * 1.5, 0.2, 5.5 - p * 0.5);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 0, 5.5);
      camera.lookAt(0, 0, 0);
    }

    // Dynamic light color warming per act
    if (dirLightRef.current && warmLightRef.current) {
      if (activeAct <= 2) {
        dirLightRef.current.intensity = 1.2;
        warmLightRef.current.intensity = 0.8;
      } else if (activeAct <= 5) {
        dirLightRef.current.intensity = 2.4;
        warmLightRef.current.intensity = 1.8;
      } else {
        dirLightRef.current.intensity = 1.6;
        warmLightRef.current.intensity = 1.0;
      }
    }
  });

  // Calculate break progress for Act V (0.70 to 0.85 of scroll)
  const breakP = Math.max(0, Math.min(1, (scrollProgress - 0.68) / 0.15));

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        ref={dirLightRef}
        position={[5, 8, 5]}
        intensity={1.8}
        color="#FFF6EA"
      />
      <pointLight
        ref={warmLightRef}
        position={[-4, 2, -2]}
        intensity={1.2}
        color="#9B6742"
      />
      <spotLight
        position={[0, 6, 4]}
        intensity={1.5}
        angle={0.5}
        penumbra={1}
        color="#EAD5BE"
      />

      {/* Atmospheric Cacao Dust */}
      {particleCount > 0 && (
        <Particles count={particleCount} opacity={activeAct >= 2 ? 0.45 : 0.2} />
      )}

      {/* Act 1 & 3: Cacao Bean */}
      {(activeAct === 1 || activeAct === 3) && (
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <CacaoBean
            scale={activeAct === 1 ? 1.8 : 2.2}
            position={[0, 0, 0]}
          />
        </Float>
      )}

      {/* Act 2: Cacao Pod */}
      {activeAct === 2 && (
        <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.3}>
          <CacaoPod scale={1.2} position={[0, -0.2, 0]} />
        </Float>
      )}

      {/* Act 4: Whole Chocolate Bar Reveal */}
      {activeAct === 4 && (
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.35}>
          <ChocolateBar scale={1.15} position={[0, 0, 0]} />
        </Float>
      )}

      {/* Act 5: The Break Animation */}
      {activeAct === 5 && <ChocolateBreak breakProgress={breakP} />}

      {/* Act 6, 7, 8: Solitary Hero Snapped Piece */}
      {activeAct >= 6 && (
        <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.4}>
          <ChocolatePiece scale={1.7} position={[0, 0, 0]} />
        </Float>
      )}
    </>
  );
}

export function ChocolateWorld({
  scrollProgress,
  activeAct,
  hasWebGL,
  particleCount,
}: ChocolateWorldProps) {
  if (!hasWebGL) {
    return <FallbackStage act={activeAct} />;
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Suspense fallback={<FallbackStage act={activeAct} />}>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          className="w-full h-full"
        >
          <SceneChoreographer
            scrollProgress={scrollProgress}
            activeAct={activeAct}
            particleCount={particleCount}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
