import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:4000/api", // API Endpoint
  baseURL: "http://guestwifiapi.ca.go.ke",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;