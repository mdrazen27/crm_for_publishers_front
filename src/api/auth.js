import { httpClient } from "@/api/client";

export const login = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/login",
    "POST",
    data
  );
  return response.data;
};

export const changePassword = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/change-password",
    "POST",
    data
  );
  return response.data;
};
