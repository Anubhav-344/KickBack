// src/features/reviews/components/ReviewCard.tsx
import { Star } from "lucide-react";
import type { Review } from "../types";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">{review.reviewerName}</span>
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-state-pending text-state-pending" />
          <span className="text-xs font-semibold text-text-primary tabular-nums">
            {review.rating}
          </span>
        </div>
      </div>
      {review.comment && (
        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}
