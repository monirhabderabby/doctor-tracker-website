import axios from "axios";

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: { path: string; message: string }[];
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15_000,
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.status === 401) return "Invalid email or password";
    return error.response?.data?.message || "Unable to connect. Please try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

let sessionRecovery: Promise<void> | undefined;

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && typeof window !== "undefined") {
      const pathname = new URL(error.config?.url ?? "", "http://api.local").pathname;
      if (!/\/auth\/(login|logout)\/?$/.test(pathname)) {
        // Share recovery across concurrent 401s, and never redirect with a stale cookie.
        if (!sessionRecovery) {
          sessionRecovery = api.post("/auth/logout").then(() => {
            window.location.replace("/login");
          }).catch(() => {
            throw new Error("Your session expired, but it could not be cleared. Please try again.");
          }).finally(() => {
            sessionRecovery = undefined;
          });
        }
        await sessionRecovery;
      }
    }
    return Promise.reject(error);
  },
);
