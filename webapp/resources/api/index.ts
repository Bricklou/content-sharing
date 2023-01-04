import axios from "axios";

export const HttpAPI = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    contentType: "application/json",
  },
});

HttpAPI.defaults.xsrfHeaderName = "X-CSRFToken";
HttpAPI.defaults.xsrfCookieName = "csrftoken";
