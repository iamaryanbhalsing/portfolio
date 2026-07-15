"use client";

import { type TerminalLine } from "@/hooks/useTerminal";

function LineContent({ line }: { line: TerminalLine }) {
  const classMap: Record<string, string> = {
    input: "terminal-input-line",
    output: "terminal-output",
    error: "terminal-error",
    system: "terminal-system",
    success: "terminal-success",
    info: "terminal-info",
    ascii: "terminal-ascii",
  };

  if (line.type === "input") {
    return (
      <div className="terminal-line">
        <span className="terminal-prompt">visitor@portfolio:~$</span>
        <span className="terminal-input-text">{line.content}</span>
      </div>
    );
  }

  if (line.type === "ascii") {
    return (
      <pre className="terminal-ascii">
        <code>{line.content}</code>
      </pre>
    );
  }

  return (
    <div className={`terminal-line ${classMap[line.type] || ""}`}>
      <span>{line.content}</span>
    </div>
  );
}

export function TerminalOutput({ lines }: { lines: TerminalLine[] }) {
  return (
    <div className="terminal-output-area">
      {lines.map((line) => (
        <LineContent key={line.id} line={line} />
      ))}
    </div>
  );
}
