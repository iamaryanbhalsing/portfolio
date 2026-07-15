"use client";

export function TerminalToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-20 z-50 bg-surface/90 border border-border/60 backdrop-blur-md rounded-lg px-4 py-2 font-mono text-sm text-green-400 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 flex items-center gap-2"
      title="Open Terminal (Ctrl+`)"
    >
      <span className="text-lg">{'>'}_</span>
      <span className="hidden sm:inline">Terminal</span>
    </button>
  );
}
