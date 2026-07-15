"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setPrefersReducedMotion(!mql.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}
