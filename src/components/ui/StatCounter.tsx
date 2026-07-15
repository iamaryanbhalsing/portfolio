"use client";

import { useEffect, useRef } from "react";
import { animateCounter } from "@/lib/anime";

interface StatCounterProps {
  target: number;
  suffix?: string;
  label: string;
  duration?: number;
  delay?: number;
}

export function StatCounter({
  target,
  suffix = "",
  label,
  duration = 1500,
  delay = 0,
}: StatCounterProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            setTimeout(() => {
              animateCounter(el, target, duration, suffix);
            }, delay);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, duration, delay]);

  return (
    <div className="flex items-center gap-2">
      <span ref={numberRef} className="font-semibold text-foreground">
        0
      </span>
      <span>{label}</span>
    </div>
  );
}
