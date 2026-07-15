"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  X,
  Search,
  Clock,
  ListMusic,
} from "lucide-react";
import { useCursorState } from "@/components/cursor/CursorProvider";

interface Track {
  id: string;
  title: string;
  channel: string;
}

const QUICK_PICKS: Track[] = [
  { id: "jfKfPfyJRdk", title: "Lofi Hip Hop Radio", channel: "Lofi Girl" },
  { id: "5qap5aO4i9A", title: "Beats to Study/Relax To", channel: "Lofi Girl" },
  { id: "rUxyKA_-grg", title: "Chill Beats to Study", channel: "Lofi Girl" },
  { id: "4xDzrJKXOOY", title: "Synthwave Radio", channel: "Lofi Girl" },
  { id: "7NOSDKb0HlU", title: "Chill Lofi Mix", channel: "Chill Nation" },
  { id: "lTRiuFIWV54", title: "Study & Chill Vibes", channel: "Lofi Girl" },
];

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [history, setHistory] = useState<Track[]>([]);
  const [mode, setMode] = useState<"quick" | "search" | "history">("quick");
  const [searchQuery, setSearchQuery] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cursorHandlers = useCursorState("button");

  // Communicate with YouTube iframe via postMessage
  const sendCommand = useCallback(
    (command: string, args?: any) => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: command, args: args || [] }),
        "*"
      );
    },
    []
  );

  const playTrack = useCallback(
    (track: Track) => {
      setCurrentTrack(track);
      setIsPlaying(true);
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.id !== track.id);
        return [track, ...filtered].slice(0, 30);
      });
      // iframe src change triggers autoplay via YouTube's autoplay=1 param
    },
    []
  );

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      sendCommand("pauseVideo");
    } else {
      sendCommand("playVideo");
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (history.length < 2 || !currentTrack) return;
    const idx = history.findIndex((h) => h.id === currentTrack.id);
    const next = idx >= 0 ? history[(idx + 1) % history.length] : history[0];
    playTrack(next);
  };

  const playPrev = () => {
    if (history.length < 2 || !currentTrack) return;
    const idx = history.findIndex((h) => h.id === currentTrack.id);
    const prev = idx > 0 ? history[idx - 1] : history[history.length - 1];
    playTrack(prev);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    setIsMuted(false);
    sendCommand("setVolume", [val]);
  };

  const toggleMute = () => {
    if (isMuted) {
      sendCommand("unMute");
      sendCommand("setVolume", [volume]);
      setIsMuted(false);
    } else {
      sendCommand("mute");
      setIsMuted(true);
    }
  };

  const openSearch = () => {
    const q = searchQuery.trim() || "lofi hip hop";
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " music")}`,
      "_blank"
    );
  };

  // Listen for messages from YouTube iframe (state changes)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.info?.playerState === 0) {
          // Video ended
          setIsPlaying(false);
          playNext();
        }
        if (data.info?.playerState === 1) setIsPlaying(true);
        if (data.info?.playerState === 2) setIsPlaying(false);
      } catch {
        // not a YT message
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [playNext]);

  return (
    <>
      {/* Hidden YouTube embed player */}
      {currentTrack && (
        <iframe
          ref={iframeRef}
          className="hidden"
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${currentTrack.id}?enablejsapi=1&autoplay=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0`}
          allow="autoplay; encrypted-media"
          title="Music Player"
        />
      )}

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
          <Music
            className={`h-5 w-5 ${isPlaying ? "text-brand animate-pulse" : "text-muted-foreground"}`}
          />
        )}
      </button>

      {/* Player panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-80 rounded-2xl bg-surface/90 border border-border/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Now playing */}
          {currentTrack ? (
            <div className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <img
                  src={`https://i.ytimg.com/vi/${currentTrack.id}/mqdefault.jpg`}
                  alt={currentTrack.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentTrack.channel}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border-b border-border/40">
              <Music className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/50">Pick a track to start</p>
            </div>
          )}

          {/* Mode tabs */}
          <div className="flex border-b border-border/40">
            {[
              { key: "quick" as const, icon: ListMusic, label: "Quick" },
              { key: "search" as const, icon: Search, label: "Search" },
              { key: "history" as const, icon: Clock, label: "History" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                {...cursorHandlers}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors ${
                  mode === key
                    ? "text-brand border-b-2 border-brand"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Track list */}
          <div className="max-h-56 overflow-y-auto">
            {mode === "quick" && (
              <div className="p-2">
                {QUICK_PICKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => playTrack(track)}
                    {...cursorHandlers}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors text-left group ${
                      currentTrack?.id === track.id
                        ? "bg-brand/10 text-brand"
                        : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
                      alt={track.title}
                      className="w-10 h-8 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate group-hover:text-brand transition-colors">
                        {track.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {track.channel}
                      </p>
                    </div>
                    <Play className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {mode === "search" && (
              <div className="p-3">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && openSearch()}
                    placeholder="Type a song name..."
                    className="flex-1 px-3 py-2 rounded-lg bg-background/60 border border-border/40 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-brand/50 transition-colors"
                  />
                  <button
                    onClick={openSearch}
                    {...cursorHandlers}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand text-background hover:shadow-lg hover:shadow-brand/30 transition-all"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/40 text-center">
                  Opens YouTube search — click any video, then paste the URL below
                </p>
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Paste YouTube URL or video ID..."
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border/40 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-brand/50 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = (e.target as HTMLInputElement).value.trim();
                        let id = "";
                        if (val.includes("youtu.be/")) {
                          id = val.split("youtu.be/")[1]?.split("?")[0] || "";
                        } else if (val.includes("v=")) {
                          id = val.split("v=")[1]?.split("&")[0] || "";
                        } else if (/^[a-zA-Z0-9_-]{11}$/.test(val)) {
                          id = val;
                        }
                        if (id) {
                          playTrack({ id, title: "YouTube Video", channel: "" });
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {mode === "history" && (
              <div className="p-2">
                {history.length === 0 ? (
                  <p className="text-xs text-muted-foreground/40 text-center py-4">
                    No history yet
                  </p>
                ) : (
                  history.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => playTrack(track)}
                      {...cursorHandlers}
                      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors text-left group ${
                        currentTrack?.id === track.id
                          ? "bg-brand/10 text-brand"
                          : "hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
                        alt={track.title}
                        className="w-10 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate group-hover:text-brand transition-colors">
                          {track.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {track.channel}
                        </p>
                      </div>
                      <Play className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-border/40">
            <button
              onClick={playPrev}
              {...cursorHandlers}
              disabled={!currentTrack || history.length < 2}
              className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              aria-label="Previous"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={togglePlay}
              {...cursorHandlers}
              disabled={!currentTrack}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-brand text-background hover:shadow-lg hover:shadow-brand/30 transition-all duration-300 disabled:opacity-40"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              {...cursorHandlers}
              disabled={!currentTrack || history.length < 2}
              className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              aria-label="Next"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 px-4 pb-3">
            <button
              onClick={toggleMute}
              {...cursorHandlers}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="music-player-slider flex-1"
            />
          </div>
        </div>
      )}
    </>
  );
}
