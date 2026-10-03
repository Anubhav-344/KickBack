// src/features/reviews/components/ReviewFormSheet.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import BottomSheet from "@/components/ui/BottomSheet";
import CenteredModal from "@/components/ui/CenteredModal";
import StarRatingInput from "./StarRatingInput";
import { useCreateReview } from "../hooks/useCreateReview";

interface ReviewFormSheetProps {
  bookingId: number;
  cafeName: string;
  trigger: ReactNode;
}

export default function ReviewFormSheet({ bookingId, cafeName, trigger }: ReviewFormSheetProps) {
  // Separate open states for the mobile sheet and the desktop modal — both
  // render their content in a portal, so they'd both appear if they shared
  // one flag (see the note in CenteredModal). The form fields below are
  // shared, which is fine since only one of the two is ever on screen.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
          setSheetOpen(false);
          setModalOpen(false);
        },
        onError: () => toast.error("Couldn't submit review. Please try again."),
      }
    );
  };

  const formContent = (
    <>
      <p className="text-xs lg:text-sm text-text-secondary -mt-2 lg:-mt-3 mb-4 lg:mb-5">
        {cafeName}
      </p>

      <div className="flex justify-center mb-5 lg:mb-6">
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        className="w-full bg-bg-surface lg:bg-bg-raised border border-border-subtle rounded-card px-3.5 py-3 text-sm lg:text-base text-text-primary placeholder:text-text-secondary resize-none mb-4 lg:mb-5"
      />

      <button
        onClick={handleSubmit}
        disabled={createReview.isPending}
        className="w-full bg-accent text-bg-base font-semibold text-sm lg:text-base py-3.5 lg:py-4 rounded-card shadow-accent-glow disabled:opacity-60"
      >
        {createReview.isPending ? "Submitting..." : "Submit review"}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile/tablet: bottom sheet, unchanged */}
      <div className="lg:hidden">
        <BottomSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Rate your visit"
          trigger={trigger}
        >
          {formContent}
        </BottomSheet>
      </div>

      {/* Desktop: centered modal */}
      <div className="hidden lg:block">
        <CenteredModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Rate your visit"
          trigger={trigger}
          size="md"
        >
          {formContent}
        </CenteredModal>
      </div>
    </>
  );
}
