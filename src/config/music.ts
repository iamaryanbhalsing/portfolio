export interface Track {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  bpm: number;
  coverUrl: string;
}

export const playlist: Track[] = [
  {
    id: "1",
    title: "Gravedigger",
    artist: "Dave Matthews",
    youtubeId: "i7wSefU2H9Q",
    bpm: 92,
    coverUrl: "https://i.ytimg.com/vi/i7wSefU2H9Q/hqdefault.jpg",
  },
  {
    id: "2",
    title: "No Angels",
    artist: "Justin Timberlake",
    youtubeId: "hAnePKLB1EY",
    bpm: 115,
    coverUrl: "https://i.ytimg.com/vi/hAnePKLB1EY/hqdefault.jpg",
  },
  {
    id: "3",
    title: "Ghost - Emotional Sad Instrumental",
    artist: "Giggle Beats",
    youtubeId: "EPTBhTFfOxk",
    bpm: 75,
    coverUrl: "https://i.ytimg.com/vi/EPTBhTFfOxk/hqdefault.jpg",
  },
  {
    id: "4",
    title: "Dark Scary GHOST BGM",
    artist: "Lion Free Music",
    youtubeId: "x5GovlRKqLI",
    bpm: 70,
    coverUrl: "https://i.ytimg.com/vi/x5GovlRKqLI/hqdefault.jpg",
  },
  {
    id: "5",
    title: "Terrifying Ghost Instrumental",
    artist: "BJ Lofi",
    youtubeId: "WKxK_-mAMac",
    bpm: 68,
    coverUrl: "https://i.ytimg.com/vi/WKxK_-mAMac/hqdefault.jpg",
  },
];
