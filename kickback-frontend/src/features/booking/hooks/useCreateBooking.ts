// src/features/booking/hooks/useCreateBooking.ts
import { useMutation } from "@tanstack/react-query";
import { bookingApi, type CreateBookingPayload } from "../api";

// LIVE — POST /api/bookings. Called from BookingPage's "Book" click, with
// no offer attached yet — that gets applied afterward via
// PATCH /bookings/{id}/offer (useApplyBookingOffer) on the Preview page,
// while this booking's hold is still active. This restores the original
// "reserve first, decide on offers after" flow now that the backend
// supports updating a pending booking's offer directly.
export function useCreateBooking() {
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingApi.createBooking(payload),
  });
}
