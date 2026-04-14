import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
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