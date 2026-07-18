"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme, ACCENTS } from "@/components/ui/ThemeProvider";

export function AccentPicker() {
  const { accent, setAccent, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = mounted ? ACCENTS.find((a) => a.key === accent) : ACCENTS[0];

  return (
    <div ref={pickerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border border-border/60 bg-surface/80 text-muted-foreground hover:text-foreground hover:border-brand/30 transition-all duration-200"
        title="Accent color"
      >
        <span
          className="w-3 h-3 rounded-full border border-white/20 transition-colors duration-300"
          style={{ backgroundColor: current?.color }}
        />
        Accent
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 p-2 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-xl shadow-background/50 z-50 flex gap-1.5">
          {ACCENTS.map((a) => (
            <button
              key={a.key}
              onClick={() => {
                setAccent(a.key);
                setIsOpen(false);
              }}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                accent === a.key
                  ? "border-foreground scale-110"
                  : "border-transparent hover:border-foreground/30"
              }`}
              style={{ backgroundColor: a.color }}
              title={a.label}
            />
          ))}
        </div>
      )}
    </div>
  );
}
