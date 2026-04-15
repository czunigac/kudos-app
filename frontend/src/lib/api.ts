import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { createClient } from "./supabase/client";

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5235",
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const supabase = createClient();
    const { data, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError || !data.session?.access_token) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    originalRequest.headers.set(
      "Authorization",
      `Bearer ${data.session.access_token}`
    );

    return api(originalRequest);
  }
);

export default api;
