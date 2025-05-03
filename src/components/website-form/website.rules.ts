const requiredRule = (fieldName: string) => (v: string) => !!v || `${fieldName} is required`;

const urlRule = (v: string) => {
  try {
    new URL(v);
    return true;
  } catch (_) {
    return "URL must be valid";
  }
};

export const websiteRules = {
  title: [requiredRule("Title")],
  url: [requiredRule("URL"), urlRule],
};
