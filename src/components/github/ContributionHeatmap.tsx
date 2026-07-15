"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { animateSectionEntry } from "@/lib/anime";

const LEVELS = ["#0e1117", "#004d1a", "#006d32", "#26a641", "#39d353"];

function generateContributions(): number[] {
  const data: number[] = [];
  for (let i = 0; i < 364; i++) {
    const rand = Math.random();
    if (rand < 0.35) data.push(0);
    else if (rand < 0.6) data.push(1);
    else if (rand < 0.8) data.push(2);
    else if (rand < 0.93) data.push(3);
    else data.push(4);
  }
  return data;
}

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ContributionHeatmap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const [contributions, setContributions] = useState<number[]>([]);

  useEffect(() => {
    setContributions(generateContributions());
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            animateSectionEntry("#github .github-content");

            const rects = svgRef.current?.querySelectorAll("rect[data-cell]");
            if (rects) {
              rects.forEach((rect, i) => {
                animate(rect, {
                  opacity: [0, 1],
                  scale: [0.3, 1],
                  duration: 300,
                  delay: i * 2,
                  ease: "outExpo",
                });
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

  const cellSize = 11;
  const cellGap = 2;
  const totalSize = cellSize + cellGap;
  const weeks = 53;
  const days = 7;
  const labelWidth = 30;
  const headerHeight = 20;

  return (
    <section id="github" ref={sectionRef} className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1150px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          GitHub Activity
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm mb-12">
          Contribution activity over the past year.
        </p>

        <div
          className="github-content bg-surface/90 border border-border/60 backdrop-blur-md rounded-2xl p-6 overflow-x-auto"
          style={{ opacity: 0 }}
        >
          <svg
            ref={svgRef}
            width={labelWidth + weeks * totalSize}
            height={headerHeight + days * totalSize + 10}
            className="w-full h-auto"
          >
            {/* Month labels */}
            {MONTHS.map((month, i) => (
              <text
                key={month}
                x={labelWidth + i * (totalSize * 4.3)}
                y={12}
                fill="#888"
                fontSize="10"
                fontFamily="var(--font-sans)"
              >
                {month}
              </text>
            ))}

            {/* Day labels */}
            {["", "Mon", "", "Wed", "", "Fri", ""].map((day, i) => (
              <text
                key={i}
                x={0}
                y={headerHeight + i * totalSize + cellSize - 1}
                fill="#888"
                fontSize="9"
                fontFamily="var(--font-sans)"
              >
                {day}
              </text>
            ))}

            {/* Contribution cells */}
            {contributions.length > 0 && contributions.map((count, i) => {
              const week = Math.floor(i / 7);
              const day = i % 7;
              const x = labelWidth + week * totalSize;
              const y = headerHeight + day * totalSize;
              const level = getLevel(count);

              return (
                <rect
                  key={i}
                  data-cell
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill={LEVELS[level]}
                  opacity={0}
                  style={{ cursor: "pointer" }}
                >
                  <title>{`${count} contributions`}</title>
                </rect>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            {LEVELS.map((color, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
