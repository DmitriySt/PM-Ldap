import axios from "axios";
import { API_URL } from "modules/api/api-constants";
import { refreshAction } from "../auth";
import { store } from "store/store";

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401 && !error.config._retry) {
      const originalRequest = error.config;
      originalRequest._retry = true;
      if (
        originalRequest.headers.authorization ===
        `Bearer ${localStorage.getItem("token")}`
      ) {
        await store.dispatch(refreshAction());
      }
      if (store.getState().authReducer.isAuth) {
        return api.request(originalRequest);
      }
    } else {
      throw error;
    }
  },
);

const baseApi = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export { api, baseApi };
