"use client";

import { useState, useEffect } from "react";

export type DeviceTier = "HIGH" | "MEDIUM" | "LOW" | "VERY_LOW";

export function useDeviceCapability(): {
  tier: DeviceTier;
  hasWebGL: boolean;
  particleCount: number;
} {
  const [capability, setCapability] = useState<{
    tier: DeviceTier;
    hasWebGL: boolean;
    particleCount: number;
  }>({
    tier: "HIGH",
    hasWebGL: true,
    particleCount: 160,
  });

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

      if (!gl) {
        setCapability({
          tier: "VERY_LOW",
          hasWebGL: false,
          particleCount: 0,
        });
        return;
      }

      // Check device memory and concurrency if available
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        hardwareConcurrency?: number;
      };
      const mem = nav.deviceMemory || 8;
      const cores = nav.hardwareConcurrency || 8;
      const isMobile = window.innerWidth < 768;

      if (mem <= 2 || cores <= 2) {
        setCapability({
          tier: "LOW",
          hasWebGL: true,
          particleCount: 40,
        });
      } else if (mem <= 4 || cores <= 4 || isMobile) {
        setCapability({
          tier: "MEDIUM",
          hasWebGL: true,
          particleCount: 80,
        });
      } else {
        setCapability({
          tier: "HIGH",
          hasWebGL: true,
          particleCount: 180,
        });
      }
    } catch {
      setCapability({
        tier: "MEDIUM",
        hasWebGL: true,
        particleCount: 80,
      });
    }
  }, []);

  return capability;
}
