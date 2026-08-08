// src/features/booking/components/ResourceHeader.tsx
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ResourceHeaderProps {
  cafeName: string;
  unitName: string;
  hourlyRate: number;
  maxPlayers?: number;
  imageUrl?: string;
}

export default function ResourceHeader({
  cafeName,
  unitName,
  hourlyRate,
  maxPlayers,
  imageUrl,
}: ResourceHeaderProps) {
  const navigate = useNavigate();
  const { cafeSlug } = useParams();

  return (
    <div className="px-4 pt-3.5">
      <div className="flex items-stretch gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate(`/cafes/${cafeSlug}`)} aria-label="Back to café">
              <ArrowLeft size={18} className="text-text-secondary" />
            </button>
            <span className="text-[17px] font-medium text-text-primary/65">
              {cafeName}
            </span>
          </div>

          <div className="mt-2">
            <div className="font-display font-semibold text-2xl text-text-primary">
              {unitName}
            </div>
            <div className="text-xs text-text-secondary mt-0.5 tabular-nums">
              &#8377;{hourlyRate}/hr
              {maxPlayers ? ` \u00B7 Up to ${maxPlayers} players` : ""}
            </div>
            <div className="text-[11px] text-text-secondary mt-1 italic">
              Extra controllers available at the caf&eacute; &middot; &#8377;50 each
            </div>
          </div>
        </div>

        <div className="w-[84px] rounded-2xl flex-shrink-0 bg-gradient-to-br from-bg-raised to-bg-surface border border-border-subtle overflow-hidden">
          {imageUrl && (
            <img src={imageUrl} alt={unitName} className="w-full h-full object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}
