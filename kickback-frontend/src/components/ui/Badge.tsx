// src/components/ui/Badge.tsx
import type { HTMLAttributes } from "react";

type BadgeTone = "available" | "pending" | "error" | "neutral" | "muted";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

// Consolidates the status-pill pattern duplicated across ResourceUnitCard's
// AVAILABLE/BOOKED/MAINTENANCE badges, BookingListCard's status badges, the
// café "Open now" indicator, and offer promo-code chips.
const TONE_CLASSES: Record<BadgeTone, string> = {
  available: "bg-state-available/15 text-state-available",
  pending: "bg-state-pending/15 text-state-pending",
  error: "bg-state-error/15 text-state-error-text",
  neutral: "bg-bg-raised text-text-secondary",
  muted: "bg-state-booked/20 text-text-secondary",
};

export default function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-medium px-2 py-1 rounded-full ${TONE_CLASSES[tone]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}