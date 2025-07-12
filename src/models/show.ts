import type Season from "./season";
import type ShowCategory from "./showCategory";

export default interface Show {
  id?: number;
  title: string;
  description?: string;
  image?: string;

  seasons?: Season[];
  categories?: ShowCategory[];
}
