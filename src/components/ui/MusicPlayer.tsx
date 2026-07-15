"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, X } from "lucide-react";
import { playlist } from "@/config/music";
import { useCursorState } from "@/components/cursor/CursorProvider";

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const cursorHandlers = useCursorState("button");

  const track = playlist[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    audio.currentTime = percent * duration;
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      {/* Mini player toggle button */}
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

      {/* Expanded player */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-80 rounded-2xl bg-surface/90 border border-border/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Track info */}
          <div className="p-4 pb-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                <Music className="h-5 w-5 text-brand" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="w-full h-1.5 rounded-full bg-border/50 cursor-pointer group"
              onClick={seekTo}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-brandSecondary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
              <span>{formatTime(duration * (progress / 100))}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 px-4 pb-3">
            <button
              onClick={prevTrack}
              {...cursorHandlers}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous track"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={togglePlay}
              {...cursorHandlers}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-brand text-background hover:shadow-lg hover:shadow-brand/30 transition-all duration-300"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <button
              onClick={nextTrack}
              {...cursorHandlers}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next track"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 px-4 pb-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              {...cursorHandlers}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="music-player-slider flex-1"
              aria-label="Volume"
            />
          </div>

          {/* Playlist */}
          <div className="border-t border-border/40 px-4 py-3 max-h-48 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-2">Playlist</p>
            {playlist.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentTrack(i);
                  if (!isPlaying) setIsPlaying(true);
                }}
                {...cursorHandlers}
                className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  i === currentTrack
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span className="w-4 text-center text-[10px]">
                  {i === currentTrack && isPlaying ? "♪" : `${i + 1}`}
                </span>
                <span className="truncate">{t.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
