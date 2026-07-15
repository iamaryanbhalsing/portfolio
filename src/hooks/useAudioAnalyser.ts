"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface AudioLevels {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
}

const EMPTY_LEVELS: AudioLevels = { bass: 0, mid: 0, treble: 0, energy: 0 };

export function useAudioAnalyser(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const rafRef = useRef<number>(0);
  const [levels, setLevels] = useState<AudioLevels>(EMPTY_LEVELS);
  const [isReady, setIsReady] = useState(false);

  const initContext = useCallback(() => {
    if (contextRef.current) return;

    const audio = audioRef.current;
    if (!audio) return;

    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      contextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
      setIsReady(true);
    } catch {
      // AudioContext not available or already connected
    }
  }, [audioRef]);

  const analyze = useCallback(() => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !dataArray) return;

    analyser.getByteFrequencyData(dataArray);

    // Split frequency bins into bass (0-10), mid (10-80), treble (80-128)
    const binCount = dataArray.length;
    let bassSum = 0, midSum = 0, trebleSum = 0;

    const bassEnd = Math.floor(binCount * 0.08);
    const midEnd = Math.floor(binCount * 0.6);

    for (let i = 0; i < binCount; i++) {
      const val = dataArray[i] / 255;
      if (i < bassEnd) bassSum += val;
      else if (i < midEnd) midSum += val;
      else trebleSum += val;
    }

    const bass = bassEnd > 0 ? bassSum / bassEnd : 0;
    const mid = (midEnd - bassEnd) > 0 ? midSum / (midEnd - bassEnd) : 0;
    const treble = (binCount - midEnd) > 0 ? trebleSum / (binCount - midEnd) : 0;
    const energy = (bass * 0.5 + mid * 0.3 + treble * 0.2);

    setLevels({ bass, mid, treble, energy });
    rafRef.current = requestAnimationFrame(analyze);
  }, []);

  const startAnalyzing = useCallback(() => {
    initContext();
    if (analyserRef.current) {
      rafRef.current = requestAnimationFrame(analyze);
    }
  }, [initContext, analyze]);

  const stopAnalyzing = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setLevels(EMPTY_LEVELS);
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { levels, isReady, startAnalyzing, stopAnalyzing };
}
