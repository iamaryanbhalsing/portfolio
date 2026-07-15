"use client";

import { useState, useEffect, forwardRef, useCallback } from "react";

interface TerminalInputProps {
  onSubmit: (input: string) => void;
  onHistoryUp: () => void;
  onHistoryDown: () => void;
  historyValue: string;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ onSubmit, onHistoryUp, onHistoryDown, historyValue }, ref) => {
    const [value, setValue] = useState("");
    const [inputFocused, setInputFocused] = useState(true);

    useEffect(() => {
      if (typeof ref === "object" && ref?.current) {
        ref.current.focus();
      }
    }, [ref]);

    useEffect(() => {
      if (historyValue) {
        setValue(historyValue);
      }
    }, [historyValue]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          onSubmit(value);
          setValue("");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          onHistoryUp();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          onHistoryDown();
        } else if (e.key === "l" && e.ctrlKey) {
          e.preventDefault();
          onSubmit("clear");
          setValue("");
        }
      },
      [value, onSubmit, onHistoryUp, onHistoryDown]
    );

    return (
      <div className="terminal-line terminal-input-container" onClick={() => ref && typeof ref === "object" && ref.current?.focus()}>
        <span className="terminal-prompt">visitor@portfolio:~$</span>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          className="terminal-real-input"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
        <span className={`terminal-cursor ${inputFocused ? "blink" : ""}`}>█</span>
      </div>
    );
  }
);

TerminalInput.displayName = "TerminalInput";
