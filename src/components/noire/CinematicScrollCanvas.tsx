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
    // Adaptive prefetch: after the priority head, load the frames the
    // visitor is actually heading toward — nearest unloaded position to
    // the live scrub target, biased ahead along scroll direction.
    // `pending` tracks in-flight positions so the picker never spends two
    // slots on the same frame within one scheduling round.
    const pending = new Set<number>();
    let lastTarget = 0;
    let lastSampleAt = 0;

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

    const liveTarget = () =>
      Math.round(progressRef.current * Math.max(0, frameIndices.length - 1));

    // Pick the next frame to fetch: priority head stays sequential (fast
    // first paint), everything after follows predicted scroll position.
    // Skips loaded AND in-flight positions — every pick is unique.
    const pickNext = (): number => {
      if (cursor < PRIORITY_FRAME_COUNT) {
        const pos = cursor++;
        return images[pos] || pending.has(pos) ? pickNext() : pos;
      }
      const now = performance.now();
      const target = Math.max(0, Math.min(frameIndices.length - 1, liveTarget()));
      const dt = Math.max(1, now - lastSampleAt) / 1000;
      const velocity = (target - lastTarget) / dt; // positions per second
      lastTarget = target;
      lastSampleAt = now;
      const dir = Math.abs(velocity) < 4 ? 0 : Math.sign(velocity);
      const predicted = Math.max(
        0,
        Math.min(
          frameIndices.length - 1,
          target + dir * Math.min(24, Math.abs(velocity) * 0.15)
        )
      );
      let best = -1;
      let bestDist = Infinity;
      for (let pos = 0; pos < frameIndices.length; pos++) {
        if (images[pos] || pending.has(pos)) continue;
        const d = Math.abs(pos - predicted);
        if (d < bestDist) {
          bestDist = d;
          best = pos;
        }
      }
      if (best >= 0) return best;
      // All positions covered (errors count as loaded) — nothing to fetch.
      return -1;
    };

    const loadNext = () => {
      while (!cancelled && inFlight < MAX_CONCURRENT_LOADS) {
        const pos = pickNext();
        if (pos < 0 || pos >= frameIndices.length) break;
        if (images[pos] || pending.has(pos)) continue;
        pending.add(pos);
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
          pending.delete(pos);
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
      if (cancelled || loaded >= frameIndices.length) return;
      // The first ~10 frames unlock the hero — fetch them at full priority.
      if (cursor < PRIORITY_FRAME_COUNT) {
        loadNext();
        return;
      }
      // Background frames stream in during idle time so they never compete
      // with fonts, hydration, or first interaction (Phase 1.1). The short
      // timeout keeps deep frames arriving on slow networks instead of
      // leaving the scrubber parked on stale frames mid-film.
      const w = window as Window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number }
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
      if (typeof w.requestIdleCallback === "function") {
        idleHandle = w.requestIdleCallback(() => loadNext(), { timeout: 300 });
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
    // Idle backoff: after ~1.5s of settled frames the rAF chain sleeps and
    // a light 300ms poll watches for movement (scroll resumes the chain).
    // No visible difference — pure battery savings on a page that otherwise
    // spins rAF forever.
    let settledFrames = 0;
    let pollHandle: number | null = null;
    // True while the rAF chain is parked. Scroll/wheel/touch input wakes it
    // instantly (no waiting for the next poll tick) — otherwise the film
    // feels unresponsive for up to one poll interval after every idle nap.
    let parked = false;

    const targetPosNow = () => {
      const framesLength = frameIndicesRef.current.length;
      if (framesLength === 0) return null;
      return Math.min(
        framesLength - 1,
        Math.max(0, progressRef.current * (framesLength - 1))
      );
    };

    const resumeLoop = () => {
      if (pollHandle !== null) {
        window.clearTimeout(pollHandle);
        pollHandle = null;
      }
      parked = false;
      settledFrames = 0;
      lastTime = performance.now();
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    // Event-driven wake: any scroll intent resumes the loop immediately.
    // Lenis drives native scroll position, so these fire for wheel, touch,
    // keyboard, and programmatic scrolls alike.
    const wake = () => {
      if (!active || !parked) return;
      resumeLoop();
    };

    const checkPoll = () => {
      if (!active) return;
      const targetPos = targetPosNow();
      if (targetPos === null) {
        pollHandle = window.setTimeout(checkPoll, 300);
        return;
      }
      if (Math.abs(targetPos - currentPosRef.current) > 0.005) {
        resumeLoop();
        return;
      }
      pollHandle = window.setTimeout(checkPoll, 300);
    };

    const renderLoop = (time: number) => {
      if (!active) return;
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      const targetPos = targetPosNow();
      if (targetPos === null) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // High-precision exponential smoothing, frame-rate independent.
      // Factor 7 (was 9): silkier follow with no perceptible lag — the
      // film eases behind the scroll instead of chasing it rigidly.
      const diff = targetPos - currentPosRef.current;
      if (Math.abs(diff) > 0.005) {
        currentPosRef.current += diff * (1 - Math.exp(-dt * 7));
        settledFrames = 0;
      } else {
        currentPosRef.current = targetPos;
        settledFrames += 1;
      }

      const posToDraw = Math.round(currentPosRef.current);
      if (posToDraw !== drawnPosRef.current) {
        drawnPosRef.current = posToDraw;
        drawFrame(posToDraw);
      }

      if (settledFrames > 90) {
        parked = true;
        pollHandle = window.setTimeout(checkPoll, 300);
        return;
      }
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("wheel", wake, { passive: true });
    window.addEventListener("touchmove", wake, { passive: true });

    return () => {
      active = false;
      window.removeEventListener("scroll", wake);
      window.removeEventListener("wheel", wake);
      window.removeEventListener("touchmove", wake);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pollHandle !== null) {
        window.clearTimeout(pollHandle);
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
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-cacao-950">
      {/* High Performance 2D/3D Scrubber Canvas */}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Cinematic film still of cacao and chocolate craftsmanship, changes with scroll"
        className="w-full h-full object-cover transition-opacity duration-1000"
        style={{
          filter: "contrast(1.04) brightness(0.88)",
        }}
      />

      {/* Cinematic Vignette & Luxury Dark Contrast Gradients */}
      {/* Top soft vignette for navigation readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cacao-950/90 via-cacao-950/40 to-transparent" />

      {/* Left heavy gradient for editorial typography contrast */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-cacao-950/92 via-cacao-950/75 to-transparent" />

      {/* Center-weighted scrim for centered moments (Nocturne hero, tasting,
          reserve drop, finale): soft radial darkening that preserves the
          frame edges while lifting centered ivory/copper type */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,6,4,0.5),transparent_72%)]" />

      {/* Bottom vignette for chapter navigation and footer transition */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-cacao-950 via-cacao-950/60 to-transparent" />

      {/* Subtle organic warm copper radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(155,103,66,0.12),transparent_70%)] mix-blend-screen" />

      {/* Micro film grain overlay */}
      <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />

      {/* Minimalistic initial preloading status */}
      {loadedCount < LOADER_VISIBLE_FRAMES && (
        <div className="absolute bottom-6 left-6 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-copper-text">
          <span className="w-1.5 h-1.5 rounded-full bg-copper animate-ping" />
          <span>
            Cinematic Frames Initializing ({loadedCount}/{activeSetSize})
          </span>
        </div>
      )}
    </div>
  );
}


