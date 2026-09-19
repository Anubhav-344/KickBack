// src/features/booking/hooks/useCreateHold.ts
import { useMutation } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";

export interface CreateHoldInput {
  resourceId: number;
  gameId: number | null;
  startMinutes: number;
  durationMinutes: number;
  date: string; // ISO yyyy-mm-dd
}

interface CreateHoldResult {
  bookingId: number;
  holdExpiresAt: number; // epoch ms
}

// STILL MOCKED — there is no BookingController on the backend yet (the
// CreateBookingRequest DTO exists, but nothing serves POST /api/bookings).
//
// When it lands, this becomes:
//   axiosClient.post("/bookings", {
//     resourceId, gameId, date,
//     startTimestamp: `${date}T${hhmm(startMinutes)}:00`,
//     endTimestamp:   `${date}T${hhmm(startMinutes + durationMinutes)}:00`,
//   })
// i.e. the backend wants ISO LocalDateTime pairs, not minutes/duration —
// the conversion belongs here so the rest of the app keeps its simpler
// minutes-since-midnight model.
export function useCreateHold() {
  return useMutation({
    mutationFn: (_input: CreateHoldInput) =>
      mockDelay<CreateHoldResult>(
        { bookingId: Date.now(), holdExpiresAt: Date.now() + 10 * 60 * 1000 },
        600
      ),
  });
}
