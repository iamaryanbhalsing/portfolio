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
  ChevronLeft,
} from "lucide-react";
import { useCursorState } from "@/components/cursor/CursorProvider";
import { audioState } from "@/lib/audioState";
import { musicGenerator, type TrackPreset } from "@/lib/MusicGenerator";
import { playlist, type Track } from "@/config/music";

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const cursorHandlers = useCursorState("button");
  const startTimeRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [initialized, setInitialized] = useState(false);

  // Initialize on first user interaction
  const ensureInit = useCallback(async () => {
    if (!initialized) {
      await musicGenerator.init();
      setInitialized(true);
    }
  }, [initialized]);

  // Track elapsed time
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(animFrameRef.current);
      return;
    }
    const tick = () => {
      setElapsed((Date.now() - startTimeRef.current) / 1000);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying]);

  // Sync audioState with generator
  useEffect(() => {
    const interval = setInterval(() => {
      if (musicGenerator.getIsPlaying()) {
        const analyser = musicGenerator.getAnalyser();
        if (analyser) {
          const data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          const bass = (data[2] + data[3] + data[4]) / (3 * 255);
          const mid = (data[10] + data[15] + data[20]) / (3 * 255);
          const treble = (data[40] + data[50] + data[60]) / (3 * 255);
          const energy = (bass + mid + treble) / 3;
          audioState.update({ bass, mid, treble, energy });
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const playTrack = useCallback(
    async (track: Track, index: number) => {
      await ensureInit();
      setCurrentTrack(track);
      setTrackIndex(index);
      audioState.update({ bpm: track.bpm, isPlaying: true });
      await musicGenerator.play(track.preset);
      startTimeRef.current = Date.now();
      setIsPlaying(true);
    },
    [ensureInit]
  );

  const nextTrack = useCallback(() => {
    const next = (trackIndex + 1) % playlist.length;
    playTrack(playlist[next], next);
  }, [trackIndex, playTrack]);

  const prevTrack = useCallback(() => {
    const prev = trackIndex === 0 ? playlist.length - 1 : trackIndex - 1;
    playTrack(playlist[prev], prev);
  }, [trackIndex, playTrack]);

  const togglePlay = useCallback(async () => {
    await ensureInit();
    if (isPlaying) {
      musicGenerator.stop(0.5);
      setIsPlaying(false);
      audioState.update({ isPlaying: false, bass: 0, mid: 0, treble: 0, energy: 0 });
    } else {
      await musicGenerator.play(currentTrack.preset);
      startTimeRef.current = Date.now() - elapsed * 1000;
      setIsPlaying(true);
      audioState.update({ isPlaying: true, bpm: currentTrack.bpm });
    }
  }, [isPlaying, currentTrack, elapsed, ensureInit]);

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = parseInt(e.target.value);
      setVolume(vol);
      setIsMuted(vol === 0);
      musicGenerator.setVolume(vol / 100);
    },
    []
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      musicGenerator.setVolume(volume / 100);
      setIsMuted(false);
    } else {
      musicGenerator.setVolume(0);
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

  return (
    <>
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
            {showPresets ? (
              <button
                onClick={() => setShowPresets(false)}
                {...cursorHandlers}
                className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-white/30"}`} />
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">
                  {!initialized ? "Click to start" : isPlaying ? "Playing" : "Paused"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {!showPresets && (
                <>
                  <button onClick={() => setShowPresets(!showPresets)} {...cursorHandlers} className={`p-2 rounded-xl transition-all ${showPresets ? "text-brand bg-brand/10" : "text-white/30 hover:text-white hover:bg-white/10"}`} aria-label="Sound presets">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  </button>
                  <button onClick={() => setShowPlaylist(!showPlaylist)} {...cursorHandlers} className={`p-2 rounded-xl transition-all ${showPlaylist ? "text-brand bg-brand/10" : "text-white/30 hover:text-white hover:bg-white/10"}`} aria-label="Toggle playlist">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Presets */}
          {showPresets ? (
            <div className="px-5 pb-5 fade-in-up">
              <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Sound Presets</p>
              <div className="space-y-2">
                {playlist.map((track, i) => (
                  <button key={track.id} onClick={() => { playTrack(track, i); setShowPresets(false); }} {...cursorHandlers} className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all group ${currentTrack.id === track.id && isPlaying ? "bg-brand/10 border border-brand/20" : "hover:bg-white/5 border border-transparent"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${currentTrack.id === track.id && isPlaying ? "bg-brand/20" : "bg-white/5"}`}>
                      {currentTrack.id === track.id && isPlaying ? (
                        <div className="flex items-end gap-[2px] h-4">
                          {[0, 1, 2].map((b) => (<div key={b} className="w-[2px] bg-brand rounded-full wave-bar" style={{ animationDelay: `${b * 0.15}s` }} />))}
                        </div>
                      ) : (
                        <Music className="h-4 w-4 text-white/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${currentTrack.id === track.id && isPlaying ? "text-brand" : "text-white/70"}`}>{track.title}</p>
                      <p className="text-[10px] text-white/25 truncate">{track.description}</p>
                    </div>
                    <span className="text-[10px] text-white/15 font-mono">{track.bpm}bpm</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Album Art + Visualizer */}
              <div className="flex flex-col items-center px-5 pt-2 pb-3">
                <div className="relative w-40 h-40 mb-4">
                  <div className={`absolute inset-0 rounded-full ring-rotate ${!isPlaying && "vinyl-spin-paused"}`} style={{ background: "conic-gradient(from 0deg, var(--brand), #818CF8, #C084FC, var(--brand))" }} />
                  <div className={`absolute inset-[3px] rounded-full bg-[#0a0a0a] flex items-center justify-center vinyl-spin ${!isPlaying && "vinyl-spin-paused"}`}>
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
                        return <div key={i} className="absolute w-[3px] rounded-full" style={{ height: `${barHeight}px`, background: `linear-gradient(to top, var(--brand), ${i < 8 ? "#38BDF8" : i < 16 ? "#818CF8" : "#C084FC"})`, opacity: 0.4 + h * 0.6, left: "50%", top: "50%", transformOrigin: "center center", transform: `rotate(${angle}deg) translateY(-88px) translateX(-50%)` }} />;
                      })}
                    </div>
                  )}
                </div>
                <div className="w-full text-center mb-3">
                  <div className="marquee-container">
                    <h3 className="text-sm font-semibold text-white/90 marquee-text">{currentTrack.title}<span className="mx-8 text-white/20">•</span>{currentTrack.title}</h3>
                  </div>
                  <p className="text-[11px] text-white/30 mt-0.5">{currentTrack.artist}</p>
                </div>
                {/* Elapsed time */}
                <div className="w-full px-1">
                  <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand to-purple-400 transition-all duration-1000" style={{ width: isPlaying ? "100%" : "0%", animation: isPlaying ? `shimmer 3s ease-in-out infinite` : "none" }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-white/20 font-mono">{formatTime(elapsed)}</span>
                    <span className="text-[10px] text-white/20 font-mono">generative</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 px-5 py-2">
                <button onClick={prevTrack} {...cursorHandlers} className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all" aria-label="Previous"><SkipBack className="h-4 w-4" /></button>
                <button onClick={togglePlay} {...cursorHandlers} className="relative p-4 rounded-2xl bg-gradient-to-br from-brand to-purple-500 text-white shadow-lg shadow-brand/30 transition-all hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-brand/40" aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <button onClick={nextTrack} {...cursorHandlers} className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all" aria-label="Next"><SkipForward className="h-4 w-4" /></button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 px-6 pb-5 pt-1">
                <button onClick={toggleMute} {...cursorHandlers} className="p-1 rounded-lg text-white/30 hover:text-white transition-colors" aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
                <div className="relative flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden group">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-white/30 transition-all duration-100" style={{ width: `${isMuted ? 0 : volume}%` }} />
                  <input type="range" min={0} max={100} value={isMuted ? 0 : volume} onChange={handleVolume} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                </div>
              </div>

              {/* Playlist */}
              {showPlaylist && (
                <div className="border-t border-white/[0.04] max-h-56 overflow-y-auto fade-in-up">
                  {playlist.map((track, i) => (
                    <button key={track.id} onClick={() => playTrack(track, i)} {...cursorHandlers} className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all hover:bg-white/[0.03] ${currentTrack.id === track.id ? "bg-brand/[0.06]" : ""}`}>
                      <div className={`w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${currentTrack.id === track.id && isPlaying ? "bg-brand/20" : "bg-white/5"}`}>
                        {currentTrack.id === track.id && isPlaying ? (
                          <div className="flex items-end gap-[2px] h-3">
                            {[0, 1, 2].map((b) => (<div key={b} className="w-[2px] bg-brand rounded-full wave-bar" style={{ animationDelay: `${b * 0.15}s` }} />))}
                          </div>
                        ) : (
                          <Music className="h-4 w-4 text-white/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${currentTrack.id === track.id ? "text-brand" : "text-white/60"}`}>{track.title}</p>
                        <p className="text-[10px] text-white/20 truncate">{track.description}</p>
                      </div>
                      <span className="text-[10px] text-white/15 font-mono">{track.bpm}bpm</span>
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
