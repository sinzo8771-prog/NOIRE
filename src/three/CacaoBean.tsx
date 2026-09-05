"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface CacaoBeanProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
}

export function CacaoBean({
  scale = 1.6,
  position = [0, 0, 0],
  rotation = [0.4, 0.6, 0.2],
  opacity = 1,
}: CacaoBeanProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/cacao-bean.glb");

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Organic, weighted slow drift
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.4) * 0.12;
    groupRef.current.rotation.x = rotation[0] + Math.cos(t * 0.3) * 0.08;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.06;
  });

  return (
    <group ref={groupRef} position={position}>
      <primitive
        object={scene.clone()}
        scale={[scale, scale, scale]}
      />
    </group>
  );
}

useGLTF.preload("/models/cacao-bean.glb");
