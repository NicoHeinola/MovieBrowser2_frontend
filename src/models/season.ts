import type Episode from "./episode";

export default interface Season {
  id?: number;
  showId?: number;
  number?: number;

  title?: string;
  description?: string;
  image?: string;
  episodes?: Episode[];
}
