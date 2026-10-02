// src/features/reviews/hooks/useCreateReview.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/app/axiosClient";

interface CreateReviewInput {
  bookingId: number;
  rating: number;
  comment?: string;
}

// LIVE — POST /api/bookings/{bookingId}/reviews. The backend validates the
// booking belongs to the caller, is COMPLETED, and hasn't already been
// reviewed — and recalculates the café's average_rating/total_reviews
// automatically, so refetching cafe details after this will show the new rating.
export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, rating, comment }: CreateReviewInput) =>
      axiosClient
        .post(`/bookings/${bookingId}/reviews`, { rating, comment })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      // Café detail/rating changed too, but we don't know the slug here —
      // the component calling this should invalidate ["cafe", slug] itself
      // if it has that context, or just let the next natural refetch pick it up.
    },
  });
}