import { httpClient } from "@/api/client";

export const getAllAdvertisements = async (
  options,
  searchString,
  onlyDeleted
) => {
  const { sortBy, sortDesc, page, itemsPerPage } = options;
  let queryString = `?page=${page}&per_page=${itemsPerPage}`;
  if (sortBy.length) {
    queryString += `&sort_by=${sortBy}&sort_desc=${sortDesc}`;
  }
  if (searchString) {
    queryString += `&search=${searchString}`;
  }
  if (onlyDeleted) {
    queryString += `&deleted=true`;
  }
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/advertisements" + queryString
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
