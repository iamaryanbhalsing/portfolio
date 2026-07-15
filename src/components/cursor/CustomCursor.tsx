"use client";

import { useEffect, useRef, useState } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useCursorContext } from "./CursorProvider";

const CURSOR_COLORS: Record<string, string> = {
  dark: "255, 255, 255",
  projects: "129, 140, 248",
  skills: "34, 197, 94",
  experience: "251, 191, 36",
  contact: "56, 189, 248",
};

function getScaleForState(state: string): number {
  switch (state) {
    case "link": return 2.5;
    case "button": return 3;
    case "text": return 1.5;
    case "project": return 4;
    case "terminal": return 2;
    default: return 1;
  }
}

function getDotScaleForState(state: string): number {
  switch (state) {
    case "link": return 0.5;
    case "button": return 0;
    case "text": return 0.3;
    case "terminal": return 0.6;
    default: return 1;
  }
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef(Array.from({ length: 6 }, () => ({ x: 0, y: 0 })));

  const { subscribe } = useMousePosition();
  const { cursorState } = useCursorContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  const activeTheme = useActiveSection();
  const [isVisible, setIsVisible] = useState(false);

  const cursorColor = CURSOR_COLORS[activeTheme] || "255, 255, 255";

  useEffect(() => {
    if (isTouchDevice) return;

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);
    document.body.addEventListener("mouseenter", handleEnter);
    document.body.addEventListener("mouseleave", handleLeave);

    const unsub = subscribe((pos) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }

      const damping = prefersReducedMotion ? 1 : 0.12;
      ringPos.current.x += (pos.x - ringPos.current.x) * damping;
      ringPos.current.y += (pos.y - ringPos.current.y) * damping;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const delay = (i + 1) * 0.06;
        trailPos.current[i].x += (pos.x - trailPos.current[i].x) * delay;
        trailPos.current[i].y += (pos.y - trailPos.current[i].y) * delay;
        el.style.transform = `translate(${trailPos.current[i].x}px, ${trailPos.current[i].y}px) translate(-50%, -50%)`;
      });
    });

    return () => {
      document.body.removeEventListener("mouseenter", handleEnter);
      document.body.removeEventListener("mouseleave", handleLeave);
      unsub();
    };
  }, [subscribe, prefersReducedMotion, isTouchDevice]);

  if (isTouchDevice) return null;

  const isHovering = cursorState !== "default";
  const ringScale = isHovering ? getScaleForState(cursorState) : 1;
  const dotScale = isHovering ? getDotScaleForState(cursorState) : 1;
  const isTerminal = cursorState === "terminal";
  const color = isTerminal ? "74, 246, 38" : cursorColor;

  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="cursor-trail"
          style={{
            opacity: isVisible ? 0.25 - i * 0.035 : 0,
            background: `rgba(${color}, ${0.4 - i * 0.06})`,
          }}
        />
      ))}

      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `scale(${ringScale})`,
          borderColor: `rgba(${color}, ${isHovering ? 0.8 : 0.4})`,
          boxShadow: isHovering ? `0 0 20px rgba(${color}, 0.3)` : "none",
        }}
      />

      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `scale(${dotScale})`,
          background: `rgb(${color})`,
          boxShadow: `0 0 10px rgba(${color}, 0.5)`,
        }}
      />
    </>
  );
}
