import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to dynamically inject JWT access tokens
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiries and format errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized — try to refresh the token first
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        if (refresh) {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refresh,
          });

          if (res.status === 200) {
            const newAccess = res.data.access;
            localStorage.setItem("access_token", newAccess);
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Clear auth and redirect to login on refresh failure
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_role");
          window.location.href = "/login";
        }
      }
    }

    // Handle 403 Forbidden — session is invalid or wrong role, redirect to login
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        const errorMsg = error.response?.data?.error || "Access denied";
        // Only redirect if this looks like an auth/role error (not a data validation 403)
        if (
          errorMsg.toLowerCase().includes("access required") ||
          errorMsg.toLowerCase().includes("unauthorized") ||
          errorMsg.toLowerCase().includes("forbidden")
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_role");
          window.location.href = "/login";
          return Promise.reject(new Error(errorMsg));
        }
      }
    }

    // Build a readable Error from the response body
    const serverMessage =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      error.message ||
      "An unknown error occurred";

    const readableError = new Error(serverMessage);
    (readableError as any).status = error.response?.status;
    (readableError as any).data = error.response?.data;

    return Promise.reject(readableError);
  }
);
