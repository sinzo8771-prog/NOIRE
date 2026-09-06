"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import { Rotate3D } from "lucide-react";

interface Product3DViewerProps {
  modelPath: string;
  productName: string;
}

function Bar3DModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  return (
    <primitive
      object={scene.clone()}
      scale={[0.85, 0.85, 0.85]}
      rotation={[0.3, 0.4, 0.1]}
      position={[0, 0, 0]}
    />
  );
}

/**
 * Interactive 3D product viewer for the Reserve Collection (Act VII).
 *
 * Lives in its own module and is dynamically imported by ProductStage once
 * the section approaches the viewport, so three.js/drei only download when
 * a visitor actually reaches the collection (Phase 1.2).
 */
export default function Product3DViewer({
  modelPath,
  productName,
}: Product3DViewerProps) {
  return (
    <div
      className="relative w-full h-[380px] sm:h-[460px] bg-[#0F0A07] border border-[#342015] rounded-[2px] overflow-hidden flex items-center justify-center"
      role="img"
      aria-label={`Interactive 3D model of the ${productName} chocolate bar. Drag to rotate.`}
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center space-y-3 text-[#F3E8D3]/40">
            <span className="w-8 h-8 border border-[#9B6742] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] uppercase tracking-widest">
              Rendering 3D Bar
            </span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 40 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 6, 4]} intensity={2.2} color="#FFF5EA" />
          <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#9B6742" />
          <spotLight
            position={[0, 5, 2]}
            intensity={1.8}
            angle={0.6}
            penumbra={0.8}
            color="#FFF2DC"
          />
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <Bar3DModel modelPath={modelPath} />
          </Float>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </Suspense>

      {/* Orbit cue indicator */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#F3E8D3]/40 pointer-events-none">
        <Rotate3D className="w-3.5 h-3.5 text-[#9B6742]" />
        <span>Drag to rotate</span>
      </div>

      {/* Terroir stamp */}
      <div className="absolute top-4 right-4 text-[9px] uppercase tracking-widest text-[#9B6742] border border-[#9B6742]/40 px-2 py-0.5 rounded-[1px]">
        Hand Cast 80g
      </div>
    </div>
  );
}
