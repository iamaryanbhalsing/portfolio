"use client";

import { useEffect, useState } from "react";

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    const check = () => {
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasNoPointer = window.matchMedia("(pointer: none)").matches;
      const hasTouch = "ontouchstart" in window;
      setIsTouch(hasCoarsePointer || hasNoPointer || hasTouch);
    };

    check();
    const mql = window.matchMedia("(pointer: coarse)");
    mql.addEventListener("change", check);
    return () => mql.removeEventListener("change", check);
  }, []);

  return isTouch;
}
