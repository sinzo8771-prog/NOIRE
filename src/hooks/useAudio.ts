"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export function useAudio() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Ambient warm room drone (very gentle 55Hz low warmth with 110Hz harmonic)
  const startAmbient = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Fully tear down any previous drone (stop AND disconnect) so repeated
    // toggles never leak oscillator/gain nodes into the audio graph
    if (ambientOscRef.current) {
      try {
        ambientOscRef.current.stop();
        ambientOscRef.current.disconnect();
      } catch {
        // ignore
      }
      ambientOscRef.current = null;
    }
    if (ambientGainRef.current) {
      try {
        ambientGainRef.current.disconnect();
      } catch {
        // ignore
      }
      ambientGainRef.current = null;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(55, ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    ambientOscRef.current = osc;
    ambientGainRef.current = gain;
  }, [getAudioContext]);

  const stopAmbient = useCallback(() => {
    if (ambientGainRef.current && audioCtxRef.current) {
      // Capture the exact nodes being faded out. If the user re-enables sound
      // before the 900ms timer fires, the captured references let us stop only
      // the retired drone — never the freshly started one.
      const oscToStop = ambientOscRef.current;
      const gainToFade = ambientGainRef.current;
      ambientGainRef.current.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtxRef.current.currentTime + 0.8
      );
      setTimeout(() => {
        if (oscToStop) {
          try {
            oscToStop.stop();
            oscToStop.disconnect();
          } catch {
            // ignore
          }
          if (ambientOscRef.current === oscToStop) {
            ambientOscRef.current = null;
          }
        }
        if (gainToFade) {
          try {
            gainToFade.disconnect();
          } catch {
            // ignore
          }
          if (ambientGainRef.current === gainToFade) {
            ambientGainRef.current = null;
          }
        }
      }, 900);
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        startAmbient();
      } else {
        stopAmbient();
      }
      return next;
    });
  }, [startAmbient, stopAmbient]);

  // Tactile chocolate snap sound
  const playSnap = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(1600, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(3, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(ctx.destination);

    // Also a subtle wooden resonance thump
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.3, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    whiteNoise.start();
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }, [soundEnabled, getAudioContext]);

  // Subtle paper/wrapper tactile tick
  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }, [soundEnabled, getAudioContext]);

  useEffect(() => {
    return () => {
      if (ambientOscRef.current) {
        try {
          ambientOscRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playSnap,
    playTick,
  };
}
