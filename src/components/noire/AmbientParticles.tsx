"use client";

import { Canvas } from "@react-three/fiber";
import { Particles } from "@/three/Particles";

interface AmbientParticlesProps {
  count: number;
}

/**
 * Floating 3D atmospheric cacao particle layer.
 *
 * Lives in its own module so the page can load it via next/dynamic AFTER
 * first paint (idle-time mount). This keeps three.js / react-three-fiber out
 * of the critical first-load bundle entirely (Phase 1.2 of the remediation
 * plan) and lets us skip the layer completely under prefers-reduced-motion.
 */
export default function AmbientParticles({ count }: AmbientParticlesProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <Particles count={count} opacity={0.35} />
      </Canvas>
    </div>
  );
}
