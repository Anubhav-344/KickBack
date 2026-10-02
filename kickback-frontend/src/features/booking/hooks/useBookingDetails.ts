// src/features/booking/hooks/useBookingDetails.ts
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "../api";

// LIVE — GET /api/bookings/{id}. Only used by the Confirmation page now;
// the Preview/checkout page reads the live draft directly instead, since
// no booking exists yet at that point.
export function useBookingDetails(bookingId: number | undefined) {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingApi.getBooking(bookingId!),
    enabled: !!bookingId,
    retry: false,
  });
}
