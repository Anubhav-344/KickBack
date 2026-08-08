// src/app/axiosClient.ts
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

// Attach the auth token to every outgoing request.
// Reads directly from the Zustand store outside any component tree.
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized response/error handling so features don't each
// reimplement "log out on 401" or "toast on server error".
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expired — please log in again.");
    } else if (status === 409) {
      // Reserved for booking-slot conflicts (double-booking race caught server-side)
      toast.error(error?.response?.data?.message ?? "This slot is no longer available.");
    } else if (status >= 500) {
      toast.error("Something went wrong on our end. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
