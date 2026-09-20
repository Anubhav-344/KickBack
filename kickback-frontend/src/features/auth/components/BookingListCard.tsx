// src/features/auth/components/BookingListCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import BottomSheet from "@/components/ui/BottomSheet";
import { formatMinutesAsTime } from "@/lib/dateTime";
import { useCancelBooking, type UserBookingSummary } from "../hooks/useUserBookings";
import ReviewFormSheet from "@/features/reviews/components/ReviewFormSheet";
import toast from "react-hot-toast";

const STATUS_STYLES: Record<UserBookingSummary["status"], string> = {
  PENDING: "bg-state-pending/15 text-state-pending",
  CONFIRMED: "bg-state-available/15 text-state-available",
  COMPLETED: "bg-bg-raised text-text-secondary",
  CANCELLED: "bg-state-error/10 text-state-error",
  EXPIRED: "bg-bg-raised text-text-secondary",
  NO_SHOW: "bg-state-error/10 text-state-error",
};

function parseTimestamp(iso: string) {
  const d = new Date(iso);
  return {
    dateLabel: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
    minutes: d.getHours() * 60 + d.getMinutes(),
  };
}

interface BookingListCardProps {
  booking: UserBookingSummary;
}

export default function BookingListCard({ booking }: BookingListCardProps) {
  const navigate = useNavigate();
  const cancelBooking = useCancelBooking();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { dateLabel, minutes: startMinutes } = parseTimestamp(booking.startTimestamp);
  const endMinutes = startMinutes + booking.durationMinutes;

  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED";

  const handleCancel = () => {
    cancelBooking.mutate(booking.bookingId, {
      onSuccess: () => {
        toast.success("Booking cancelled");
        setConfirmOpen(false);
      },
      onError: () => toast.error("Couldn't cancel booking. Please try again."),
    });
  };

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-3.5">
      <div className="flex items-start justify-between">
        <button
          onClick={() => navigate(`/cafes/${booking.cafeSlug}`)}
          className="text-left"
        >
          <div className="font-display font-semibold text-base text-text-primary">
            {booking.cafeName}
          </div>
          <div className="text-xs text-text-secondary mt-0.5">{booking.resourceName}</div>
        </button>
        <span
          className={`text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[booking.status]}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="text-xs text-text-secondary mt-2.5 tabular-nums">
        {dateLabel} &middot; {formatMinutesAsTime(startMinutes)} &ndash;{" "}
        {formatMinutesAsTime(endMinutes)}
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-sm font-semibold text-text-primary tabular-nums">
          &#8377;{booking.totalAmount}
        </span>

        {canCancel && (
          <BottomSheet
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Cancel this booking?"
            trigger={
              <button className="text-xs font-medium text-state-error">Cancel</button>
            }
          >
            <p className="text-sm text-text-secondary mb-4">
              This will cancel your booking at {booking.cafeName} on {dateLabel}. This
              can&apos;t be undone.
            </p>
            <div className="flex gap-2.5">
              <Dialog.Close asChild>
                <button className="flex-1 bg-bg-surface border border-border-subtle text-text-primary text-sm font-medium py-3 rounded-card">
                  Keep booking
                </button>
              </Dialog.Close>
              <button
                onClick={handleCancel}
                disabled={cancelBooking.isPending}
                className="flex-1 bg-state-error text-bg-base text-sm font-semibold py-3 rounded-card disabled:opacity-60"
              >
                {cancelBooking.isPending ? "Cancelling..." : "Yes, cancel"}
              </button>
            </div>
          </BottomSheet>
        )}

        {booking.status === "COMPLETED" && !booking.hasReview && (
          <ReviewFormSheet
            bookingId={booking.bookingId}
            cafeName={booking.cafeName}
            trigger={
              <button className="text-xs font-medium text-accent-hover">
                Leave a review
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
