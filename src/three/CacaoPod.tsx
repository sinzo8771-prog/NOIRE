"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface CacaoPodProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function CacaoPod({
  scale = 1.0,
  position = [0, 0, 0],
  rotation = [0.2, 0.4, -0.3],
}: CacaoPodProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/cacao-pod.glb");

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.3) * 0.15;
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.25) * 0.08;
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

useGLTF.preload("/models/cacao-pod.glb");
