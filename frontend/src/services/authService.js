import axios from "axios";
import { getAccessToken, clearStoredAuth } from "../untils/auth";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Gắn token vào header
 */
API.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Xử lý token hết hạn (401)
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const msg = error.response?.data?.msg;

    // 🔥 Token hết hạn hoặc không hợp lệ
    if (status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ");

      // clear user
      clearStoredAuth();

      // redirect về login (tuỳ bạn)
      window.dispatchEvent(
        new CustomEvent("openAuthModal", {
          detail: {
            type: "login",
            message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

/**
 * AUTH APIs
 */
export const loginApi = async (payload) => {
  const res = await API.post("/auth/login", payload);
  return res.data;
};

export const registerApi = async (payload) => {
  const res = await API.post("/auth/register", payload);
  return res.data;
};

export default API;
