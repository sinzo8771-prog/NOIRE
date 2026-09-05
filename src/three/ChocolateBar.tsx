"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ChocolateBarProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function ChocolateBar({
  scale = 1.1,
  position = [0, 0, 0],
  rotation = [0.4, -0.3, 0.1],
}: ChocolateBarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chocolate-bar.glb");

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.3) * 0.1;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.4) * 0.05;
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

useGLTF.preload("/models/chocolate-bar.glb");
