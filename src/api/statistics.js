import { httpClient } from "@/api/client";

export const statisticsPerMonth = async (publisherId) => {
  let queryString = publisherId ? `?publisher_id=${publisherId}` : "";
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/statistics/count-per-month" + queryString
  );
  return response.data;
};

export const statisticsPerDay = async (publisherId) => {
  let queryString = publisherId ? `?publisher_id=${publisherId}` : "";
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/statistics/count-per-day" + queryString
  );
  return response.data;
};

export const topTenCountries = async (publisherId) => {
  let queryString = publisherId ? `?publisher_id=${publisherId}` : "";
  let response = await httpClient(
    process.env.VUE_APP_API_URL + "/statistics/top-ten-countries" + queryString
  );
  return response.data;
};

export const topFiveActiveAdvertisements = async (publisherId) => {
  let queryString = publisherId ? `?publisher_id=${publisherId}` : "";
  let response = await httpClient(
    process.env.VUE_APP_API_URL +
      "/statistics/top-five-active-advertisements" +
      queryString
  );
  return response.data;
};
