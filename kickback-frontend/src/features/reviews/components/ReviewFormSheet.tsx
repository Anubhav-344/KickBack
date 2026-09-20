// src/features/reviews/components/ReviewFormSheet.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import BottomSheet from "@/components/ui/BottomSheet";
import StarRatingInput from "./StarRatingInput";
import { useCreateReview } from "../hooks/useCreateReview";

interface ReviewFormSheetProps {
  bookingId: number;
  cafeName: string;
  trigger: ReactNode;
}

export default function ReviewFormSheet({ bookingId, cafeName, trigger }: ReviewFormSheetProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    createReview.mutate(
      { bookingId, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Thanks for your review!");
          setOpen(false);
        },
        onError: () => toast.error("Couldn't submit review. Please try again."),
      }
    );
  };

  return (
    <BottomSheet open={open} onOpenChange={setOpen} title="Rate your visit" trigger={trigger}>
      <p className="text-xs text-text-secondary -mt-2 mb-4">{cafeName}</p>

      <div className="flex justify-center mb-5">
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        className="w-full bg-bg-surface border border-border-subtle rounded-card px-3.5 py-3 text-sm text-text-primary placeholder:text-text-secondary resize-none mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={createReview.isPending}
        className="w-full bg-accent text-bg-base font-semibold text-sm py-3.5 rounded-card shadow-accent-glow disabled:opacity-60"
      >
        {createReview.isPending ? "Submitting..." : "Submit review"}
      </button>
    </BottomSheet>
  );
}
