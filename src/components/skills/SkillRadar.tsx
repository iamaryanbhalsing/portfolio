"use client";

import { useEffect, useRef } from "react";
import { animateSectionEntry } from "@/lib/anime";
import { skillCategories } from "@/config/skills";

const CATEGORY_COLORS: Record<string, string> = {
  Languages: "#38BDF8",
  "Frameworks & Libraries": "#22C55E",
  "Security & OSINT": "#f59e0b",
  "Tools & Platforms": "#818cf8",
};

export function SkillRadar() {
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  const categories = skillCategories.map((cat) => {
    const avg =
      cat.skills.reduce((sum, s) => sum + s.proficiency, 0) / cat.skills.length;
    return { name: cat.title.split(" ")[0], value: avg, color: CATEGORY_COLORS[cat.title] || "#38BDF8" };
  });

  const size = 300;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const sides = categories.length;
  const angleStep = (Math.PI * 2) / sides;

  function getPoint(index: number, value: number) {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  function getAxisPoint(index: number) {
    return getPoint(index, 100);
  }

  const polygonPoints = categories
    .map((cat, i) => {
      const p = getPoint(i, cat.value);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const gridLevels = [20, 40, 60, 80, 100];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateSectionEntry("#skills-radar .radar-content");

            const polygon = svgRef.current?.querySelector("polygon.radar-shape") as SVGPolygonElement | null;
            if (polygon) {
              const perimeter = maxRadius * 2 * Math.PI;
              polygon.style.strokeDasharray = `${perimeter}`;
              polygon.style.strokeDashoffset = `${perimeter}`;
              polygon.style.transition = "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)";
              requestAnimationFrame(() => {
                polygon.style.strokeDashoffset = "0";
              });
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills-radar" ref={sectionRef} className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          Skills Overview
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-12">
          Proficiency across key skill areas.
        </p>

        <div
          className="radar-content flex justify-center"
          style={{ opacity: 0 }}
        >
          <div className="relative">
            <svg
              ref={svgRef}
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="w-full max-w-[300px] h-auto"
            >
              {/* Grid circles */}
              {gridLevels.map((level) => (
                <polygon
                  key={level}
                  points={categories
                    .map((_, i) => {
                      const p = getPoint(i, level);
                      return `${p.x},${p.y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.15)"
                  strokeWidth="1"
                />
              ))}

              {/* Axis lines */}
              {categories.map((_, i) => {
                const p = getAxisPoint(i);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={p.x}
                    y2={p.y}
                    stroke="rgba(148, 163, 184, 0.15)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data polygon */}
              <polygon
                className="radar-shape"
                points={polygonPoints}
                fill="rgba(56, 189, 248, 0.15)"
                stroke="#38BDF8"
                strokeWidth="2"
              />

              {/* Data points */}
              {categories.map((cat, i) => {
                const p = getPoint(i, cat.value);
                return (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill={cat.color}
                    stroke="rgba(15, 23, 42, 0.8)"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Labels */}
              {categories.map((cat, i) => {
                const p = getAxisPoint(i);
                const labelOffset = 18;
                const angle = angleStep * i - Math.PI / 2;
                const lx = p.x + Math.cos(angle) * labelOffset;
                const ly = p.y + Math.sin(angle) * labelOffset;

                return (
                  <text
                    key={i}
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="var(--font-sans)"
                    fontWeight="500"
                  >
                    {cat.name}
                  </text>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {categories.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                  <span className="font-medium text-foreground">{Math.round(cat.value)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
