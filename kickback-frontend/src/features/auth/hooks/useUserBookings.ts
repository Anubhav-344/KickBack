// src/features/auth/hooks/useUserBookings.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingApi, type BookingSummary } from "@/features/booking/api";

export type UserBookingSummary = BookingSummary;

// LIVE — GET /api/bookings
export function useUserBookings() {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => bookingApi.listMyBookings(),
  });
}

// LIVE — PATCH /api/bookings/{id}/cancel
export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: number) => bookingApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      // Without this, the Booking page's availability timeline keeps
      // showing the now-freed slot as booked — React Query doesn't know
      // this cancellation affects a completely different query (keyed by
      // resourceId+date), so it has to be told explicitly. We don't know
      // which resourceId/date this booking was for here, so invalidate
      // every availability query broadly rather than trying to target one —
      // it's cheap to refetch and guarantees correctness.
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "availability",
      });
    },
  });
}