export interface Track {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  bpm: number;
  duration: string;
}

export const playlist: Track[] = [
  { id: "1", title: "Snowman", artist: "WYS", youtubeId: "G7hEBFvBdDk", bpm: 85, duration: "2:14" },
  { id: "2", title: "Coffee", artist: "Beabadoobee", youtubeId: "m8GndmN5lpU", bpm: 90, duration: "3:28" },
  { id: "3", title: "Affection", artist: "Jinsang", youtubeId: "CjB_oVeq8Lo", bpm: 82, duration: "2:45" },
  { id: "4", title: "Still Corners", artist: "Lo-Fi", youtubeId: "8KmN6jvWZoY", bpm: 78, duration: "3:10" },
  { id: "5", title: "Luv Letter", artist: "DJ Okawari", youtubeId: "k9YFpM2d8bU", bpm: 88, duration: "4:56" },
  { id: "6", title: "Feather", artist: "Nujabes", youtubeId: "wqTkM1pSvOo", bpm: 92, duration: "4:07" },
  { id: "7", title: "Aruarian Dance", artist: "Nujabes", youtubeId: "sVgV3BrBe1Y", bpm: 86, duration: "4:12" },
  { id: "8", title: "Koto", artist: "Clovis Reyes", youtubeId: "2B1Aujbq3ZM", bpm: 80, duration: "2:30" },
  { id: "9", title: "Peachy", artist: "Morimoto", youtubeId: "AZfFpN8dFnk", bpm: 75, duration: "2:55" },
  { id: "10", title: "Jazz in Paris", artist: "Media Right", youtubeId: "DqMmEIxqHeo", bpm: 95, duration: "3:15" },
  { id: "11", title: "Chill Day", artist: "LAKEY", youtubeId: "EsyFNDs8mLc", bpm: 84, duration: "2:40" },
  { id: "12", title: "Colors", artist: "Tobu", youtubeId: "2Vv-BfVoq4g", bpm: 128, duration: "4:41" },
];
