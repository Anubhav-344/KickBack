// src/features/auth/api.ts
import axiosClient from "@/app/axiosClient";
import type { LoginFormValues, SignupFormValues } from "@/lib/validators";

export interface AuthResponse {
  token: string;
  user: {
    userId: number;
    firstName: string;
    lastName?: string;
    email: string;
    role: "USER" | "OWNER" | "ADMIN";
  };
}

// TEMPORARY: these hit endpoints that don't exist yet. Once the backend is
// built, only this file changes — the hooks and pages below already expect
// this exact shape (token + user), so nothing else needs to move.
export const authApi = {
  login: (values: LoginFormValues) =>
    axiosClient.post<AuthResponse>("/auth/login", values).then((res) => res.data),

  signup: (values: SignupFormValues) =>
    axiosClient
      .post<AuthResponse>("/auth/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        username: values.username,
        password: values.password,
        // confirmPassword is a frontend-only check — never sent to the server
      })
      .then((res) => res.data),
};
