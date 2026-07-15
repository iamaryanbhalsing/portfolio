"use client";

import { useEffect, useRef, useState } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";

export function TerminalWindow({ onClose }: { onClose: () => void }) {
  const { lines, processCommand, clearLines, navigateHistory, currentHistoryCommand, inputRef } = useTerminal();
  const [booted, setBooted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bootMessages = [
      { text: "Initializing portfolio terminal...", delay: 200 },
      { text: "Loading modules...", delay: 300 },
      { text: "Connecting to creative-engine...", delay: 250 },
      { text: "Compiling passion.exe...", delay: 350 },
      { text: "Verifying caffeine levels... OK", delay: 150 },
      { text: "", delay: 50 },
      { text: "Welcome! Type 'help' to get started.", delay: 0 },
    ];

    let i = 0;
    const runBoot = () => {
      if (i < bootMessages.length) {
        const msg = bootMessages[i];
        if (msg.text) {
          processCommand(`echo "${msg.text}"`);
          // Actually just add as system line
        }
        i++;
        setTimeout(runBoot, msg.delay);
      } else {
        setBooted(true);
      }
    };

    // Simpler: just set boot complete after delay
    const timer = setTimeout(() => setBooted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="terminal-overlay" onClick={onClose}>
      <div
        className="terminal-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="terminal-chrome">
          <div className="terminal-dots">
            <span className="terminal-dot terminal-dot-red" onClick={onClose} />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
          </div>
          <div className="terminal-title">portfolio — bash</div>
          <div className="terminal-dots invisible">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
          </div>
        </div>

        <div className="terminal-body" ref={containerRef}>
          {!booted && (
            <div className="terminal-line system">
              <span className="terminal-text typing-animation">Initializing portfolio terminal...</span>
            </div>
          )}
          {booted && (
            <>
              <TerminalOutput lines={lines} />
              <TerminalInput
                ref={inputRef}
                onSubmit={processCommand}
                onHistoryUp={() => navigateHistory("up")}
                onHistoryDown={() => navigateHistory("down")}
                historyValue={currentHistoryCommand}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
