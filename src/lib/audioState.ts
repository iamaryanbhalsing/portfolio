"use client";

// Singleton audio state — MusicPlayer writes, AnimatedMesh reads
export const audioState = {
  isPlaying: false,
  bass: 0,
  mid: 0,
  treble: 0,
  energy: 0,
};
