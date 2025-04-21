export const allowedFileTypes = {
  mkv_v1: ".mkv",
  mkv_v2: "video/x-matroska",
  mp4: "video/mp4",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  webm: "video/webm",
};

export const rules = (episode?: any, blacklistedEpisodeNumbers?: number[]) => {
  const file = [
    (value: any) => {
      if (!value) return true;

      // Only check if value is a File object
      if (value instanceof File && !Object.values(allowedFileTypes).includes(value.type)) {
        return `File type ${value.type} is not allowed`;
      }
      return true;
    },
  ];

  return {
    title: [],
    number: [
      (value: number) => (value && !Number.isNaN(value)) || "Episode number is required",
      (value: number) => !blacklistedEpisodeNumbers?.includes(Number(value)) || "Episode needs to be unique",
    ],
    type: [(value: string) => !!value || "Type is required"],
    description: [],
    file: file,
  };
};
