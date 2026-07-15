"use client";

import { useState } from "react";
import { Music, X, ExternalLink } from "lucide-react";
import { useCursorState } from "@/components/cursor/CursorProvider";

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const cursorHandlers = useCursorState("button");

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        {...cursorHandlers}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-surface/80 border border-border/60 backdrop-blur-md shadow-lg hover:shadow-brand/20 hover:border-brand/40 transition-all duration-300"
        aria-label={isOpen ? "Close music player" : "Open music player"}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Music className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Player panel — Vispark Music iframe */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-80 h-[520px] rounded-2xl bg-surface/90 border border-border/60 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Music className="h-3.5 w-3.5 text-brand" />
              <span className="text-xs font-medium text-foreground">Music</span>
            </div>
            <a
              href="https://music.vispark.in"
              target="_blank"
              rel="noopener noreferrer"
              {...cursorHandlers}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Iframe */}
          <iframe
            src="https://music.vispark.in"
            className="flex-1 w-full border-0"
            title="Vispark Music Player"
            allow="autoplay; encrypted-media"
          />
        </div>
      )}
    </>
  );
}
