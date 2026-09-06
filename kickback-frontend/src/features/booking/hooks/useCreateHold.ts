// src/features/booking/hooks/useCreateHold.ts
import { useMutation } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";

interface CreateHoldInput {
  resourceId: number;
  game: string | null;
  startMinutes: number;
  durationMinutes: number;
  date: string;
}

interface CreateHoldResult {
  bookingId: string;
  holdExpiresAt: number; // epoch ms
}

// TEMPORARY: real version POSTs to /bookings, which performs the FOR UPDATE
// transaction (see earlier design discussion on the race-condition fix) and
// returns the actual hold_expires_at from the server. This mock always
// "succeeds" — the real endpoint can also fail with 409 if the slot was
// taken between the client's last check and this request, which callers
// should already handle via axiosClient's existing 409 toast interceptor.
export function useCreateHold() {
  return useMutation({
    mutationFn: (input: CreateHoldInput) =>
      mockDelay<CreateHoldResult>(
        {
          bookingId: `KB-MOCK-${Date.now()}`,
          holdExpiresAt: Date.now() + 10 * 60 * 1000,
        },
        600
      ),
  });
}
