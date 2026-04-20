import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Gắn token tự động
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = async (payload) => {
  const res = await API.post("/auth/login", payload);
  return res.data;
};

export const registerApi = async (payload) => {
  const res = await API.post("/auth/register", payload);
  return res.data;
};

export default API;