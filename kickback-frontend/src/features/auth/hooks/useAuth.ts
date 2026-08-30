// src/features/auth/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../api";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginFormValues, SignupFormValues } from "@/lib/validators";

export function useLogin(redirectTo?: string) {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.firstName}!`);
      navigate(redirectTo || "/");
    },
    onError: () => {
      toast.error("Invalid credentials. Please try again.");
    },
  });
}

export function useSignup(redirectTo?: string) {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (values: SignupFormValues) => authApi.signup(values),
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(`Welcome to KickBack, ${data.user.firstName}!`);
      navigate(redirectTo || "/");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });
}
