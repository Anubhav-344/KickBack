// src/features/auth/hooks/useThemeChoice.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/app/axiosClient";
import { applyTheme, useTheme } from "@/lib/theme";
import type { Theme } from "@/lib/theme";
import { useAuthStore } from "../store/useAuthStore";
import type { UserProfile } from "./useUpdateProfile";

/**
 * The theme plus a setter used by every control that changes it (the header
 * toggle and Settings > Appearance). It applies the theme straight away and
 * remembers it in the browser; for a logged-in user it also saves it to their
 * account, so it follows them to other devices. If that save fails the theme
 * still changes here, which is all that matters in the moment.
 *
 * LIVE — PATCH /api/users/me/preferences  { theme: "DARK" | "LIGHT" }
 */
export function useThemeChoice(): [Theme, (theme: Theme) => void] {
  const [theme] = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: (next: Theme) =>
      axiosClient
        .patch<UserProfile>("/users/me/preferences", { theme: next.toUpperCase() })
        .then((r) => r.data),
    onSuccess: (profile) => queryClient.setQueryData(["user-profile"], profile),
  });

  const setTheme = (next: Theme) => {
    if (next === theme) return;
    applyTheme(next);
    if (isAuthenticated) save.mutate(next);
  };

  return [theme, setTheme];
}
