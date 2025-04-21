export enum EpisodeType {
  Movie = "movie",
  Episode = "episode",
  OVA = "ova",
  Special = "special",
  ONA = "ona",
  Music = "music",
}

export const episodeTypeItems = [
  { title: "Episode", value: EpisodeType.Episode, icon: "mdi-television-play" },
  { title: "Movie", value: EpisodeType.Movie, icon: "mdi-movie-open" },
  { title: "OVA", value: EpisodeType.OVA, icon: "mdi-disc" },
  { title: "Special", value: EpisodeType.Special, icon: "mdi-star" },
  { title: "ONA", value: EpisodeType.ONA, icon: "mdi-web" },
  { title: "Music", value: EpisodeType.Music, icon: "mdi-music" },
];

export default interface Episode {
  id?: number;
  seasonId?: number;
  number?: number;
  title?: string;
  description?: string;
  type?: EpisodeType;
  file?: any;
  files?: any[];
  filename?: string;
}
