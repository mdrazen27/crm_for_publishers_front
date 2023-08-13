export const fieldRules = {
  required: [(v) => (!!v && !!v.trim()) || "Field is required"],
  email: [
    (v) => (!!v && !!v.trim()) || "Field is required",
    (v) => /.+@.+\..+/.test(v) || "Please enter valid email",
  ],
};
