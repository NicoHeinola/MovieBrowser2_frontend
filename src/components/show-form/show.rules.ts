import type Season from "@/models/season";
import type Show from "@/models/show";

export const rules = (show?: Show) => {
  return {
    title: [(v: string) => !!v || "Title is required"],
    description: [],
    image: [(v: string) => !v || /^https?:\/\/.+\..+/.test(v) || "Image must be a valid URL"],
    seasons: [
      (_: any) => {
        const seasons = show?.seasons ?? [];

        if (!seasons || seasons.length === 0) return true;
        const numbers = seasons.map((s) => Number(s.number));
        const uniqueNumbers = new Set(numbers);
        return numbers.length === uniqueNumbers.size || "Each season must have a unique number";
      },
    ],
  };
};
