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

// LIVE — matches AuthController exactly:
//   POST /api/auth/login  { identifier, password }
//   POST /api/auth/signup { firstName, lastName, email, phone, username, password }
// Both return AuthResponse { token, user }, which is already the shape
// useAuthStore.login() expects — no mapping needed.
export const authApi = {
  login: (values: LoginFormValues) =>
    axiosClient.post<AuthResponse>("/auth/login", values).then((res) => res.data),

  signup: (values: SignupFormValues) =>
    axiosClient
      .post<AuthResponse>("/auth/signup", {
        firstName: values.firstName,
        lastName: values.lastName || undefined,
        email: values.email,
        phone: values.phone,
        username: values.username || undefined,
        password: values.password,
        // confirmPassword is a frontend-only check — never sent
      })
      .then((res) => res.data),
};
