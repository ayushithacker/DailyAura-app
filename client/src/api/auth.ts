import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = (email: string, password: string) =>
  API.post("/login", { email, password });
