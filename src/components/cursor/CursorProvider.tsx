"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
}

const CursorContext = createContext<CursorContextValue>({
  cursorState: "default",
  setCursorState: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorVariant>("default");

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState }}>
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
