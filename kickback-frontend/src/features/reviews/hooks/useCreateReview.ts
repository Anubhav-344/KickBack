// src/features/reviews/hooks/useCreateReview.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";
import { markBookingAsReviewed } from "@/features/auth/hooks/useUserBookings";

interface CreateReviewInput {
  bookingId: number;
  rating: number;
  comment?: string;
}

// STILL MOCKED — matches CreateReviewRequest's shape (bookingId, rating,
// comment) exactly, so swapping to a real POST /reviews call later is a
// one-line change once the backend adds a ReviewController.
export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) => mockDelay(input, 500),
    onSuccess: (input) => {
      markBookingAsReviewed(input.bookingId);
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
    },
  });
}
