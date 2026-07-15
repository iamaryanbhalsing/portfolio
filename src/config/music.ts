import type { TrackPreset } from "@/lib/MusicGenerator";
import { PRESETS } from "@/lib/MusicGenerator";

export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  description: string;
  preset?: TrackPreset;
  videoId?: string;
}

export const playlist: Track[] = [
  {
    id: "blinding-lights",
    title: "Blinding Lights",
    artist: "The Weeknd",
    bpm: 171,
    description: "80s-inspired synthwave hit",
    videoId: "4NRXx6U8AB0",
  },
  ...PRESETS.map((p) => ({
    id: p.id,
    title: p.name,
    artist: p.artist,
    bpm: p.bpm,
    description: p.description,
    preset: p,
  })),
];

export const defaultTrack = playlist[0];
