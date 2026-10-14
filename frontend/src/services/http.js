import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://127.0.0.1:5001/api",
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("leaflens_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("leaflens:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
