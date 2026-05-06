import axios from "axios";
import { getCurrentToken, clearStoredAuth } from "./auth";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getCurrentToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config.headers["Authorization"]
    ) {
      clearStoredAuth();
    }
    return Promise.reject(error);
  }
);

export default apiClient;