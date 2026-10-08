// src/features/booking/components/ResourceHeader.tsx
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ResourceHeaderProps {
  cafeName: string;
  unitName: string;
  hourlyRate: number;
  maxPlayers?: number;
  minPlayers?: number;
  imageUrl?: string;
  // Per-unit note from the database. Nothing renders when the unit has none.
  extraNote?: string;
}

function formatPlayerCount(minPlayers?: number, maxPlayers?: number): string {
  if (!maxPlayers) return "";
  if (minPlayers && minPlayers !== maxPlayers) {
    return ` \u00B7 ${minPlayers}-${maxPlayers} players`;
  }
  return ` \u00B7 Up to ${maxPlayers} players`;
}

export default function ResourceHeader({
  cafeName,
  unitName,
  hourlyRate,
  maxPlayers,
  minPlayers,
  imageUrl,
  extraNote,
}: ResourceHeaderProps) {
  const navigate = useNavigate();
  const { cafeSlug } = useParams();

  return (
    <div className="px-4 lg:px-0 pt-3.5">
      <div className="flex items-stretch gap-3 lg:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate(`/cafes/${cafeSlug}`)} aria-label="Back to café">
              <ArrowLeft size={18} className="text-text-secondary lg:w-5 lg:h-5" />
            </button>
            <span className="text-[17px] lg:text-xl font-medium text-text-primary/65">
              {cafeName}
            </span>
          </div>

          <div className="mt-2 lg:mt-4">
            <h1 className="font-display font-semibold text-2xl lg:text-4xl text-text-primary">
              {unitName}
            </h1>
            <div className="text-xs lg:text-base text-text-secondary mt-0.5 lg:mt-1.5 tabular-nums">
              &#8377;{hourlyRate}/hr
              {formatPlayerCount(minPlayers, maxPlayers)}
            </div>
            {extraNote && (
              <div className="text-[11px] lg:text-sm text-text-secondary mt-1 lg:mt-2 italic">
                {extraNote}
              </div>
            )}
          </div>
        </div>

        {/* Significantly bigger on desktop (w-[84px] -> lg:w-[220px]) — this
            was barely visible before, especially with how much room the
            two-column desktop layout actually has available. */}
        <div className="w-[84px] lg:w-[220px] h-auto lg:h-[220px] rounded-2xl flex-shrink-0 bg-gradient-to-br from-bg-raised to-bg-surface border border-border-subtle overflow-hidden">
          {imageUrl && (
            <img src={imageUrl} alt={unitName} className="w-full h-full object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}