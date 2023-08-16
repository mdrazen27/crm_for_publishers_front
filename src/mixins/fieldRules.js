export const fieldRules = {
  required: [(v) => (!!v && !!v.trim()) || "Field is required"],
  email: [
    (v) => (!!v && !!v.trim()) || "Field is required",
    (v) => /.+@.+\..+/.test(v) || "Please enter valid email",
  ],
  password: [
    (v) => (!!v && !!v.trim()) || "Field is required",
    (v) => v.length >= 8 || "Minimum 8 characters",
  ],
  url: [
    (v) => (!!v && !!v.trim()) || "Field is required",
    (v) =>
      /(https:\/\/|http:\/\/)?[a-zA-Z0-9]+(\.[a-zA-Z0-9]{2,})/.test(v) ||
      "Please enter valid url",
  ],
};
