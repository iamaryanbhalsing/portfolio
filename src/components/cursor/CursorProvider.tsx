"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CursorThemeKey } from "./CursorThemes";

export type CursorVariant =
  | "default"
  | "link"
  | "button"
  | "text"
  | "project"
  | "terminal";

interface CursorContextValue {
  cursorState: CursorVariant;
  setCursorState: (state: CursorVariant) => void;
  cursorTheme: CursorThemeKey;
  setCursorTheme: (theme: CursorThemeKey) => void;
}

const CursorContext = createContext<CursorContextValue>({
  cursorState: "default",
  setCursorState: () => {},
  cursorTheme: "orbit",
  setCursorTheme: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorVariant>("default");
  const [cursorTheme, setCursorThemeState] = useState<CursorThemeKey>("orbit");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-cursor-theme") as CursorThemeKey | null;
    if (stored) setCursorThemeState(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("portfolio-cursor-theme", cursorTheme);
  }, [cursorTheme, mounted]);

  const setCursorTheme = useCallback((theme: CursorThemeKey) => {
    setCursorThemeState(theme);
  }, []);

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState, cursorTheme, setCursorTheme }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursorContext() {
  return useContext(CursorContext);
}

export function useCursorState(variant: CursorVariant = "link") {
  const { setCursorState } = useCursorContext();

  const onMouseEnter = useCallback(() => {
    setCursorState(variant);
  }, [variant, setCursorState]);

  const onMouseLeave = useCallback(() => {
    setCursorState("default");
  }, [setCursorState]);

  return { onMouseEnter, onMouseLeave };
}
