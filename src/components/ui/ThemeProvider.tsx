"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "ocean" | "forest";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

const THEMES: { key: Theme; label: string; icon: string }[] = [
  { key: "dark", label: "Midnight", icon: "🌙" },
  { key: "ocean", label: "Ocean", icon: "🌊" },
  { key: "forest", label: "Forest", icon: "🌿" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const idx = THEMES.findIndex((t) => t.key === theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next.key);
  };

  const current = THEMES.find((t) => t.key === theme);

  return (
    <button
      onClick={cycleTheme}
      className="px-3 py-1.5 rounded-full text-xs font-medium border border-border/60 bg-surface/80 text-muted-foreground hover:text-foreground hover:border-brand/30 transition-all duration-200"
      title={`Theme: ${current?.label}`}
    >
      {current?.icon} {current?.label}
    </button>
  );
}
