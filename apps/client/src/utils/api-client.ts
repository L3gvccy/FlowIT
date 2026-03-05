import axios from "axios";
import { HOST } from "./constants";

export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
