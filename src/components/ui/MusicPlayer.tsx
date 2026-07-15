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
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useCursorState } from "@/components/cursor/CursorProvider";

interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

interface HistoryEntry {
  id: string;
  title: string;
  channel: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<HistoryEntry | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayer = useRef<any>(null);
  const cursorHandlers = useCursorState("button");

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }, []);

  // Initialize player when opened
  useEffect(() => {
    if (!isOpen || !playerRef.current || ytPlayer.current) return;

    const init = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(init, 200);
        return;
      }

      ytPlayer.current = new window.YT.Player("yt-player", {
        height: "0",
        width: "0",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              playNext();
            }
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    init();
  }, [isOpen]);

  // Search via YouTube oEmbed (no API key needed)
  const searchYouTube = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setShowResults(true);

    try {
      // Use a proxy-free approach: search via Invidious API (public instances)
      const searchUrl = `https://vid.puffyan.us/api/v1/search?q=${encodeURIComponent(query + " music")}&type=video&sort_by=relevance`;
      const res = await fetch(searchUrl);
      if (res.ok) {
        const data = await res.json();
        const videos: Video[] = data
          .filter((v: any) => v.type === "video" && v.videoId)
          .slice(0, 8)
          .map((v: any) => ({
            id: v.videoId,
            title: v.title || "Unknown",
            channel: v.author || "Unknown",
            thumbnail: v.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`,
          }));
        setResults(videos);
      } else {
        throw new Error("Invidious failed");
      }
    } catch {
      // Fallback: use YouTube's own search page results via noembed
      try {
        const res = await fetch(
          `https://noembed.com/embed?url=https://www.youtube.com/results?search_query=${encodeURIComponent(query + " music")}`
        );
        // noembed won't work for search, use fallback list
        throw new Error("fallback");
      } catch {
        // Final fallback: hardcoded popular lofi tracks
        const fallback: Video[] = [
          { id: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to relax/study to", channel: "Lofi Girl", thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg" },
          { id: "5qap5aO4i9A", title: "lofi hip hop radio - beats to study/relax to", channel: "Lofi Girl", thumbnail: "https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg" },
          { id: "rUxyKA_-grg", title: "lofi hip hop mix - chill beats to study/relax", channel: "Lofi Girl", thumbnail: "https://i.ytimg.com/vi/rUxyKA_-grg/mqdefault.jpg" },
          { id: "4xDzrJKXOOY", title: "synthwave radio - retro synth pop mix", channel: "Lofi Girl", thumbnail: "https://i.ytimg.com/vi/4xDzrJKXOOY/mqdefault.jpg" },
          { id: "7NOSDKb0HlU", title: "chill lofi hip hop beats - study session", channel: "Chill Nation", thumbnail: "https://i.ytimg.com/vi/7NOSDKb0HlU/mqdefault.jpg" },
          { id: "lTRiuFIWV54", title: "lofi hip hop mix - study & chill vibes", channel: "Lofi Girl", thumbnail: "https://i.ytimg.com/vi/lTRiuFIWV54/mqdefault.jpg" },
        ];
        setResults(fallback);
      }
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const playVideo = (video: Video) => {
    if (!ytPlayer.current) return;
    ytPlayer.current.loadVideoById(video.id);
    setCurrentVideo({ id: video.id, title: video.title, channel: video.channel });
    setIsPlaying(true);
    setShowResults(false);
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== video.id);
      return [{ id: video.id, title: video.title, channel: video.channel }, ...filtered].slice(0, 20);
    });
  };

  const playNext = () => {
    if (history.length < 2) return;
    const currentIdx = history.findIndex((h) => h.id === currentVideo?.id);
    const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % history.length : 0;
    const next = history[nextIdx];
    if (ytPlayer.current && next) {
      ytPlayer.current.loadVideoById(next.id);
      setCurrentVideo(next);
    }
  };

  const playPrev = () => {
    if (history.length < 2) return;
    const currentIdx = history.findIndex((h) => h.id === currentVideo?.id);
    const prevIdx = currentIdx > 0 ? currentIdx - 1 : history.length - 1;
    const prev = history[prevIdx];
    if (ytPlayer.current && prev) {
      ytPlayer.current.loadVideoById(prev.id);
      setCurrentVideo(prev);
    }
  };

  const togglePlay = () => {
    if (!ytPlayer.current) return;
    if (isPlaying) {
      ytPlayer.current.pauseVideo();
    } else {
      ytPlayer.current.playVideo();
    }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    setIsMuted(false);
    if (ytPlayer.current) {
      ytPlayer.current.setVolume(val);
      ytPlayer.current.unMute();
    }
  };

  const toggleMute = () => {
    if (!ytPlayer.current) return;
    if (isMuted) {
      ytPlayer.current.unMute();
      setIsMuted(false);
    } else {
      ytPlayer.current.mute();
      setIsMuted(true);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") searchYouTube();
  };

  return (
    <>
      <div ref={playerRef} className="hidden" />
      <div id="yt-player" className="hidden" />

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
          <Music className={`h-5 w-5 ${isPlaying ? "text-brand animate-pulse" : "text-muted-foreground"}`} />
        )}
      </button>

      {/* Player panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-80 rounded-2xl bg-surface/90 border border-border/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search songs..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-background/60 border border-border/40 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-brand/50 transition-colors"
                />
              </div>
              <button
                onClick={searchYouTube}
                {...cursorHandlers}
                disabled={isSearching}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition-colors disabled:opacity-50"
              >
                {isSearching ? (
                  <div className="h-3.5 w-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Now playing / Search results */}
          <div className="max-h-72 overflow-y-auto">
            {showResults && results.length > 0 ? (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">Results</span>
                  <button
                    onClick={() => setShowResults(false)}
                    className="text-[10px] text-muted-foreground/50 hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
                {results.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => playVideo(v)}
                    {...cursorHandlers}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                  >
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-12 h-9 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate group-hover:text-brand transition-colors">
                        {v.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">{v.channel}</p>
                    </div>
                    <Play className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : currentVideo ? (
              /* Now Playing */
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={`https://i.ytimg.com/vi/${currentVideo.id}/mqdefault.jpg`}
                    alt={currentVideo.title}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{currentVideo.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentVideo.channel}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="p-8 text-center">
                <Music className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/50">Search for a song to play</p>
                <p className="text-[10px] text-muted-foreground/30 mt-1">Powered by YouTube</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-border/40">
            <button
              onClick={playPrev}
              {...cursorHandlers}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={togglePlay}
              {...cursorHandlers}
              disabled={!currentVideo}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-brand text-background hover:shadow-lg hover:shadow-brand/30 transition-all duration-300 disabled:opacity-40"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <button
              onClick={playNext}
              {...cursorHandlers}
              disabled={history.length < 2}
              className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
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
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
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

          {/* History */}
          {history.length > 1 && (
            <div className="border-t border-border/40 px-3 py-2 max-h-36 overflow-y-auto">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1.5 px-1">Recently Played</p>
              {history.slice(1, 8).map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    if (ytPlayer.current) {
                      ytPlayer.current.loadVideoById(h.id);
                      setCurrentVideo(h);
                    }
                  }}
                  {...cursorHandlers}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                    h.id === currentVideo?.id
                      ? "bg-brand/10 text-brand"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${h.id}/default.jpg`}
                    alt={h.title}
                    className="w-6 h-6 rounded object-cover flex-shrink-0"
                  />
                  <span className="truncate">{h.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
