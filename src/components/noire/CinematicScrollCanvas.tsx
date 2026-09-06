"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion, readMotionOverride } from "@/hooks/useReducedMotion";

interface CinematicScrollCanvasProps {
  /** Live scroll progress (0..1), mutated outside React render (by Lenis) */
  progressRef: React.MutableRefObject<number>;
  /** Total frames in the desktop manifest (mobile serves every 3rd frame) */
  totalFrames?: number;
}

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const MOBILE_FRAME_STRIDE = 3; // 192 source frames -> 64 mobile frames
const PRIORITY_FRAME_COUNT = 10; // fetched immediately to unlock the hero
const MAX_CONCURRENT_LOADS = 8; // network-friendly background streaming
const LOADER_VISIBLE_FRAMES = 10; // indicator hides once this many are ready

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
  // Images are stored by POSITION in the active frame set. Desktop serves all
  // 192 source frames (WebP); mobile serves every 3rd source frame (64 files,
  // ~1.2MB total) so cellular devices download a fraction of the payload.
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameIndicesRef = useRef<number[]>([]);
  const currentPosRef = useRef(0);
  const drawnPosRef = useRef(-1);
  const animationFrameRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const [loadedCount, setLoadedCount] = useState(0);
  const [activeSetSize, setActiveSetSize] = useState(totalFrames);

  // Draw frame (position-based) with letterbox/cover aspect ratio fit
  const drawFrame = useCallback((pos: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const images = imagesRef.current;
    const img = images[pos];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Fallback to nearest loaded previous frame
      for (let i = pos - 1; i >= 0; i--) {
        const fallbackImg = images[i];
        if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth > 0) {
          renderImageToCanvas(ctx, canvas, fallbackImg);
          return;
        }
      }
      return;
    }

    renderImageToCanvas(ctx, canvas, img);
  }, []);

  // Build the active frame set and run the progressive loader. Re-runs when
  // the reduced-motion preference flips mid-session.
  useEffect(() => {
    const isMobileViewport = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
    // Resolve the effective motion preference synchronously (hook state can
    // lag one paint): the visitor's in-site override wins, then the OS query.
    // Under reduced motion the scrubber runs in snap mode (user-driven only,
    // no smoothing/lerp) through every 3rd frame — so it still streams the
    // smaller 64-frame set instead of freezing on a single static image.
    const override = readMotionOverride();
    const isReduced = override
      ? override === "off"
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopStride = isReduced ? MOBILE_FRAME_STRIDE : 1;
    const frameIndices = isMobileViewport
      ? Array.from(
          { length: Math.ceil(totalFrames / MOBILE_FRAME_STRIDE) },
          (_, i) => i * MOBILE_FRAME_STRIDE
        )
      : Array.from(
          { length: Math.ceil(totalFrames / desktopStride) },
          (_, i) => i * desktopStride
        );

    frameIndicesRef.current = frameIndices;
    const images = (imagesRef.current = new Array(frameIndices.length).fill(null));
    setActiveSetSize(frameIndices.length);

    const urlFor = (sourceIndex: number) => {
      const n = String(sourceIndex + 1).padStart(4, "0");
      return isMobileViewport
        ? `/frames/webp-mobile/frame_${n}.webp`
        : `/frames/webp/frame_${n}.webp`;
    };

    let cancelled = false;
    let loaded = 0;
    let inFlight = 0;
    let cursor = 0;
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;

    const trackLoad = (img: HTMLImageElement, pos: number) => {
      images[pos] = img;
      loaded += 1;
      // Pre-decode off the main thread so a frame's first paint during
      // scrolling never stalls on synchronous decode
      if (typeof img.decode === "function") {
        img.decode().catch(() => undefined);
      }
      if (loaded <= LOADER_VISIBLE_FRAMES) {
        setLoadedCount(loaded);
      }
      // If this frame is at/near the current scrub target, paint it now so
      // early scroll positions never wait for the rAF loop
      const targetPos = Math.round(
        progressRef.current * Math.max(0, frameIndices.length - 1)
      );
      if (pos <= targetPos + 4) {
        drawFrame(targetPos);
      }
    };

    const loadNext = () => {
      while (
        !cancelled &&
        inFlight < MAX_CONCURRENT_LOADS &&
        cursor < frameIndices.length
      ) {
        const pos = cursor++;
        const img = new Image();
        img.decoding = "async";
        if (pos === 0) {
          // The opening frame is a likely LCP element on mobile — jump the
          // browser's fetch queue ahead of fonts/JS for this one request.
          (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
            "high";
        }
        img.onload = img.onerror = () => {
          inFlight -= 1;
          if (!cancelled) {
            trackLoad(img, pos);
            scheduleNext();
          }
        };
        img.src = urlFor(frameIndices[pos]);
        inFlight += 1;
      }
    };

    const scheduleNext = () => {
      if (cancelled || cursor >= frameIndices.length) return;
      // The first ~10 frames unlock the hero — fetch them at full priority.
      if (cursor < PRIORITY_FRAME_COUNT) {
        loadNext();
        return;
      }
      // Background frames stream in during idle time so they never compete
      // with fonts, hydration, or first interaction (Phase 1.1).
      const w = window as Window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number }
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
      if (typeof w.requestIdleCallback === "function") {
        idleHandle = w.requestIdleCallback(() => loadNext(), { timeout: 800 });
      } else {
        timeoutHandle = window.setTimeout(loadNext, 120);
      }
    };

    loadNext();

    return () => {
      cancelled = true;
      if (idleHandle !== null) {
        (window as Window & { cancelIdleCallback?: (h: number) => void })
          .cancelIdleCallback?.(idleHandle);
      }
      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, [totalFrames, progressRef, drawFrame, reducedMotion]);

  // Single self-driving rAF loop: reads scroll progress from the ref, lerps
  // the active frame and repaints only when the frame index actually changes.
  useEffect(() => {
    // Reduced motion (Phase 2): no Lenis smoothing and no lerp — the canvas
    // snaps 1:1 to scroll position through the reduced frame set. Motion is
    // strictly user-driven (a frame only changes because the user scrolled);
    // no autonomous animation, no parallax smoothing.
    if (reducedMotion) {
      let lastDrawnPos = -1;
      let snapRafId = requestAnimationFrame(function check() {
        const framesLength = frameIndicesRef.current.length;
        if (framesLength > 0) {
          const targetPos = Math.min(
            framesLength - 1,
            Math.max(0, progressRef.current * (framesLength - 1))
          );
          const pos = Math.round(targetPos);
          if (pos !== lastDrawnPos) {
            lastDrawnPos = pos;
            drawFrame(pos);
          }
        }
        snapRafId = requestAnimationFrame(check);
      });
      return () => cancelAnimationFrame(snapRafId);
    }

    let active = true;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      if (!active) return;
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      const framesLength = frameIndicesRef.current.length;
      if (framesLength === 0) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const targetPos = Math.min(
        framesLength - 1,
        Math.max(0, progressRef.current * (framesLength - 1))
      );

      // High-precision exponential smoothing, frame-rate independent
      const diff = targetPos - currentPosRef.current;
      if (Math.abs(diff) > 0.005) {
        currentPosRef.current += diff * (1 - Math.exp(-dt * 9));
      } else {
        currentPosRef.current = targetPos;
      }

      const posToDraw = Math.round(currentPosRef.current);
      if (posToDraw !== drawnPosRef.current) {
        drawnPosRef.current = posToDraw;
        drawFrame(posToDraw);
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
  }, [progressRef, drawFrame, reducedMotion]);

  // Canvas resize listener with DevicePixelRatio
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(Math.round(currentPosRef.current));
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
        role="img"
        aria-label="Cinematic film still of cacao and chocolate craftsmanship, changes with scroll"
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
      {loadedCount < LOADER_VISIBLE_FRAMES && (
        <div className="absolute bottom-6 left-6 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#B57B4C]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9B6742] animate-ping" />
          <span>
            Cinematic Frames Initializing ({loadedCount}/{activeSetSize})
          </span>
        </div>
      )}
    </div>
  );
}


