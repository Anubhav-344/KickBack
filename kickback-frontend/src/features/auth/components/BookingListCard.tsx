// src/features/auth/components/BookingListCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import BottomSheet from "@/components/ui/BottomSheet";
import CenteredModal from "@/components/ui/CenteredModal";
import Badge from "@/components/ui/Badge";
import { formatMinutesAsTime } from "@/lib/dateTime";
import { useCancelBooking, type UserBookingSummary } from "../hooks/useUserBookings";
import ReviewFormSheet from "@/features/reviews/components/ReviewFormSheet";
import toast from "react-hot-toast";

const STATUS_TONE: Record<UserBookingSummary["status"], "available" | "pending" | "error" | "neutral"> = {
  PENDING: "pending",
  CONFIRMED: "available",
  COMPLETED: "neutral",
  CANCELLED: "error",
  EXPIRED: "neutral",
  NO_SHOW: "error",
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

  // Separate open states for the mobile sheet and the desktop modal — both
  // render their content in a portal, so they'd both appear if they shared
  // one flag (see the note in CenteredModal).
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { dateLabel, minutes: startMinutes } = parseTimestamp(booking.startTimestamp);
  const endMinutes = startMinutes + booking.durationMinutes;

  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED";

  const handleCancel = () => {
    cancelBooking.mutate(booking.bookingId, {
      onSuccess: () => {
        toast.success("Booking cancelled");
        setSheetOpen(false);
        setModalOpen(false);
      },
      onError: () => toast.error("Couldn't cancel booking. Please try again."),
    });
  };

  const cancelTrigger = (
    <button className="text-xs lg:text-sm font-medium text-state-error">Cancel</button>
  );

  // Same confirmation content in both the sheet and the modal. "Keep
  // booking" uses Dialog.Close, which closes whichever one it's inside.
  const cancelContent = (
    <>
      <p className="text-sm lg:text-base text-text-secondary mb-4 lg:mb-6">
        This will cancel your booking at {booking.cafeName} on {dateLabel}. This
        can&apos;t be undone.
      </p>
      <div className="flex gap-2.5 lg:gap-3">
        <Dialog.Close asChild>
          <button className="flex-1 bg-bg-surface lg:bg-bg-raised border border-border-subtle text-text-primary text-sm font-medium py-3 lg:py-3.5 rounded-card">
            Keep booking
          </button>
        </Dialog.Close>
        <button
          onClick={handleCancel}
          disabled={cancelBooking.isPending}
          className="flex-1 bg-state-error text-bg-base text-sm font-semibold py-3 lg:py-3.5 rounded-card disabled:opacity-60"
        >
          {cancelBooking.isPending ? "Cancelling..." : "Yes, cancel"}
        </button>
      </div>
    </>
  );

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-3.5 lg:p-5">
      <div className="flex items-start justify-between">
        <button
          onClick={() => navigate(`/cafes/${booking.cafeSlug}`)}
          className="text-left"
        >
          <div className="font-display font-semibold text-base lg:text-lg text-text-primary">
            {booking.cafeName}
          </div>
          <div className="text-xs lg:text-sm text-text-secondary mt-0.5">{booking.resourceName}</div>
        </button>
        <Badge tone={STATUS_TONE[booking.status]} className="flex-shrink-0">
          {booking.status}
        </Badge>
      </div>

      <div className="text-xs lg:text-sm text-text-secondary mt-2.5 tabular-nums">
        {dateLabel} &middot; {formatMinutesAsTime(startMinutes)} &ndash;{" "}
        {formatMinutesAsTime(endMinutes)}
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-sm lg:text-base font-semibold text-text-primary tabular-nums">
          &#8377;{booking.totalAmount}
        </span>

        {canCancel && (
          <>
            {/* Mobile/tablet: bottom sheet, unchanged */}
            <div className="lg:hidden">
              <BottomSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                title="Cancel this booking?"
                trigger={cancelTrigger}
              >
                {cancelContent}
              </BottomSheet>
            </div>

            {/* Desktop: centered confirmation dialog */}
            <div className="hidden lg:block">
              <CenteredModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                title="Cancel this booking?"
                trigger={cancelTrigger}
                size="sm"
              >
                {cancelContent}
              </CenteredModal>
            </div>
          </>
        )}

        {booking.status === "COMPLETED" && !booking.hasReview && (
          <ReviewFormSheet
            bookingId={booking.bookingId}
            cafeName={booking.cafeName}
            trigger={
              <button className="text-xs lg:text-sm font-medium text-accent-hover">
                Leave a review
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
