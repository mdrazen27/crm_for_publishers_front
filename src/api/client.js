import App from "@/main";
import axios from "axios";

export function httpClient(url, method = "GET", data = null) {
  let httpClient = axios.create({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    },
  });

  httpClient.interceptors.request.use(requestAuthInterceptor);

  switch (method.toUpperCase()) {
    case "GET":
      return httpClient.get(url);
    case "POST":
      return httpClient.post(url, data);
    case "PUT":
      Object.assign(data, { _method: method });
      return httpClient.post(url, data);
    case "DELETE":
      Object.assign(data, { _method: method });
      return httpClient.post(url, data);
    default:
      return httpClient.get(url);
  }
}

const requestAuthInterceptor = (config) => {
  config.headers["Authorization"] = App.$store.getters["auth/authToken"]
    ? "Bearer " + App.$store.getters["auth/authToken"]
    : "";
  return config;
};
