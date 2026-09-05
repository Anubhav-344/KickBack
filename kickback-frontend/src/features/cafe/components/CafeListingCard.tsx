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
      className={`text-left bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden transition-opacity ${
        status.isOpenNow ? "" : "opacity-55"
      }`}
    >
      <div className="h-[120px] relative bg-gradient-to-br from-bg-raised to-bg-surface overflow-hidden">
        {cafe.imageUrl && (
          <img src={cafe.imageUrl} alt={cafe.name} className="w-full h-full object-cover" />
        )}
        <span
          className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
            status.isOpenNow
              ? "text-state-available bg-bg-base/75 border-state-available/30"
              : "text-text-secondary bg-bg-base/75 border-border-subtle"
          }`}
        >
          {status.label}
        </span>
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between">
          <div className="font-display font-semibold text-lg text-text-primary">
            {cafe.name}
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-text-primary">
            <Star size={12} className="fill-state-pending text-state-pending" />
            {cafe.averageRating.toFixed(1)}
          </div>
        </div>
        <div className="text-xs text-text-secondary mt-0.5">
          {cafe.area}, {cafe.city}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-text-secondary border border-border-subtle rounded-full px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-[10px] text-text-secondary border border-border-subtle rounded-full px-2.5 py-1">
              +{extraCount} more
            </span>
          )}
        </div>

        <div className="text-[11px] text-text-secondary mt-2.5">
          Starting from{" "}
          <span className="font-semibold text-text-primary tabular-nums">
            &#8377;{cafe.startingHourlyRate}/hr
          </span>
        </div>
      </div>
    </button>
  );
}
