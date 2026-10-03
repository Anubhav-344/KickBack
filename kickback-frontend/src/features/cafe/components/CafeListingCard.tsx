// src/features/cafe/components/CafeListingCard.tsx
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import type { CafeListing } from "../types";
import { computeCafeOpenStatus } from "@/lib/cafeStatus";

interface CafeListingCardProps {
  cafe: CafeListing;
}

export default function CafeListingCard({ cafe }: CafeListingCardProps) {
  const navigate = useNavigate();
  const status = computeCafeOpenStatus(cafe.todayOperatingWindow);

  const visibleTags = cafe.resourceTypeTags.slice(0, 3);
  const extraCount = cafe.resourceTypeTags.length - visibleTags.length;

  return (
    <button
      onClick={() => navigate(`/cafes/${cafe.slug}`)}
      className={`text-left bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden hover:border-accent/40 active:scale-[0.99] transition ${
        status.isOpenNow ? "" : "opacity-55"
      }`}
    >
      <div className="h-[120px] lg:h-[260px] relative bg-gradient-to-br from-bg-raised to-bg-surface overflow-hidden">
        {cafe.imageUrl && (
          <img src={cafe.imageUrl} alt={cafe.name} className="w-full h-full object-cover" />
        )}
        <span
          className={`absolute top-2.5 left-2.5 lg:top-3.5 lg:left-3.5 text-[10px] lg:text-xs font-semibold px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full border ${
            status.isOpenNow
              ? "text-state-available bg-bg-base/75 border-state-available/30"
              : "text-text-secondary bg-bg-base/75 border-border-subtle"
          }`}
        >
          {status.label}
        </span>
      </div>

      <div className="p-3.5 lg:p-5">
        <div className="flex items-start justify-between">
          <div className="font-display font-semibold text-lg lg:text-xl text-text-primary">
            {cafe.name}
          </div>
          <div className="flex items-center gap-1 text-sm lg:text-base font-semibold text-text-primary">
            <Star size={12} className="fill-state-pending text-state-pending lg:w-[14px] lg:h-[14px]" />
            {cafe.averageRating.toFixed(1)}
          </div>
        </div>
        <div className="text-xs lg:text-sm text-text-secondary mt-0.5">
          {cafe.area}, {cafe.city}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5 lg:mt-3.5">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] lg:text-xs text-text-secondary border border-border-subtle rounded-full px-2.5 lg:px-3 py-1 lg:py-1.5"
            >
              {tag}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-[10px] lg:text-xs text-text-secondary border border-border-subtle rounded-full px-2.5 lg:px-3 py-1 lg:py-1.5">
              +{extraCount} more
            </span>
          )}
        </div>

        <div className="text-[11px] lg:text-sm text-text-secondary mt-2.5 lg:mt-3.5">
          Starting from{" "}
          <span className="font-semibold text-text-primary tabular-nums">
            &#8377;{cafe.startingHourlyRate}/hr
          </span>
        </div>
      </div>
    </button>
  );
}
