export type CursorThemeKey = "orbit" | "splash" | "sparkle" | "vortex" | "pulse";

export interface CursorThemeConfig {
  key: CursorThemeKey;
  label: string;
  icon: string;
  dot: {
    size: number;
    glow: boolean;
    glowIntensity: number;
    morph: boolean;
  };
  ring: {
    enabled: boolean;
    size: number;
    pulsing: boolean;
    spinning: boolean;
    glow: boolean;
  };
  trail: {
    enabled: boolean;
    count: number;
    size: number;
    glow: boolean;
    sparkle: boolean;
  };
  orbit: {
    enabled: boolean;
    count: number;
    radius: number;
    speed: number;
    dotSize: number;
  };
  ripple: {
    enabled: boolean;
    count: number;
  };
}

export const CURSOR_THEMES: Record<CursorThemeKey, CursorThemeConfig> = {
  orbit: {
    key: "orbit",
    label: "Orbit",
    icon: "◉",
    dot: { size: 8, glow: true, glowIntensity: 1.2, morph: false },
    ring: { enabled: true, size: 44, pulsing: true, spinning: false, glow: true },
    trail: { enabled: false, count: 0, size: 0, glow: false, sparkle: false },
    orbit: { enabled: true, count: 6, radius: 30, speed: 3, dotSize: 3 },
    ripple: { enabled: false, count: 0 },
  },
  splash: {
    key: "splash",
    label: "Splash",
    icon: "◎",
    dot: { size: 14, glow: true, glowIntensity: 0.8, morph: true },
    ring: { enabled: true, size: 38, pulsing: false, spinning: false, glow: true },
    trail: { enabled: true, count: 5, size: 6, glow: true, sparkle: false },
    orbit: { enabled: false, count: 0, radius: 0, speed: 0, dotSize: 0 },
    ripple: { enabled: false, count: 0 },
  },
  sparkle: {
    key: "sparkle",
    label: "Sparkle",
    icon: "✦",
    dot: { size: 6, glow: true, glowIntensity: 1.5, morph: false },
    ring: { enabled: false, size: 0, pulsing: false, spinning: false, glow: false },
    trail: { enabled: true, count: 10, size: 4, glow: true, sparkle: true },
    orbit: { enabled: false, count: 0, radius: 0, speed: 0, dotSize: 0 },
    ripple: { enabled: false, count: 0 },
  },
  vortex: {
    key: "vortex",
    label: "Vortex",
    icon: "🌀",
    dot: { size: 6, glow: true, glowIntensity: 1, morph: false },
    ring: { enabled: true, size: 50, pulsing: false, spinning: true, glow: true },
    trail: { enabled: true, count: 8, size: 3, glow: true, sparkle: false },
    orbit: { enabled: false, count: 0, radius: 0, speed: 0, dotSize: 0 },
    ripple: { enabled: false, count: 0 },
  },
  pulse: {
    key: "pulse",
    label: "Pulse",
    icon: "◎",
    dot: { size: 10, glow: true, glowIntensity: 1, morph: false },
    ring: { enabled: true, size: 40, pulsing: true, spinning: false, glow: true },
    trail: { enabled: false, count: 0, size: 0, glow: false, sparkle: false },
    orbit: { enabled: false, count: 0, radius: 0, speed: 0, dotSize: 0 },
    ripple: { enabled: true, count: 3 },
  },
};

export const CURSOR_THEME_LIST = Object.values(CURSOR_THEMES);
