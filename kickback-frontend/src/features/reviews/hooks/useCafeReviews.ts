// src/features/reviews/hooks/useCafeReviews.ts
import { useQuery } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";
import type { Review } from "../types";

// STILL MOCKED — no ReviewController exists on the backend at all yet
// (CreateReviewRequest/ReviewResponse DTOs exist with no controller
// serving them). Swap this for GET /cafes/{slug}/reviews once it lands.
const MOCK_REVIEWS_BY_CAFE: Record<string, Review[]> = {
  "respawn-lounge": [
    { reviewId: 1, rating: 5, comment: "Best gaming caf\u00E9 in Bhopal, the PS5 setup is top notch!", reviewerName: "Aarav K.", createdAt: "2026-07-10" },
    { reviewId: 2, rating: 4, comment: "Great vibe, a bit crowded on weekends.", reviewerName: "Priya S.", createdAt: "2026-07-05" },
    { reviewId: 3, rating: 5, comment: "VR setup is amazing, will come back for sure.", reviewerName: "Rohan M.", createdAt: "2026-06-28" },
  ],
  "pixel-arena": [
    { reviewId: 4, rating: 4, comment: "Solid PCs, great for competitive gaming.", reviewerName: "Ishaan T.", createdAt: "2026-07-01" },
  ],
};

export function useCafeReviews(cafeSlug: string | undefined) {
  return useQuery({
    queryKey: ["cafe-reviews", cafeSlug],
    queryFn: () => mockDelay(cafeSlug ? MOCK_REVIEWS_BY_CAFE[cafeSlug] ?? [] : []),
    enabled: !!cafeSlug,
  });
}
