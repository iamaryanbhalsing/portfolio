import type { TrackPreset } from "@/lib/MusicGenerator";
import { PRESETS } from "@/lib/MusicGenerator";

export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  description: string;
  preset: TrackPreset;
}

export const playlist: Track[] = PRESETS.map((p) => ({
  id: p.id,
  title: p.name,
  artist: p.artist,
  bpm: p.bpm,
  description: p.description,
  preset: p,
}));

export const defaultTrack = playlist[0];
