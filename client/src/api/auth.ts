import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api", // ✅ your backend URL
});

// Send JWT token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = (email: string, password: string) =>
  API.post("/login", { email, password });
