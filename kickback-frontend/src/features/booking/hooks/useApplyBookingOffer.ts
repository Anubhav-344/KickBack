// src/features/booking/hooks/useApplyBookingOffer.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/app/axiosClient";
import type { BookingResponse } from "../api";

interface ApplyOfferInput {
  bookingId: number;
  offerId: number | null;
  promoCode: string | null;
}

// LIVE — PATCH /api/bookings/{id}/offer. Updates the offer on an already-
// created PENDING booking (while its hold is still active), returning the
// booking with freshly recalculated subtotal/discount/tax/total. This is
// what lets the hold-then-apply-offer-then-pay flow work: the booking
// already exists, so Pay never needs to create anything — it just charges
// whatever totalAmount this endpoint most recently returned.
export function useApplyBookingOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, offerId, promoCode }: ApplyOfferInput) =>
      axiosClient
        .patch<BookingResponse>(`/bookings/${bookingId}/offer`, { offerId, promoCode })
        .then((res) => res.data),
    onSuccess: (updated, variables) => {
      // Write the fresh numbers straight into the cache so the page
      // re-renders immediately, without waiting on a refetch round-trip.
      queryClient.setQueryData(["booking", variables.bookingId], updated);
    },
  });
}
