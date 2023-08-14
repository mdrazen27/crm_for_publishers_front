import { httpClient } from "@/api/client";

export const getAllAdvertisements = async () => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/advertisements"
  );
  return response.data;
};

export const getAdvertisement = async (advertisementId) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/advertisements/" + advertisementId
  );
  return response.data;
};

export const saveAdvertisement = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/advertisements",
    "POST",
    data
  );
  return response.data;
};

export const updateAdvertisement = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/advertisements/" + data.id,
    "PUT",
    data
  );
  return response.data;
};

export const deleteAdvertisement = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/advertisements/" + data.id,
    "DELETE",
    data
  );
  return response.data;
};

export const toggleAdvertisementStatus = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL +
      "/advertisements/" +
      data.id +
      "/toggle-status",
    "POST",
    data
  );
  return response.data;
};
