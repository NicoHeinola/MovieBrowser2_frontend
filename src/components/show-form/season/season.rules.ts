import type Season from "@/models/season";

export const rules = (season?: Season, blacklistedSeasonNumbers?: number[]) => {
  return {
    title: [],
    number: [
      (value: number) => (value && !Number.isNaN(value)) || "Season number is required",
      (value: number) => !blacklistedSeasonNumbers?.includes(Number(value)) || "Season needs to be unique",
    ],

    description: [],

    image: [(value: string) => !value || /^https?:\/\/.+\..+/.test(value) || "Image must be a valid URL"],
  };
};
