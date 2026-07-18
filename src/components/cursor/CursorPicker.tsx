"use client";

import { useState, useRef, useEffect } from "react";
import { useCursorContext } from "@/components/cursor/CursorProvider";
import { CURSOR_THEME_LIST } from "@/components/cursor/CursorThemes";

export function CursorPicker() {
  const { cursorTheme, setCursorTheme } = useCursorContext();
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

  const current = CURSOR_THEME_LIST.find((t) => t.key === cursorTheme);

  return (
    <div ref={pickerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border border-border/60 bg-surface/80 text-muted-foreground hover:text-foreground hover:border-brand/30 transition-all duration-200"
        title="Cursor style"
      >
        <span className="text-sm leading-none">{current?.icon}</span>
        Cursor
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 p-2 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-xl shadow-background/50 z-50 min-w-[140px]">
          {CURSOR_THEME_LIST.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setCursorTheme(t.key);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                cursorTheme === t.key
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <span className="text-sm leading-none w-4 text-center">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
