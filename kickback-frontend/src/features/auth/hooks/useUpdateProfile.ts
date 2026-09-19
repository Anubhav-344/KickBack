// src/features/auth/hooks/useUpdateProfile.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "@/app/axiosClient";
import { useAuthStore } from "../store/useAuthStore";

export interface UserProfile {
  userId: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  username?: string;
  role: "USER" | "OWNER" | "ADMIN";
}

export interface UpdateProfileInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  username?: string;
}

// LIVE — GET /api/users/me (requires auth)
export function useUserProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => axiosClient.get<UserProfile>("/users/me").then((r) => r.data),
    enabled: isAuthenticated,
  });
}

// LIVE — PATCH /api/users/me
export function useUpdateProfile() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      axiosClient.patch<UserProfile>("/users/me", input).then((r) => r.data),
    onSuccess: (updated) => {
      // Drive the store from the SERVER response, not the input, in case
      // the backend normalizes anything.
      if (token) {
        login(
          {
            userId: updated.userId,
            firstName: updated.firstName,
            lastName: updated.lastName,
            email: updated.email,
            role: updated.role,
          },
          token
        );
      }
      void user;
    },
  });
}
