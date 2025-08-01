import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = (email: string, password: string) =>
  api.post("/login", { email, password });

export const getUserProfile = () => api.get("/profile");

export default api;
