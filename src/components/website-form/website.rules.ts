import type Website from "@/models/website";

const requiredRule = (fieldName: string) => (v: string) => !!v || `${fieldName} is required`;

const urlRule = (v: string) => {
  try {
    new URL(v);
    return true;
  } catch (_) {
    return "URL must be valid";
  }
};

export const websiteRules = (website: Website) => {
  return {
    title: [requiredRule("Title")],
    url: [requiredRule("URL"), urlRule],
    tag: [(v: string) => !website.tags?.find((tag) => tag.name === v) || "Tag already exists"],
  };
};
