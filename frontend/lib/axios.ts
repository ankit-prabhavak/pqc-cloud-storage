import axios from "axios";

const api = axios.create({
  baseURL: "/api",   // was: process.env.NEXT_PUBLIC_API_URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/me") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `/api/auth/refresh`,   // was: `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;