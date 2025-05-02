import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30 * 1000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

const basicAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30 * 1000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

const authCheck = (config: any) => {
  const auth = useAuthStore();

  if (auth.isAuthenticated) {
    const token = auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
};

api.interceptors.request.use((config) => {
  config = authCheck(config);
  return config;
});

basicAPI.interceptors.request.use((config) => {
  config = authCheck(config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      const auth = useAuthStore();

      const success = auth.refreshToken();

      if (!success) {
        auth.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { basicAPI, api };
