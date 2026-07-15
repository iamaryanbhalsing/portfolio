"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  onTrigger: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcut({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  onTrigger,
  enabled = true,
}: KeyboardShortcutOptions) {
  const handler = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const ctrlMatch = ctrlKey ? event.ctrlKey || event.metaKey : true;
      const metaMatch = metaKey ? event.metaKey : true;
      const shiftMatch = shiftKey ? event.shiftKey : !shiftKey || event.shiftKey;

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        ctrlMatch && metaMatch && shiftMatch
      ) {
        event.preventDefault();
        event.stopPropagation();
        onTrigger();
      }
    },
    [key, ctrlKey, metaKey, shiftKey, onTrigger, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, [handler]);
}
