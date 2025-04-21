export enum EpisodeType {
  Movie = "movie",
  Episode = "episode",
  OVA = "ova",
  Special = "special",
  ONA = "ona",
  Music = "music",
}

export default interface Episode {
  id?: number;
  seasonId?: number;
  number?: number;
  title?: string;
  description?: string;
  type?: EpisodeType;
}
