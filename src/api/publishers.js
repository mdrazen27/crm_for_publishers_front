import { httpClient } from "@/api/client";

export const getAllPublishers = async () => {
  let response = await httpClient(process.env.VUE_APP_API_URL + "/publishers");
  return response.data;
};

export const getPublisher = async (publisherId) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/publishers/" + publisherId
  );
  return response.data;
};

export const savePublisher = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/publishers",
    "POST",
    data
  );
  return response.data;
};

export const updatePublisher = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/publishers/" + data.id,
    "PUT",
    data
  );
  return response.data;
};

export const deletePublisher = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/publishers/" + data.id,
    "DELETE",
    data
  );
  return response.data;
};

export const togglePublisherStatus = async (data) => {
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/publishers/" + data.id + "/toggle-status",
    "POST",
    data
  );
  return response.data;
};
