export const rules = () => {
  return {
    username: [
      (v: string) => !!v || "Username is required",
      (v: string) => (v && v.length >= 3) || "Username must be at least 3 characters long",
      (v: string) => (v && v.length <= 50) || "Username must be at most 50 characters long",
    ],
    password: [
      (v: string) => !!v || "Password is required",
      (v: string) => (v && v.length >= 3) || "Password must be at least 3 characters long",
      (v: string) => (v && v.length <= 50) || "Password must be at most 50 characters long",
    ],
  };
};
