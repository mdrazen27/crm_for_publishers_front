import { httpClient } from "@/api/client";

export const getAllAdminUsers = async () => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/admin-users",
    "GET"
  );
  return response.data;
};

export const deleteAdminUser = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/admin-users/" + data.id,
    "DELETE",
    data
  );
  return response.data;
};

export const saveAdminUser = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/admin-users",
    "POST",
    data
  );
  return response.data;
};

export const updateAdminUser = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/admin-users/" + data.id,
    "PUT",
    data
  );
  return response.data;
};
