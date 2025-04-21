import type Season from "./season";

export default interface Show {
  id?: number;
  title: string;
  description?: string;
  image?: string;

  seasons?: Season[];
}
