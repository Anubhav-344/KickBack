// src/features/auth/hooks/useUpdateProfile.ts
import { useMutation } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";
import { useAuthStore } from "../store/useAuthStore";

interface UpdateProfileInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  username?: string;
}

// TEMPORARY: mock-resolves and patches the local auth store directly.
// Real version PATCHes /users/me, and the response (not just the input)
// should drive the store update in case the server normalizes any fields.
export function useUpdateProfile() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => mockDelay(input, 500),
    onSuccess: (updated) => {
      if (user && token) {
        login({ ...user, ...updated }, token);
      }
    },
  });
}
