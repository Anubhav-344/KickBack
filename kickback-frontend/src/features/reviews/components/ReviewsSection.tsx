// src/features/reviews/components/ReviewsSection.tsx
import { useCafeReviews } from "../hooks/useCafeReviews";
import ReviewCard from "./ReviewCard";

interface ReviewsSectionProps {
  cafeSlug: string;
}

export default function ReviewsSection({ cafeSlug }: ReviewsSectionProps) {
  const { data: reviews } = useCafeReviews(cafeSlug);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="px-4 py-4 border-b border-border-subtle">
      <h2 className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
        Reviews
      </h2>
      <div className="flex flex-col gap-2.5">
        {reviews.slice(0, 3).map((r) => (
          <ReviewCard key={r.reviewId} review={r} />
        ))}
      </div>
    </section>
  );
}
