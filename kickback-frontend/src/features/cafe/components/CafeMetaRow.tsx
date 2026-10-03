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
    <div className="flex items-center justify-between px-4 lg:px-8 py-3.5 lg:py-6 border-b border-border-subtle">
      <div>
        <h1 className="font-display font-semibold text-xl lg:text-3xl text-text-primary">
          {name}
        </h1>
        <div className="flex items-center gap-1.5 text-[13px] lg:text-base text-text-secondary mt-0.5 lg:mt-1.5">
          <span
            className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${
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
        <div className="flex items-center gap-1 font-semibold text-[19px] lg:text-2xl text-text-primary tabular-nums">
          <Star size={15} className="fill-state-pending text-state-pending lg:w-[19px] lg:h-[19px]" />
          {averageRating.toFixed(1)}
        </div>
        <div className="text-[13px] lg:text-base text-text-secondary mt-0.5 lg:mt-1">
          {totalReviews} reviews
        </div>
      </div>
    </div>
  );
}
