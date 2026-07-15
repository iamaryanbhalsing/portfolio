"use client";

import { useEffect, useRef } from "react";

interface SkillBarProps {
  name: string;
  proficiency: number;
  color: string;
  delay?: number;
}

export function SkillBar({ name, proficiency, color, delay = 0 }: SkillBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const filled = useRef(false);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !filled.current) {
            filled.current = true;
            const fill = el.querySelector(".skill-fill") as HTMLElement;
            if (fill) {
              setTimeout(() => {
                fill.style.width = `${proficiency}%`;
              }, delay);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [proficiency, delay]);

  return (
    <div ref={barRef} className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-foreground/90">{name}</span>
        <span className="text-xs font-mono text-muted-foreground">{proficiency}%</span>
      </div>
      <div className="relative h-2 rounded-full bg-border/50 overflow-hidden">
        <div
          className="skill-fill absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: "0%",
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: `0 0 12px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
