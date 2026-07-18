"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useCursorContext } from "./CursorProvider";
import { CURSOR_THEMES } from "./CursorThemes";

const CURSOR_COLORS: Record<string, string> = {
  dark: "255, 255, 255",
  projects: "129, 140, 248",
  skills: "34, 197, 94",
  experience: "251, 191, 36",
  contact: "56, 189, 248",
};

const SECTION_SECONDARY: Record<string, string> = {
  dark: "180, 180, 220",
  projects: "99, 102, 241",
  skills: "22, 163, 74",
  experience: "217, 119, 6",
  contact: "14, 165, 233",
};

function getScaleForState(state: string): number {
  switch (state) {
    case "link": return 2.8;
    case "button": return 3.5;
    case "text": return 1.8;
    case "project": return 4.5;
    case "terminal": return 2.2;
    default: return 1;
  }
}

function getDotScaleForState(state: string): number {
  switch (state) {
    case "link": return 0.4;
    case "button": return 0;
    case "text": return 0.2;
    case "terminal": return 0.5;
    default: return 1;
  }
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const crosshairHRef = useRef<HTMLDivElement>(null);
  const crosshairVRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rippleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringPos = useRef({ x: 0, y: 0 });
  const blobPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef(Array.from({ length: 10 }, () => ({ x: 0, y: 0 })));
  const mousePos = useRef({ x: 0, y: 0 });
  const mouseVel = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0, t: 0 });
  const animFrame = useRef(0);
  const orbitAngle = useRef(0);

  const { subscribe } = useMousePosition();
  const { cursorState, cursorTheme } = useCursorContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  const activeTheme = useActiveSection();
  const [isVisible, setIsVisible] = useState(false);

  const theme = CURSOR_THEMES[cursorTheme] || CURSOR_THEMES.orbit;
  const cursorColor = CURSOR_COLORS[activeTheme] || "255, 255, 255";
  const secondaryColor = SECTION_SECONDARY[activeTheme] || "180, 180, 220";

  const getMorphRadius = useCallback((t: number) => {
    const r1 = 42 + Math.sin(t * 0.003) * 8;
    const r2 = 38 + Math.cos(t * 0.004) * 6;
    const r3 = 44 + Math.sin(t * 0.002 + 1) * 7;
    const r4 = 40 + Math.cos(t * 0.005 + 2) * 5;
    return `${r1}% ${100 - r1}% ${r2}% ${100 - r2}% / ${r3}% ${r4}% ${100 - r4}% ${100 - r3}%`;
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);
    document.body.addEventListener("mouseenter", handleEnter);
    document.body.addEventListener("mouseleave", handleLeave);

    const unsub = subscribe((pos) => {
      const now = performance.now();
      const dt = Math.max(now - lastMouse.current.t, 1);
      mouseVel.current.x = (pos.x - lastMouse.current.x) / dt;
      mouseVel.current.y = (pos.y - lastMouse.current.y) / dt;
      lastMouse.current = { x: pos.x, y: pos.y, t: now };
      mousePos.current = pos;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }

      const damping = prefersReducedMotion ? 1 : 0.1;

      if (theme.ring.enabled && ringRef.current) {
        ringPos.current.x += (pos.x - ringPos.current.x) * damping;
        ringPos.current.y += (pos.y - ringPos.current.y) * damping;
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }

      if (theme.dot.morph && blobRef.current) {
        blobPos.current.x += (pos.x - blobPos.current.x) * damping;
        blobPos.current.y += (pos.y - blobPos.current.y) * damping;
      }

      if (cursorTheme === "vortex") {
        if (crosshairHRef.current) {
          crosshairHRef.current.style.transform = `translate(${ringPos.current.x - theme.ring.size / 2}px, ${ringPos.current.y}px)`;
        }
        if (crosshairVRef.current) {
          crosshairVRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y - theme.ring.size / 2}px)`;
        }
      }

      if (theme.trail.enabled) {
        trailRefs.current.forEach((el, i) => {
          if (!el) return;
          const delay = (i + 1) * 0.05;
          trailPos.current[i].x += (pos.x - trailPos.current[i].x) * delay;
          trailPos.current[i].y += (pos.y - trailPos.current[i].y) * delay;
          el.style.transform = `translate(${trailPos.current[i].x}px, ${trailPos.current[i].y}px) translate(-50%, -50%)`;
        });
      }
    });

    const animate = () => {
      const t = performance.now();
      const vel = Math.sqrt(mouseVel.current.x ** 2 + mouseVel.current.y ** 2);

      if (theme.orbit.enabled) {
        orbitAngle.current += theme.orbit.speed * 0.02 * (1 + vel * 0.5);
        const { radius } = theme.orbit;
        orbitRefs.current.forEach((el, i) => {
          if (!el) return;
          const angle = orbitAngle.current + (i * Math.PI * 2) / theme.orbit.count;
          const wobble = Math.sin(t * 0.002 + i) * 3;
          const x = mousePos.current.x + Math.cos(angle) * (radius + wobble);
          const y = mousePos.current.y + Math.sin(angle) * (radius + wobble);
          el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
          const pulse = 0.4 + Math.sin(t * 0.005 + i * 0.5) * 0.3;
          el.style.opacity = isVisible ? `${pulse}` : "0";
        });
      }

      if (theme.dot.morph && blobRef.current) {
        blobRef.current.style.transform = `translate(${blobPos.current.x}px, ${blobPos.current.y}px) translate(-50%, -50%)`;
        blobRef.current.style.borderRadius = getMorphRadius(t);
      }

      if (theme.trail.enabled && theme.trail.sparkle) {
        trailRefs.current.forEach((el, i) => {
          if (!el) return;
          const size = theme.trail.size * (1 - (i / theme.trail.count) * 0.5);
          const sparkleSize = size * (0.5 + Math.sin(t * 0.003 + i * 1.2) * 0.3);
          el.style.width = `${sparkleSize}px`;
          el.style.height = `${sparkleSize}px`;
        });
      }

      if (theme.ripple.enabled) {
        rippleRefs.current.forEach((el, i) => {
          if (!el) return;
          const phase = ((t * 0.001 + i * 0.8) % 3) / 3;
          const scale = 0.8 + phase * 2.2;
          const opacity = (1 - phase) * 0.5;
          el.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${scale})`;
          el.style.opacity = isVisible ? `${opacity}` : "0";
        });
      }

      if (theme.ring.spinning && ringRef.current) {
        ringRef.current.style.setProperty("--spin", `${t * 0.05}deg`);
      }

      animFrame.current = requestAnimationFrame(animate);
    };

    animFrame.current = requestAnimationFrame(animate);

    return () => {
      document.body.removeEventListener("mouseenter", handleEnter);
      document.body.removeEventListener("mouseleave", handleLeave);
      unsub();
      cancelAnimationFrame(animFrame.current);
    };
  }, [subscribe, prefersReducedMotion, isTouchDevice, theme, isVisible, getMorphRadius]);

  if (isTouchDevice) return null;

  const isHovering = cursorState !== "default";
  const ringScale = isHovering ? getScaleForState(cursorState) : 1;
  const dotScale = isHovering ? getDotScaleForState(cursorState) : 1;
  const isTerminal = cursorState === "terminal";
  const color = isTerminal ? "74, 246, 38" : cursorColor;
  const secColor = isTerminal ? "34, 197, 94" : secondaryColor;

  const glowLayers = theme.dot.glowIntensity;
  const dotGlow = theme.dot.glow
    ? `0 0 ${6 * glowLayers}px rgba(${color}, 0.9), 0 0 ${12 * glowLayers}px rgba(${color}, 0.6), 0 0 ${24 * glowLayers}px rgba(${color}, 0.3), 0 0 ${40 * glowLayers}px rgba(${color}, 0.15)`
    : `0 0 10px rgba(${color}, 0.5)`;

  const ringGlow = theme.ring.glow
    ? `0 0 ${15 + (isHovering ? 10 : 0)}px rgba(${color}, ${isHovering ? 0.5 : 0.2}), 0 0 ${30 + (isHovering ? 15 : 0)}px rgba(${color}, ${isHovering ? 0.3 : 0.1})`
    : "none";

  return (
    <>
      {/* Ripple waves (Pulse theme) */}
      {theme.ripple.enabled &&
        [...Array(theme.ripple.count)].map((_, i) => (
          <div
            key={`ripple-${i}`}
            ref={(el) => { rippleRefs.current[i] = el; }}
            className="cursor-ripple"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: theme.ring.size,
              height: theme.ring.size,
              border: `1.5px solid rgba(${color}, 0.3)`,
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 99996,
              willChange: "transform, opacity",
            }}
          />
        ))}

      {/* Orbit particles */}
      {theme.orbit.enabled &&
        [...Array(theme.orbit.count)].map((_, i) => (
          <div
            key={`orbit-${i}`}
            ref={(el) => { orbitRefs.current[i] = el; }}
            className="cursor-orbit-dot"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: theme.orbit.dotSize,
              height: theme.orbit.dotSize,
              borderRadius: "50%",
              background: i % 2 === 0 ? `rgb(${color})` : `rgb(${secColor})`,
              pointerEvents: "none",
              zIndex: 99997,
              willChange: "transform, opacity",
              boxShadow: `0 0 ${theme.orbit.dotSize * 2}px rgba(${color}, 0.6)`,
              transition: "opacity 0.3s ease",
            }}
          />
        ))}

      {/* Trail particles (Splash / Sparkle / Vortex) */}
      {theme.trail.enabled &&
        [...Array(theme.trail.count)].map((_, i) => {
          const progress = i / theme.trail.count;
          const size = theme.trail.size * (1 - progress * 0.5);
          const opacity = (1 - progress) * 0.7;

          if (theme.trail.sparkle) {
            return (
              <div
                key={`trail-${i}`}
                ref={(el) => { trailRefs.current[i] = el; }}
                className="cursor-trail cursor-sparkle"
                style={{
                  opacity: isVisible ? opacity : 0,
                  width: size,
                  height: size,
                  background: i % 3 === 0 ? `rgb(${color})` : i % 3 === 1 ? `rgb(${secColor})` : "rgba(255,255,255,0.9)",
                  boxShadow: `0 0 ${size * 3}px rgba(${color}, 0.8)`,
                  clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                }}
              />
            );
          }

          return (
            <div
              key={`trail-${i}`}
              ref={(el) => { trailRefs.current[i] = el; }}
              className="cursor-trail"
              style={{
                opacity: isVisible ? opacity : 0,
                width: size,
                height: size,
                borderRadius: theme.dot.morph ? `${40 + Math.sin(i) * 20}% ${60 - Math.sin(i) * 20}%` : "50%",
                background: `rgba(${color}, ${0.8 - progress * 0.5})`,
                filter: theme.trail.glow
                  ? `blur(${0.5 + progress}px) drop-shadow(0 0 ${4 + progress * 3}px rgba(${color}, ${0.7 - progress * 0.4}))`
                  : "none",
              }}
            />
          );
        })}

      {/* Crosshair lines (Vortex theme) */}
      {cursorTheme === "vortex" && (
        <>
          <div
            ref={crosshairHRef}
            className="cursor-crosshair-line cursor-crosshair-h"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: 1.5,
              width: theme.ring.size,
              pointerEvents: "none",
              zIndex: 99997,
              willChange: "transform",
              background: `linear-gradient(90deg, transparent, rgba(${color}, 0.5), transparent)`,
              transformOrigin: "left center",
              opacity: isVisible ? 1 : 0,
            }}
          />
          <div
            ref={crosshairVRef}
            className="cursor-crosshair-line cursor-crosshair-v"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 1.5,
              height: theme.ring.size,
              pointerEvents: "none",
              zIndex: 99997,
              willChange: "transform",
              background: `linear-gradient(180deg, transparent, rgba(${color}, 0.5), transparent)`,
              transformOrigin: "center top",
              opacity: isVisible ? 1 : 0,
            }}
          />
        </>
      )}

      {/* Outer ring */}
      {theme.ring.enabled && (
        <div
          ref={ringRef}
          className={`cursor-ring ${theme.ring.spinning ? "cursor-ring-spin" : ""}`}
          style={{
            opacity: isVisible ? 1 : 0,
            width: theme.ring.size,
            height: theme.ring.size,
            transform: `scale(${ringScale})${theme.ring.spinning ? " rotate(var(--spin, 0deg))" : ""}`,
            borderColor: `rgba(${color}, ${isHovering ? 0.7 : 0.3})`,
            boxShadow: ringGlow,
            background: theme.ring.spinning
              ? `conic-gradient(from 0deg, rgba(${color}, 0.15), transparent 40%, rgba(${color}, 0.08), transparent 80%, rgba(${color}, 0.15))`
              : "transparent",
            borderWidth: theme.ring.spinning ? "2px" : "1.5px",
          }}
        />
      )}

      {/* Morph blob (Splash theme) */}
      {theme.dot.morph && (
        <div
          ref={blobRef}
          className="cursor-blob"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: theme.dot.size * 2,
            height: theme.dot.size * 2,
            pointerEvents: "none",
            zIndex: 99998,
            willChange: "transform, border-radius",
            background: `radial-gradient(circle, rgba(${color}, 0.25) 0%, rgba(${color}, 0.05) 70%, transparent 100%)`,
            filter: `blur(${4 + (isHovering ? 2 : 0)}px)`,
            opacity: isVisible ? (isHovering ? 0.9 : 0.6) : 0,
            transition: "opacity 0.3s ease, filter 0.3s ease",
          }}
        />
      )}

      {/* Center dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          opacity: isVisible ? 1 : 0,
          width: theme.dot.size,
          height: theme.dot.size,
          borderRadius: theme.dot.morph ? "40% 60% 55% 45% / 55% 45% 55% 45%" : "50%",
          transform: `scale(${dotScale})`,
          background: `radial-gradient(circle at 35% 35%, rgba(${color}, 1), rgba(${color}, 0.8))`,
          boxShadow: dotGlow,
          transition: "opacity 0.2s ease, transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), border-radius 0.5s ease",
        }}
      />
    </>
  );
}
