"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ChocolatePieceProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function ChocolatePiece({
  scale = 1.6,
  position = [0, 0, 0],
  rotation = [0.3, 0.4, 0.2],
}: ChocolatePieceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chocolate-piece.glb");

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.4) * 0.15;
    groupRef.current.rotation.x = rotation[0] + Math.cos(t * 0.35) * 0.1;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.08;
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

useGLTF.preload("/models/chocolate-piece.glb");
