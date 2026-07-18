"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "ocean" | "forest" | "sunset" | "purple";
type Accent = "sky" | "emerald" | "amber" | "rose" | "violet";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  accent: "sky",
  setAccent: () => {},
  mounted: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<Accent>("sky");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("portfolio-theme") as Theme | null;
    const storedAccent = localStorage.getItem("portfolio-accent") as Accent | null;
    if (storedTheme) setTheme(storedTheme);
    if (storedAccent) setAccent(storedAccent);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem("portfolio-accent", accent);
  }, [accent, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent, mounted }}>
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
  { key: "sunset", label: "Sunset", icon: "🌅" },
  { key: "purple", label: "Purple", icon: "🔮" },
];

const ACCENTS: { key: Accent; label: string; color: string }[] = [
  { key: "sky", label: "Sky", color: "#38BDF8" },
  { key: "emerald", label: "Emerald", color: "#34D399" },
  { key: "amber", label: "Amber", color: "#FBBF24" },
  { key: "rose", label: "Rose", color: "#FB7185" },
  { key: "violet", label: "Violet", color: "#A855F7" },
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
      {mounted ? <>{current?.icon} {current?.label}</> : "\u2600\uFE0F Theme"}
    </button>
  );
}

export { THEMES, ACCENTS };
export type { Accent };
