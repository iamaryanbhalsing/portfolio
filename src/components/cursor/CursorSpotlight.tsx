"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

export function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();

  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    const el = spotlightRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      el.style.setProperty("--spotlight-x", `${e.clientX}px`);
      el.style.setProperty("--spotlight-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion, isTouchDevice]);

  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <div
      ref={spotlightRef}
      className="cursor-spotlight"
      aria-hidden="true"
    />
  );
}
