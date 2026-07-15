"use client";

import { useEffect, useRef } from "react";
import { audioState } from "@/lib/audioState";

export function AnimatedMesh() {
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const nodeCount = 25;
    const nodes: { x: number; y: number; vx: number; vy: number; baseR: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        baseR: 1.5,
      });
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });

    function animate() {
      const svg = svgRef.current;
      if (!svg) return;

      const { bass, mid, treble, energy } = audioState;
      const speedMultiplier = 1 + mid * 0.8;
      const radiusMultiplier = 1 + bass * 1.2;

      nodes.forEach((node) => {
        node.x += node.vx * speedMultiplier;
        node.y += node.vy * speedMultiplier;

        if (node.x < 0 || node.x > 100) node.vx *= -1;
        if (node.y < 0 || node.y > 100) node.vy *= -1;

        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 20) {
          node.vx -= dx * 0.001;
          node.vy -= dy * 0.001;
        }
      });

      const circles = svg.querySelectorAll("circle");
      const lines = svg.querySelectorAll("line");

      circles.forEach((circle, i) => {
        if (nodes[i]) {
          circle.setAttribute("cx", `${nodes[i].x}%`);
          circle.setAttribute("cy", `${nodes[i].y}%`);
          const r = nodes[i].baseR * radiusMultiplier;
          circle.setAttribute("r", `${r}`);
          circle.setAttribute("opacity", `${0.3 + energy * 0.5}`);
        }
      });

      let lineIdx = 0;
      const lineOpacityBoost = 1 + treble * 1.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (lines[lineIdx]) {
            const baseOpacity = dist < 25 ? (1 - dist / 25) * 0.3 : 0;
            const opacity = baseOpacity * lineOpacityBoost;
            lines[lineIdx].setAttribute("opacity", `${Math.min(opacity, 0.8)}`);
            lines[lineIdx].setAttribute("x1", `${nodes[i].x}%`);
            lines[lineIdx].setAttribute("y1", `${nodes[i].y}%`);
            lines[lineIdx].setAttribute("x2", `${nodes[j].x}%`);
            lines[lineIdx].setAttribute("y2", `${nodes[j].y}%`);
          }
          lineIdx++;
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const lineCount = (25 * 24) / 2;

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <circle
            key={`node-${i}`}
            r="1.5"
            fill="#38BDF8"
            opacity="0.4"
          />
        ))}
        {Array.from({ length: lineCount }).map((_, i) => (
          <line
            key={`line-${i}`}
            stroke="#38BDF8"
            strokeWidth="0.5"
            opacity="0"
          />
        ))}
      </svg>
    </div>
  );
}
