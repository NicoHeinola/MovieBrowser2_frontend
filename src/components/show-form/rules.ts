export const rules = () => {
  return {
    title: [(value: string) => !!value || "Title is required"],

    description: [],

    image: [(value: string) => !value || /^https?:\/\/.+\..+/.test(value) || "Image must be a valid URL"],
  };
};
