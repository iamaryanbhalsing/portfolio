"use client";

import { useState, useCallback } from "react";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useCursorState } from "@/components/cursor/CursorProvider";
import { TerminalWindow } from "./TerminalWindow";
import { TerminalToggle } from "./TerminalToggle";

export function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const cursorHandlers = useCursorState("terminal");

  const toggleTerminal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useKeyboardShortcut({
    key: "`",
    ctrlKey: true,
    onTrigger: toggleTerminal,
  });

  useKeyboardShortcut({
    key: "Escape",
    onTrigger: () => setIsOpen(false),
    enabled: isOpen,
  });

  return (
    <>
      <div {...cursorHandlers}>
        <TerminalToggle onClick={toggleTerminal} />
      </div>
      {isOpen && (
        <TerminalWindow
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
