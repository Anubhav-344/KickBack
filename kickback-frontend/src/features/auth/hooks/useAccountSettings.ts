// src/features/auth/hooks/useAccountSettings.ts
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/app/axiosClient";

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// LIVE — POST /api/users/me/password  (204 on success)
//   403 = current password is wrong, 400 = new password rejected.
// A wrong current password is deliberately not a 401: axiosClient treats 401
// as "session expired" and would log the user out.
export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      axiosClient.post("/users/me/password", input).then(() => undefined),
  });
}

// LIVE — POST /api/users/me/deletion  { password }  (204 on success)
//   403 = wrong password, 422 = the user still has an upcoming booking.
// Logging out and leaving the page is the caller's job (see DeleteAccountPage).
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) =>
      axiosClient.post("/users/me/deletion", { password }).then(() => undefined),
  });
}

// LIVE — POST /api/auth/forgot-password { identifier }  (always 204, even for unknown accounts,
// so the page can't be used to discover who is registered)
export function useForgotPassword() {
  return useMutation({
    mutationFn: (identifier: string) =>
      axiosClient.post("/auth/forgot-password", { identifier }).then(() => undefined),
  });
}

// LIVE — POST /api/auth/reset-password { token, newPassword }  (204; 400 = link invalid/expired)
export function useResetPassword() {
  return useMutation({
    mutationFn: (input: { token: string; newPassword: string }) =>
      axiosClient.post("/auth/reset-password", input).then(() => undefined),
  });
}
