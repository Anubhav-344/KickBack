// src/features/reviews/hooks/useCafeReviews.ts
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/app/axiosClient";
import type { Review } from "../types";

// LIVE — GET /api/cafes/{slug}/reviews (public)
export function useCafeReviews(cafeSlug: string | undefined) {
  return useQuery({
    queryKey: ["cafe-reviews", cafeSlug],
    queryFn: () =>
      axiosClient.get<Review[]>(`/cafes/${cafeSlug}/reviews`).then((res) => res.data),
    enabled: !!cafeSlug,
  });
}