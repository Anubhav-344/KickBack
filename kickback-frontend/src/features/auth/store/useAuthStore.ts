// src/features/auth/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId: number;
  firstName: string;
  lastName?: string;
  email: string;
  role: "USER" | "OWNER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "kickback-auth", // localStorage key — persists login across refreshes
    }
  )
);

// Non-hook accessor — this is exactly why Zustand over Context:
// axiosClient (a plain module, not a component) can read the token
// via useAuthStore.getState().token without any React context plumbing.
