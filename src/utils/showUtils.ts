import type Show from "@/models/show";

export const calculateTotalSizeOfShow = (show: Show): number => {
  if (!show.seasons || show.seasons.length === 0) {
    return 0;
  }

  return show.seasons.reduce((totalSize, season) => {
    if (!season.episodes || season.episodes.length === 0) {
      return totalSize;
    }
    const seasonSize = season.episodes.reduce((size, episode) => {
      return size + (episode.file_size_bytes || 0);
    }, 0);
    return totalSize + seasonSize;
  }, 0);
};
