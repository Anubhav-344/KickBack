// src/features/cafe/components/CafeMetaRow.tsx
import { Star } from "lucide-react";

interface CafeMetaRowProps {
  name: string;
  isOpenNow: boolean;
  statusLabel: string;
  locationLabel: string;
  averageRating: number;
  totalReviews: number;
}

export default function CafeMetaRow({
  name,
  isOpenNow,
  statusLabel,
  locationLabel,
  averageRating,
  totalReviews,
}: CafeMetaRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-subtle">
      <div>
        <h1 className="font-display font-semibold text-xl text-text-primary">
          {name}
        </h1>
        <div className="flex items-center gap-1.5 text-[13px] text-text-secondary mt-0.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOpenNow
                ? "bg-state-available shadow-available-glow"
                : "bg-state-booked"
            }`}
          />
          {statusLabel} &middot; {locationLabel}
        </div>
      </div>

      <div className="flex flex-col items-end">
        {/* Number rendered in body font + tabular-nums, not the display font —
            condensed grotesks distort numerals at this weight (see design notes) */}
        <div className="flex items-center gap-1 font-semibold text-[19px] text-text-primary tabular-nums">
          <Star size={15} className="fill-state-pending text-state-pending" />
          {averageRating.toFixed(1)}
        </div>
        <div className="text-[13px] text-text-secondary mt-0.5">
          {totalReviews} reviews
        </div>
      </div>
    </div>
  );
}
