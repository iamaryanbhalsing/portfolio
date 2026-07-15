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
} from "lucide-react";
import { playlist, Track } from "@/config/music";
import { useCursorState } from "@/components/cursor/CursorProvider";
import { audioState } from "@/lib/audioState";

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const freqRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const rafRef = useRef<number>(0);
  const cursorHandlers = useCursorState("button");

  // Filtered playlist
  const filtered = query.trim()
    ? playlist.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.artist.toLowerCase().includes(query.toLowerCase())
      )
    : playlist;

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "metadata";
    audio.volume = volume / 100;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    });

    audio.addEventListener("ended", () => {
      playNext();
    });

    return () => {
      audio.pause();
      audio.src = "";
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Audio analyser — runs while playing
  const initAnalyser = useCallback(() => {
    if (ctxRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      ctxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      freqRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
    } catch {
      // Already initialized or not supported
    }
  }, []);

  const analyze = useCallback(() => {
    const analyser = analyserRef.current;
    const freq = freqRef.current;
    if (!analyser || !freq) return;

    analyser.getByteFrequencyData(freq);

    const binCount = freq.length;
    const bassEnd = Math.floor(binCount * 0.08);
    const midEnd = Math.floor(binCount * 0.6);

    let bassSum = 0, midSum = 0, trebleSum = 0;
    for (let i = 0; i < binCount; i++) {
      const val = freq[i] / 255;
      if (i < bassEnd) bassSum += val;
      else if (i < midEnd) midSum += val;
      else trebleSum += val;
    }

    audioState.bass = bassEnd > 0 ? bassSum / bassEnd : 0;
    audioState.mid = (midEnd - bassEnd) > 0 ? midSum / (midEnd - bassEnd) : 0;
    audioState.treble = (binCount - midEnd) > 0 ? trebleSum / (binCount - midEnd) : 0;
    audioState.energy = audioState.bass * 0.5 + audioState.mid * 0.3 + audioState.treble * 0.2;

    rafRef.current = requestAnimationFrame(analyze);
  }, []);

  const playTrack = useCallback(
    (track: Track) => {
      const audio = audioRef.current;
      if (!audio) return;

      initAnalyser();

      audio.src = track.src;
      audio.load();
      audio.play().then(() => {
        setCurrentTrack(track);
        setIsPlaying(true);
        audioState.isPlaying = true;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(analyze);
      }).catch(() => {});
    },
    [initAnalyser, analyze]
  );

  const playNext = () => {
    if (!currentTrack) {
      playTrack(playlist[0]);
      return;
    }
    const idx = playlist.findIndex((t) => t.id === currentTrack.id);
    const next = playlist[(idx + 1) % playlist.length];
    playTrack(next);
  };

  const playPrev = () => {
    if (!currentTrack) return;
    const idx = playlist.findIndex((t) => t.id === currentTrack.id);
    const prev = playlist[(idx - 1 + playlist.length) % playlist.length];
    playTrack(prev);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      if (playlist.length > 0) playTrack(playlist[0]);
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      audioState.isPlaying = false;
      cancelAnimationFrame(rafRef.current);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        audioState.isPlaying = true;
        rafRef.current = requestAnimationFrame(analyze);
      }).catch(() => {});
    }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    setIsMuted(false);
    if (audioRef.current) audioRef.current.volume = val / 100;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Visualizer bar data
  const [vizBars, setVizBars] = useState<number[]>(new Array(20).fill(0));
  useEffect(() => {
    if (!isPlaying) {
      setVizBars(new Array(20).fill(0));
      return;
    }
    let running = true;
    const updateViz = () => {
      if (!running) return;
      const freq = freqRef.current;
      if (freq) {
        const bars = [];
        const step = Math.floor(freq.length / 20);
        for (let i = 0; i < 20; i++) {
          bars.push(freq[i * step] / 255);
        }
        setVizBars(bars);
      }
      requestAnimationFrame(updateViz);
    };
    updateViz();
    return () => { running = false; };
  }, [isPlaying]);

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
          <Music
            className={`h-5 w-5 ${isPlaying ? "text-brand animate-pulse" : "text-muted-foreground"}`}
          />
        )}
      </button>

      {/* Player panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-80 rounded-2xl bg-surface/90 border border-border/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Mini visualizer */}
          <div className="flex items-end justify-center gap-[2px] h-8 px-4 pt-3">
            {vizBars.map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-brand to-brandSecondary transition-all duration-75"
                style={{ height: `${Math.max(2, h * 28)}px`, opacity: h > 0 ? 0.6 + h * 0.4 : 0.15 }}
              />
            ))}
          </div>

          {/* Search bar */}
          <div className="px-3 pt-2 pb-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tracks..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-background/60 border border-border/40 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-brand/50 transition-colors"
              />
            </div>
          </div>

          {/* Track list */}
          <div className="max-h-44 overflow-y-auto px-2 py-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground/40 text-center py-4">No tracks found</p>
            ) : (
              filtered.map((track) => (
                <button
                  key={track.id}
                  onClick={() => playTrack(track)}
                  {...cursorHandlers}
                  className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors text-left group ${
                    currentTrack?.id === track.id
                      ? "bg-brand/10 text-brand"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className="w-8 h-8 rounded bg-brand/10 flex items-center justify-center flex-shrink-0">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <div className="flex items-end gap-[2px] h-3">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-[3px] bg-brand rounded-full animate-pulse"
                            style={{ height: `${8 + Math.random() * 4}px`, animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    ) : (
                      <Music className="h-3.5 w-3.5 text-brand/50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate group-hover:text-brand transition-colors">
                      {track.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <Play className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>

          {/* Now playing + controls */}
          <div className="border-t border-border/40 px-3 pt-2 pb-1">
            {/* Progress bar */}
            <div
              className="w-full h-1.5 rounded-full bg-border/50 cursor-pointer mb-2"
              onClick={handleSeek}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-brandSecondary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground/50 mb-1">
              <span>{formatTime(duration * (progress / 100))}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 px-4 py-2 border-t border-border/40">
            <button
              onClick={playPrev}
              {...cursorHandlers}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={togglePlay}
              {...cursorHandlers}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-brand text-background hover:shadow-lg hover:shadow-brand/30 transition-all duration-300"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <button
              onClick={playNext}
              {...cursorHandlers}
              className="text-muted-foreground hover:text-foreground transition-colors"
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
        </div>
      )}
    </>
  );
}
