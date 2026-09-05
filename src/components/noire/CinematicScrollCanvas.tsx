"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CinematicScrollCanvasProps {
  /** Live scroll progress (0..1), mutated outside React render (by Lenis) */
  progressRef: React.MutableRefObject<number>;
  totalFrames?: number;
}

// Draw image onto canvas with letterbox/cover aspect ratio fit
const renderImageToCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  img: HTMLImageElement
) => {
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth || 1280;
  const ih = img.naturalHeight || 720;

  // Cover math: scale to fill entire viewport while maintaining aspect ratio
  const scale = Math.max(cw / iw, ch / ih);
  const nw = iw * scale;
  const nh = ih * scale;
  const nx = (cw - nw) / 2;
  const ny = (ch - nh) / 2;

  ctx.drawImage(img, nx, ny, nw, nh);
};

export function CinematicScrollCanvas({
  progressRef,
  totalFrames = 192,
}: CinematicScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(totalFrames).fill(null));
  const currentFrameRef = useRef(0);
  const drawnFrameRef = useRef(-1);
  const animationFrameRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const [loadedCount, setLoadedCount] = useState(0);

  // Helper to format frame filename: frame_0001.jpg
  const getFrameUrl = useCallback((index: number) => {
    const num = (index + 1).toString().padStart(4, "0");
    return `/frames/frame_${num}.jpg`;
  }, []);

  // Draw frame with letterbox/cover aspect ratio fit
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Fallback to nearest loaded previous frame
      for (let i = frameIndex - 1; i >= 0; i--) {
        const fallbackImg = imagesRef.current[i];
        if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth > 0) {
          renderImageToCanvas(ctx, canvas, fallbackImg);
          return;
        }
      }
      return;
    }

    renderImageToCanvas(ctx, canvas, img);
  }, []);

  // Preload frames progressively: first frame immediately, then in order
  useEffect(() => {
    let isCancelled = false;
    const images = imagesRef.current;
    let loaded = 0;

    const trackLoad = (img: HTMLImageElement, index: number) => {
      images[index] = img;
      loaded += 1;
      // Pre-decode off the main thread so a frame's first paint during
      // scrolling never stalls on synchronous decode
      if (typeof img.decode === "function") {
        img.decode().catch(() => undefined);
      }
      // Only re-render for the loading indicator while it is still visible
      if (loaded <= 12) setLoadedCount(loaded);
    };

    // Load first frame immediately for instant first paint
    const img0 = new Image();
    img0.src = getFrameUrl(0);
    img0.onload = () => {
      if (isCancelled) return;
      trackLoad(img0, 0);
      drawFrame(0);
    };

    // Load all remaining frames
    for (let i = 1; i < totalFrames; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (isCancelled) return;
        trackLoad(img, i);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, getFrameUrl, drawFrame]);

  // Single self-driving rAF loop: reads scroll progress from the ref, lerps
  // the frame index (time-based, frame-rate independent) and only repaints
  // when the visible frame actually changes
  useEffect(() => {
    let active = true;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      if (!active) return;

      // Clamp dt so tab switches never produce a giant jump
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      const targetFrame = Math.min(
        totalFrames - 1,
        Math.max(0, progressRef.current * (totalFrames - 1))
      );

      if (reducedMotion) {
        // Snap directly to target in reduced motion mode
        currentFrameRef.current = targetFrame;
      } else {
        // High-precision exponential smoothing, frame-rate independent
        const diff = targetFrame - currentFrameRef.current;
        if (Math.abs(diff) > 0.005) {
          currentFrameRef.current += diff * (1 - Math.exp(-dt * 9));
        } else {
          currentFrameRef.current = targetFrame;
        }
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      if (frameToDraw !== drawnFrameRef.current) {
        drawnFrameRef.current = frameToDraw;
        drawFrame(frameToDraw);
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [totalFrames, progressRef, drawFrame, reducedMotion]);

  // Canvas resize listener with DevicePixelRatio
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#080604]">
      {/* High Performance 2D/3D Scrubber Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transition-opacity duration-1000"
        style={{
          filter: "contrast(1.04) brightness(0.92)",
        }}
      />

      {/* Cinematic Vignette & Luxury Dark Contrast Gradients */}
      {/* Top soft vignette for navigation readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080604]/90 via-[#080604]/40 to-transparent" />

      {/* Left heavy gradient for editorial typography contrast */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#080604]/92 via-[#080604]/75 to-transparent" />

      {/* Bottom vignette for chapter navigation and footer transition */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#080604] via-[#080604]/60 to-transparent" />

      {/* Subtle organic warm copper radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(155,103,66,0.12),transparent_70%)] mix-blend-screen" />

      {/* Micro film grain overlay */}
      <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />

      {/* Minimalistic initial preloading status */}
      {loadedCount < 10 && (
        <div className="absolute bottom-6 left-6 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#9B6742]/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9B6742] animate-ping" />
          <span>Cinematic Frames Initializing ({loadedCount}/{totalFrames})</span>
        </div>
      )}
    </div>
  );
}
