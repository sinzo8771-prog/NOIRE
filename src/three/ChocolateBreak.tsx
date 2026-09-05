"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

interface ChocolateBreakProps {
  breakProgress: number; // 0 to 1
}

export function ChocolateBreak({ breakProgress = 0 }: ChocolateBreakProps) {
  const leftHalfRef = useRef<THREE.Group>(null);
  const rightHalfRef = useRef<THREE.Group>(null);
  const heroPieceRef = useRef<THREE.Group>(null);

  const { scene: pieceScene } = useGLTF("/models/chocolate-piece.glb");
  const { scene: barScene } = useGLTF("/models/chocolate-bar.glb");

  useFrame(() => {
    const p = Math.max(0, Math.min(1, breakProgress));

    if (leftHalfRef.current) {
      leftHalfRef.current.position.x = -p * 0.9;
      leftHalfRef.current.position.y = -p * 0.3;
      leftHalfRef.current.rotation.z = p * 0.18;
      leftHalfRef.current.rotation.y = -p * 0.15;
    }

    if (rightHalfRef.current) {
      rightHalfRef.current.position.x = p * 1.1;
      rightHalfRef.current.position.y = -p * 0.4;
      rightHalfRef.current.rotation.z = -p * 0.22;
      rightHalfRef.current.rotation.y = p * 0.2;
    }

    if (heroPieceRef.current) {
      // Hero piece detaches and floats forward toward the camera
      heroPieceRef.current.position.z = p * 2.8;
      heroPieceRef.current.position.y = p * 0.4;
      heroPieceRef.current.position.x = p * 0.2;
      heroPieceRef.current.rotation.x = 0.4 + p * 0.6;
      heroPieceRef.current.rotation.y = -0.2 + p * 0.8;
      heroPieceRef.current.scale.setScalar(1.0 + p * 0.4);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Left fractured half */}
      <group ref={leftHalfRef} position={[-0.6, 0, 0]}>
        <primitive
          object={barScene.clone()}
          scale={[0.85, 0.85, 0.85]}
          position={[-0.4, 0, 0]}
        />
      </group>

      {/* Right fractured half */}
      <group ref={rightHalfRef} position={[0.6, 0, 0]}>
        <primitive
          object={barScene.clone()}
          scale={[0.85, 0.85, 0.85]}
          position={[0.4, 0, 0]}
        />
      </group>

      {/* Detached hero piece advancing toward camera */}
      <group ref={heroPieceRef} position={[0, 0, 0.2]}>
        <primitive
          object={pieceScene.clone()}
          scale={[1.2, 1.2, 1.2]}
        />
      </group>
    </group>
  );
}
