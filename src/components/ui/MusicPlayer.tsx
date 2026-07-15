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
const YT_STATE_PAUSED = 2;
const YT_STATE_ENDED = 0;

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
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef<InstanceType<Window["YT"]["Player"]> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorHandlers = useCursorState("button");
  const progressInterval = useRef<ReturnType<typeof setInterval>>(null);

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

  // Create player when API ready
  useEffect(() => {
    if (!apiReady || playerRef.current) return;

    const player = new window.YT.Player("yt-player", {
      videoId: playlist[0].youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        origin: window.location.origin,
      },
      events: {
        onStateChange: (e: { data: number }) => {
          const state = e.data;
          const playing = state === YT_STATE_PLAYING;
          setIsPlaying(playing);
          audioState.update({ isPlaying: playing });

          if (state === YT_STATE_ENDED) {
            nextTrack();
          }
        },
      },
    });

    playerRef.current = player;
  }, [apiReady]);

  // Progress tracking + beat sync
  useEffect(() => {
    progressInterval.current = setInterval(() => {
      const player = playerRef.current;
      if (!player || !player.getCurrentTime) return;

      try {
        const cur = player.getCurrentTime();
        const dur = player.getDuration();
        setProgress(cur);
        setDuration(dur);
      } catch {
        // Player not ready
      }
    }, 250);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const playTrack = useCallback(
    (track: Track, index: number) => {
      setCurrentTrack(track);
      setTrackIndex(index);
      audioState.update({ bpm: track.bpm });

      const player = playerRef.current;
      if (player && player.loadVideoById) {
        player.loadVideoById(track.youtubeId);
      }
    },
    []
  );

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

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      playerRef.current?.seekTo(time, true);
      setProgress(time);
    },
    []
  );

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

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Beat-synced visualizer bars
  const [bars, setBars] = useState<number[]>(new Array(20).fill(0));

  useEffect(() => {
    if (!isPlaying) {
      setBars(new Array(20).fill(0));
      return;
    }

    const id = setInterval(() => {
      const { bass, mid, treble } = audioState;
      setBars((prev) =>
        prev.map((_, i) => {
          if (i < 6) return bass * (0.5 + Math.random() * 0.5);
          if (i < 14) return mid * (0.4 + Math.random() * 0.6);
          return treble * (0.3 + Math.random() * 0.7);
        })
      );
    }, 60);

    return () => clearInterval(id);
  }, [isPlaying]);

  return (
    <>
      {/* Hidden YouTube iframe — never unmounts */}
      <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
        <div id="yt-player" />
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        {...cursorHandlers}
        className={`fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 rounded-full border backdrop-blur-md shadow-lg transition-all duration-300 ${
          isPlaying
            ? "bg-brand/90 border-brand shadow-brand/30 animate-pulse"
            : "bg-surface/80 border-border/60 hover:shadow-brand/20 hover:border-brand/40"
        }`}
        aria-label={isOpen ? "Close music player" : "Open music player"}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Music className={`h-5 w-5 ${isPlaying ? "text-white" : "text-muted-foreground"}`} />
        )}
      </button>

      {/* Player panel */}
      <div
        className={`fixed bottom-20 left-6 z-50 w-80 rounded-2xl border border-border/60 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          background: "linear-gradient(135deg, var(--surface), rgba(15,23,42,0.85))",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {isPlaying ? "Now Playing" : "Paused"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => window.open(`https://youtube.com/watch?v=${currentTrack.youtubeId}`, "_blank")}
              {...cursorHandlers}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              aria-label="Open on YouTube"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              {...cursorHandlers}
              className={`p-1.5 rounded-lg transition-all ${
                showPlaylist
                  ? "text-brand bg-brand/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              aria-label="Toggle playlist"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Visualizer */}
        <div className="flex items-end justify-center gap-[2px] h-12 px-4 pt-3">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-75"
              style={{
                height: `${Math.max(2, h * 40)}px`,
                background: `linear-gradient(to top, var(--brand), ${
                  i < 6 ? "#38BDF8" : i < 14 ? "#818CF8" : "#C084FC"
                })`,
                opacity: 0.6 + h * 0.4,
              }}
            />
          ))}
        </div>

        {/* Track info */}
        <div className="px-4 pt-2 pb-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {currentTrack.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist}
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-1">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            className="music-player-slider w-full"
          />
          <div className="flex justify-between mt-0.5">
            <span className="text-[10px] text-muted-foreground">{formatTime(progress)}</span>
            <span className="text-[10px] text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={prevTrack}
            {...cursorHandlers}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            aria-label="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlay}
            {...cursorHandlers}
            className="p-3 rounded-full bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/30 transition-all hover:scale-105 active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            {...cursorHandlers}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            aria-label="Next track"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <button
            onClick={toggleMute}
            {...cursorHandlers}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            className="music-player-slider flex-1"
          />
        </div>

        {/* Playlist */}
        {showPlaylist && (
          <div className="border-t border-border/40 max-h-48 overflow-y-auto">
            {playlist.map((track, i) => (
              <button
                key={track.id}
                onClick={() => playTrack(track, i)}
                {...cursorHandlers}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-muted/30 ${
                  currentTrack.id === track.id ? "bg-brand/10 border-l-2 border-brand" : "border-l-2 border-transparent"
                }`}
              >
                <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0">
                  {currentTrack.id === track.id && isPlaying ? (
                    <div className="flex items-end gap-[1px] h-3">
                      {[0, 1, 2].map((b) => (
                        <div
                          key={b}
                          className="w-[2px] bg-brand rounded-full animate-pulse"
                          style={{
                            height: `${6 + Math.random() * 6}px`,
                            animationDelay: `${b * 0.15}s`,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${currentTrack.id === track.id ? "text-brand" : "text-foreground"}`}>
                    {track.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{track.duration}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
