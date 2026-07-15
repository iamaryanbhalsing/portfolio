"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  X,
} from "lucide-react";
import { useCursorState } from "@/components/cursor/CursorProvider";
import { audioState } from "@/lib/audioState";
import { playlist } from "@/config/music";

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  getCurrentTime(): number;
  getVolume(): number;
  setVolume(vol: number): void;
  mute(): void;
  unMute(): void;
  loadVideoById(videoId: string): void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (id: string, config: Record<string, unknown>) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiLoaded = false;
let ytApiLoading = false;
let ytApiPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (ytApiLoaded) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<void>((resolve) => {
    if (ytApiLoaded) { resolve(); return; }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      ytApiLoaded = true;
      resolve();
    };

    // Fallback: poll in case onYouTubeIframeAPIReady never fires
    const fallback = setInterval(() => {
      if (ytApiLoaded) {
        clearInterval(fallback);
        resolve();
      }
    }, 200);

    // Timeout after 10s
    setTimeout(() => {
      clearInterval(fallback);
      resolve();
    }, 10000);
  });

  return ytApiPromise;
}

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const cursorHandlers = useCursorState("button");
  const animFrameRef = useRef<number>(0);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const pendingPlayRef = useRef(false);
  const track = playlist[0];

  // Initialize YouTube player
  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || ytPlayerRef.current) return;
      if (!window.YT?.Player) return;

      // Wait for the DOM element to exist
      const createPlayer = () => {
        const el = document.getElementById("yt-player");
        if (!el) {
          setTimeout(createPlayer, 100);
          return;
        }

        ytPlayerRef.current = new window.YT!.Player("yt-player", {
          height: "0",
          width: "0",
          videoId: track.videoId || "",
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
            onReady: () => {
              if (!cancelled) {
                setPlayerReady(true);
                // If a play was requested before player was ready, play now
                if (pendingPlayRef.current) {
                  pendingPlayRef.current = false;
                  ytPlayerRef.current?.loadVideoById(track.videoId || "");
                  ytPlayerRef.current?.setVolume(isMuted ? 0 : volume);
                  setIsPlaying(true);
                  audioState.update({ isPlaying: true, bpm: track.bpm });
                }
              }
            },
            onStateChange: (e: { data: number }) => {
              if (e.data === 0) {
                // Video ended
                setIsPlaying(false);
                audioState.update({ isPlaying: false, bass: 0, mid: 0, treble: 0, energy: 0 });
              }
            },
          },
        });
      };

      createPlayer();
    });

    return () => { cancelled = true; };
  }, []);

  // Track elapsed time
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(animFrameRef.current);
      return;
    }
    const tick = () => {
      if (ytPlayerRef.current) {
        try {
          setElapsed(ytPlayerRef.current.getCurrentTime());
        } catch {
          setElapsed(0);
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying]);

  const togglePlay = useCallback(async () => {
    if (!ytPlayerRef.current || !playerReady) {
      // Player not ready yet, queue the play
      pendingPlayRef.current = true;
      return;
    }

    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
      setIsPlaying(false);
      audioState.update({ isPlaying: false, bass: 0, mid: 0, treble: 0, energy: 0 });
    } else {
      ytPlayerRef.current.loadVideoById(track.videoId || "");
      ytPlayerRef.current.setVolume(isMuted ? 0 : volume);
      setIsPlaying(true);
      audioState.update({ isPlaying: true, bpm: track.bpm });
    }
  }, [isPlaying, track, volume, isMuted, playerReady]);

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = parseInt(e.target.value);
      setVolume(vol);
      setIsMuted(vol === 0);
      if (ytPlayerRef.current) {
        ytPlayerRef.current.setVolume(vol);
        if (vol === 0) ytPlayerRef.current.mute();
        else ytPlayerRef.current.unMute();
      }
    },
    []
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(volume);
      }
      setIsMuted(false);
    } else {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.mute();
      }
      setIsMuted(true);
    }
  }, [isMuted, volume]);

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
      const t = Date.now() / 1000;
      setBars((prev) =>
        prev.map((_, i) => {
          const base = 0.3 + 0.3 * Math.sin(t * 2 + i * 0.5);
          return base * (0.5 + Math.random() * 0.5);
        })
      );
    }, 70);
    return () => clearInterval(id);
  }, [isPlaying]);

  return (
    <>
      {/* Hidden YouTube container */}
      <div className="fixed opacity-0 pointer-events-none" style={{ width: 0, height: 0 }}>
        <div id="yt-player" />
      </div>

      {/* Toggle button */}
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

      {/* Player panel */}
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
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-white/30"}`} />
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">
                {isPlaying ? "Playing" : "Paused"}
              </span>
            </div>
          </div>

          {/* Album Art + Visualizer */}
          <div className="flex flex-col items-center px-5 pt-2 pb-3">
            <div className="relative w-40 h-40 mb-4">
              <div
                className={`absolute inset-0 rounded-full ring-rotate ${!isPlaying && "vinyl-spin-paused"}`}
                style={{
                  background: "conic-gradient(from 0deg, var(--brand), #818CF8, #C084FC, var(--brand))",
                }}
              />
              <div
                className={`absolute inset-[3px] rounded-full bg-[#0a0a0a] flex items-center justify-center vinyl-spin ${
                  !isPlaying && "vinyl-spin-paused"
                }`}
              >
                <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-brand/20 to-purple-500/20 flex items-center justify-center">
                  <Music className="h-12 w-12 text-white/20" />
                </div>
                <div className="absolute w-4 h-4 rounded-full bg-[#1a1a1a] border-2 border-white/10" />
                <div className="absolute inset-[15%] rounded-full border border-white/[0.03]" />
                <div className="absolute inset-[25%] rounded-full border border-white/[0.03]" />
                <div className="absolute inset-[35%] rounded-full border border-white/[0.03]" />
              </div>
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
            <div className="w-full text-center mb-3">
              <div className="marquee-container">
                <h3 className="text-sm font-semibold text-white/90 marquee-text">
                  {track.title}
                  <span className="mx-8 text-white/20">&bull;</span>
                  {track.title}
                </h3>
              </div>
              <p className="text-[11px] text-white/30 mt-0.5">{track.artist}</p>
            </div>
            {/* Elapsed time */}
            <div className="w-full px-1">
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-purple-400 transition-all duration-1000"
                  style={{
                    width: isPlaying ? "100%" : "0%",
                    animation: isPlaying ? "shimmer 3s ease-in-out infinite" : "none",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-white/20 font-mono">{formatTime(elapsed)}</span>
                <span className="text-[10px] text-white/20 font-mono">youtube</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 px-5 py-2">
            <button
              onClick={togglePlay}
              {...cursorHandlers}
              className="relative p-4 rounded-2xl bg-gradient-to-br from-brand to-purple-500 text-white shadow-lg shadow-brand/30 transition-all hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-brand/40"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
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
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
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
        </div>
      </div>
    </>
  );
}
