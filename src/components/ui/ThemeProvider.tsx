"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "ocean" | "forest";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme") as Theme | null;
    if (stored) setTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>
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
  const { theme, setTheme, mounted } = useTheme();

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
      title={mounted ? `Theme: ${current?.label}` : "Theme"}
    >
      {mounted ? <>{current?.icon} {current?.label}</> : "🌙 Theme"}
    </button>
  );
}
