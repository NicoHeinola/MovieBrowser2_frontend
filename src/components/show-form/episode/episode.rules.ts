export const rules = (episode?: any, blacklistedEpisodeNumbers?: number[]) => {
  return {
    title: [],
    number: [
      (value: number) => (value && !Number.isNaN(value)) || "Episode number is required",
      (value: number) => !blacklistedEpisodeNumbers?.includes(Number(value)) || "Episode needs to be unique",
    ],
    description: [],
  };
};
