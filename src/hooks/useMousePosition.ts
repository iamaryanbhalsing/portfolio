"use client";

import { useEffect, useRef, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
}

type Listener = (pos: MousePosition) => void;

const position: MousePosition = { x: -100, y: -100 };
const listeners: Set<Listener> = new Set();
let rafId = 0;
let initialized = false;

function initMouseTracking() {
  if (initialized) return;
  initialized = true;

  const handleMouseMove = (e: MouseEvent) => {
    position.x = e.clientX;
    position.y = e.clientY;
  };

  const tick = () => {
    listeners.forEach((cb) => cb(position));
    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  rafId = requestAnimationFrame(tick);
}

export function useMousePosition() {
  const subscribe = useCallback((callback: Listener) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }, []);

  useEffect(() => {
    initMouseTracking();
    return () => {
      // Don't cancel RAF or remove listener here — other instances may use them
    };
  }, []);

  return { position, subscribe };
}
