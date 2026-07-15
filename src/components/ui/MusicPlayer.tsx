"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  X,
  ExternalLink,
  Search,
  ChevronLeft,
} from "lucide-react";
import { useCursorState } from "@/components/cursor/CursorProvider";
import { audioState } from "@/lib/audioState";
import { playlist, type Track } from "@/config/music";

declare global {
  interface Window {
    YT: {
      Player: new (
        id: string,
        opts: Record<string, unknown>
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
        seekTo: (s: number, allow: boolean) => void;
        getCurrentTime: () => number;
        getDuration: () => number;
        getPlayerState: () => number;
        setVolume: (v: number) => void;
        getVolume: () => number;
        loadVideoById: (id: string) => void;
        destroy: () => void;
        addEventListener: (e: string, fn: () => void) => void;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const YT_STATE_PLAYING = 1;
const YT_STATE_ENDED = 0;

interface SearchResult {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const playerRef = useRef<InstanceType<Window["YT"]["Player"]> | null>(null);
  const cursorHandlers = useCursorState("button");
  const progressInterval = useRef<ReturnType<typeof setInterval>>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => setApiReady(true);
  }, []);

  // Create player — 200x200 minimum (YouTube requirement)
  useEffect(() => {
    if (!apiReady || playerRef.current) return;

    try {
      const player = new window.YT.Player("yt-player", {
        videoId: playlist[0].youtubeId,
        width: 200,
        height: 200,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            player.setVolume(80);
          },
          onStateChange: (e: { data: number }) => {
            const playing = e.data === YT_STATE_PLAYING;
            setIsPlaying(playing);
            setIsBuffering(false);
            audioState.update({ isPlaying: playing });

            if (e.data === YT_STATE_ENDED) {
              nextTrack();
            }
          },
          onBuffering: () => setIsBuffering(true),
          onError: (e: { data: number }) => {
            console.warn("YouTube error:", e.data);
            setIsBuffering(false);
          },
        },
      });

      playerRef.current = player;

      // Set referrerpolicy on the YouTube iframe (required for embeds to work)
      setTimeout(() => {
        const iframe = document.querySelector('#yt-player iframe') as HTMLIFrameElement;
        if (iframe) {
          iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        }
      }, 2000);
    } catch (err) {
      console.error("Failed to create YouTube player:", err);
    }
  }, [apiReady]);

  // Progress tracking
  useEffect(() => {
    progressInterval.current = setInterval(() => {
      const player = playerRef.current;
      if (!player || !player.getCurrentTime) return;
      try {
        const cur = player.getCurrentTime();
        const dur = player.getDuration();
        if (dur > 0) {
          setProgress(cur);
          setDuration(dur);
        }
      } catch {}
    }, 250);
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const playTrack = useCallback((track: Track, index: number) => {
    setCurrentTrack(track);
    setTrackIndex(index);
    setIsBuffering(true);
    audioState.update({ bpm: track.bpm });

    const player = playerRef.current;
    if (player && player.loadVideoById) {
      player.loadVideoById(track.youtubeId);
    }
  }, []);

  const playSearchResult = useCallback((result: SearchResult) => {
    const track: Track = {
      id: result.id,
      title: result.title,
      artist: result.channel,
      youtubeId: result.id,
      bpm: 85,
      coverUrl: result.thumbnail,
    };
    setCurrentTrack(track);
    setIsBuffering(true);
    audioState.update({ isPlaying: true, bpm: 85 });

    const player = playerRef.current;
    if (player && player.loadVideoById) {
      player.loadVideoById(result.id);
    }

    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const nextTrack = useCallback(() => {
    const next = (trackIndex + 1) % playlist.length;
    playTrack(playlist[next], next);
  }, [trackIndex, playTrack]);

  const prevTrack = useCallback(() => {
    const prev = trackIndex === 0 ? playlist.length - 1 : trackIndex - 1;
    playTrack(playlist[prev], prev);
  }, [trackIndex, playTrack]);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    playerRef.current?.seekTo(time, true);
    setProgress(time);
  }, []);

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = parseInt(e.target.value);
      setVolume(vol);
      setIsMuted(vol === 0);
      playerRef.current?.setVolume(vol);
    },
    []
  );

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isMuted) {
      player.setVolume(volume || 80);
      setIsMuted(false);
    } else {
      player.setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // YouTube search via Invidious
  const searchYouTube = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const instances = [
        "https://inv.nadeko.net",
        "https://invidious.nerdvpn.de",
        "https://vid.puffyan.us",
      ];
      for (const instance of instances) {
        try {
          const res = await fetch(
            `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&sort_by=relevance`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (res.ok) {
            const data = await res.json();
            const results: SearchResult[] = data
              .filter((v: { type: string }) => v.type === "video")
              .slice(0, 8)
              .map((v: { videoId: string; title: string; author: string; videoThumbnails?: { url: string }[] }) => ({
                id: v.videoId,
                title: v.title,
                channel: v.author,
                thumbnail: v.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`,
              }));
            setSearchResults(results);
            setIsSearching(false);
            return;
          }
        } catch {
          continue;
        }
      }
      setSearchResults([]);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => searchYouTube(value), 400);
    },
    [searchYouTube]
  );

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Visualizer bars
  const [bars, setBars] = useState<number[]>(new Array(24).fill(0));

  useEffect(() => {
    if (!isPlaying) {
      setBars(new Array(24).fill(0));
      return;
    }
    const id = setInterval(() => {
      const { bass, mid, treble } = audioState;
      setBars((prev) =>
        prev.map((_, i) => {
          if (i < 8) return bass * (0.4 + Math.random() * 0.6);
          if (i < 16) return mid * (0.3 + Math.random() * 0.7);
          return treble * (0.2 + Math.random() * 0.8);
        })
      );
    }, 70);
    return () => clearInterval(id);
  }, [isPlaying]);

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      {/* Hidden YouTube iframe — in viewport but invisible (YouTube blocks audio from off-screen) */}
      <div
        className="fixed bottom-0 left-0 z-[-1] opacity-0 pointer-events-none overflow-hidden"
        style={{ width: 200, height: 200 }}
      >
        <div id="yt-player" />
      </div>

      {/* Toggle button — floating */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        {...cursorHandlers}
        className={`fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 ${
          isOpen
            ? "bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rotate-90"
            : isPlaying
              ? "bg-gradient-to-br from-brand to-purple-500 shadow-lg shadow-brand/40 glow-pulse"
              : "bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-brand/20 hover:border-brand/30"
        }`}
        aria-label={isOpen ? "Close music player" : "Open music player"}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : isPlaying ? (
          <div className="relative">
            <Music className="h-5 w-5 text-white" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        ) : (
          <Music className="h-5 w-5 text-white/60" />
        )}
      </button>

      {/* Player panel — glassmorphism */}
      <div
        className={`fixed bottom-24 left-6 z-50 w-80 rounded-3xl overflow-hidden transition-all duration-500 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 translate-y-6 pointer-events-none scale-95"
        }`}
      >
        <div className="glass-panel rounded-3xl shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            {showSearch ? (
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                {...cursorHandlers}
                className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPlaying ? "bg-green-400 animate-pulse" : "bg-white/30"
                  }`}
                />
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">
                  {isBuffering ? "Loading..." : isPlaying ? "Playing" : "Paused"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {!showSearch && (
                <>
                  <button
                    onClick={() =>
                      window.open(
                        `https://youtube.com/watch?v=${currentTrack.youtubeId}`,
                        "_blank"
                      )
                    }
                    {...cursorHandlers}
                    className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Open on YouTube"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    {...cursorHandlers}
                    className={`p-2 rounded-xl transition-all ${
                      showPlaylist
                        ? "text-brand bg-brand/10"
                        : "text-white/30 hover:text-white hover:bg-white/10"
                    }`}
                    aria-label="Toggle playlist"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowSearch(true)}
                    {...cursorHandlers}
                    className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Search YouTube"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search View */}
          {showSearch ? (
            <div className="px-5 pb-5 fade-in-up">
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search any song..."
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/50 focus:bg-white/[0.07] transition-all"
                  autoFocus
                />
                {isSearching && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1 scrollbar-thin">
                {searchResults.length > 0
                  ? searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => playSearchResult(result)}
                        {...cursorHandlers}
                        className="w-full flex items-center gap-3 p-2.5 rounded-2xl text-left hover:bg-white/5 transition-all group"
                      >
                        <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                          <img
                            src={result.thumbnail}
                            alt={result.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white/80 truncate group-hover:text-brand transition-colors">
                            {result.title}
                          </p>
                          <p className="text-[10px] text-white/30 truncate">
                            {result.channel}
                          </p>
                        </div>
                        <Play className="h-3.5 w-3.5 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))
                  : searchQuery && !isSearching ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-white/30">No results</p>
                    </div>
                  ) : !searchQuery ? (
                    <div className="text-center py-8">
                      <Search className="h-8 w-8 mx-auto text-white/10 mb-2" />
                      <p className="text-xs text-white/20">Search YouTube for any song</p>
                    </div>
                  ) : null}
              </div>
            </div>
          ) : (
            <>
              {/* Album Art + Visualizer */}
              <div className="flex flex-col items-center px-5 pt-2 pb-3">
                {/* Vinyl disc with album art */}
                <div className="relative w-40 h-40 mb-4">
                  {/* Outer ring */}
                  <div
                    className={`absolute inset-0 rounded-full ring-rotate ${
                      !isPlaying && "vinyl-spin-paused"
                    }`}
                    style={{
                      background:
                        "conic-gradient(from 0deg, var(--brand), #818CF8, #C084FC, var(--brand))",
                    }}
                  />
                  {/* Inner disc */}
                  <div
                    className={`absolute inset-[3px] rounded-full bg-[#0a0a0a] flex items-center justify-center vinyl-spin ${
                      !isPlaying && "vinyl-spin-paused"
                    }`}
                  >
                    {/* Album art thumbnail */}
                    <img
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      className="w-[85%] h-[85%] rounded-full object-cover opacity-90"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    {/* Center hole */}
                    <div className="absolute w-4 h-4 rounded-full bg-[#1a1a1a] border-2 border-white/10" />
                    {/* Grooves */}
                    <div className="absolute inset-[15%] rounded-full border border-white/[0.03]" />
                    <div className="absolute inset-[25%] rounded-full border border-white/[0.03]" />
                    <div className="absolute inset-[35%] rounded-full border border-white/[0.03]" />
                  </div>

                  {/* Circular visualizer bars around vinyl */}
                  {isPlaying && (
                    <div className="absolute inset-[-8px] pointer-events-none">
                      {bars.map((h, i) => {
                        const angle = (i / bars.length) * 360;
                        const barHeight = 4 + h * 16;
                        return (
                          <div
                            key={i}
                            className="absolute w-[3px] rounded-full"
                            style={{
                              height: `${barHeight}px`,
                              background: `linear-gradient(to top, var(--brand), ${
                                i < 8 ? "#38BDF8" : i < 16 ? "#818CF8" : "#C084FC"
                              })`,
                              opacity: 0.4 + h * 0.6,
                              left: "50%",
                              top: "50%",
                              transformOrigin: "center center",
                              transform: `rotate(${angle}deg) translateY(-88px) translateX(-50%)`,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Track info */}
                <div className="w-full text-center mb-3">
                  <div className="marquee-container">
                    <h3 className="text-sm font-semibold text-white/90 marquee-text">
                      {currentTrack.title}
                      <span className="mx-8 text-white/20">•</span>
                      {currentTrack.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-white/30 mt-0.5">{currentTrack.artist}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full px-1">
                  <div className="relative w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden group cursor-pointer">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand to-purple-400 transition-all duration-100"
                      style={{ width: `${progressPercent}%` }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={duration || 1}
                      step={0.1}
                      value={progress}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                    {/* Scrub handle */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `calc(${progressPercent}% - 6px)` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-white/20 font-mono">
                      {formatTime(progress)}
                    </span>
                    <span className="text-[10px] text-white/20 font-mono">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 px-5 py-2">
                <button
                  onClick={prevTrack}
                  {...cursorHandlers}
                  className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                  aria-label="Previous"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <button
                  onClick={togglePlay}
                  {...cursorHandlers}
                  className="relative p-4 rounded-2xl bg-gradient-to-br from-brand to-purple-500 text-white shadow-lg shadow-brand/30 transition-all hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-brand/40"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isBuffering ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  {...cursorHandlers}
                  className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                  aria-label="Next"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 px-6 pb-5 pt-1">
                <button
                  onClick={toggleMute}
                  {...cursorHandlers}
                  className="p-1 rounded-lg text-white/30 hover:text-white transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="h-3.5 w-3.5" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                </button>
                <div className="relative flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden group">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-white/30 transition-all duration-100"
                    style={{ width: `${isMuted ? 0 : volume}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolume}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Playlist */}
              {showPlaylist && (
                <div className="border-t border-white/[0.04] max-h-56 overflow-y-auto scrollbar-thin fade-in-up">
                  {playlist.map((track, i) => (
                    <button
                      key={track.id}
                      onClick={() => playTrack(track, i)}
                      {...cursorHandlers}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all hover:bg-white/[0.03] ${
                        currentTrack.id === track.id
                          ? "bg-brand/[0.06]"
                          : ""
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium truncate ${
                            currentTrack.id === track.id
                              ? "text-brand"
                              : "text-white/60"
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-[10px] text-white/20 truncate">
                          {track.artist}
                        </p>
                      </div>
                      {currentTrack.id === track.id && isPlaying && (
                        <div className="flex items-end gap-[2px] h-3">
                          {[0, 1, 2].map((b) => (
                            <div
                              key={b}
                              className="w-[2px] bg-brand rounded-full wave-bar"
                              style={{ animationDelay: `${b * 0.15}s` }}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
