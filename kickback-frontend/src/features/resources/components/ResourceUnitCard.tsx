// src/features/resources/components/ResourceUnitCard.tsx
import { useNavigate, useParams } from "react-router-dom";
import BottomSheet from "@/components/ui/BottomSheet";
import type { ResourceUnit } from "../types";

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-state-available/15 text-state-available",
  BOOKED: "bg-state-booked/20 text-text-secondary",
  MAINTENANCE: "bg-state-booked/20 text-text-secondary",
  OUT_OF_SERVICE: "bg-state-error/15 text-state-error",
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Available",
  BOOKED: "In use",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Out of service",
};

interface ResourceUnitCardProps {
  unit: ResourceUnit;
}

// Full-width row card: image occupies the left half, details fill the
// right half — swapped from the old stacked (image-on-top) grid layout so
// the image reads larger and clearer on mobile widths.
export default function ResourceUnitCard({ unit }: ResourceUnitCardProps) {
  const navigate = useNavigate();
  const { cafeSlug } = useParams();

  const isSelectable = unit.status !== "OUT_OF_SERVICE" && unit.status !== "MAINTENANCE";

  return (
    <div className="relative bg-bg-surface border border-border-subtle rounded-card overflow-hidden">
      <button
        onClick={() =>
          isSelectable &&
          navigate(`/cafes/${cafeSlug}/resources/${unit.resourceId}/book`)
        }
        disabled={!isSelectable}
        className={`w-full flex items-stretch text-left transition-transform ${
          isSelectable ? "active:scale-[0.98]" : "opacity-60 cursor-not-allowed"
        }`}
      >
        <div className="w-1/2 min-h-[110px] flex-shrink-0 bg-gradient-to-br from-bg-raised to-bg-surface overflow-hidden">
          {unit.imageUrl && (
            <img
              src={unit.imageUrl}
              alt={unit.resourceName}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
          <div className="font-display font-semibold text-base text-text-primary truncate">
            {unit.resourceName}
          </div>
          <div className="text-xs text-text-secondary mt-0.5 tabular-nums">
            &#8377;{unit.hourlyRate}/hr
          </div>
          <div
            className={`inline-block mt-2 w-fit text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLES[unit.status]}`}
          >
            {STATUS_LABELS[unit.status]}
          </div>
          {unit.status !== "AVAILABLE" && unit.nextAvailableAt && (
            <div className="text-[10px] text-text-secondary mt-1 tabular-nums">
              Next free at {unit.nextAvailableAt}
            </div>
          )}
        </div>
      </button>

      <BottomSheet
        title={unit.resourceName}
        trigger={
          <button
            className="absolute top-2 right-2 w-[22px] h-[22px] rounded-md bg-black/45 backdrop-blur-sm flex items-center justify-center text-[11px] font-bold text-text-primary"
            aria-label={`View details for ${unit.resourceName}`}
          >
            i
          </button>
        }
      >
        <div className="flex flex-col gap-2.5 text-xs">
          {unit.brand && <InfoRow label="Brand" value={unit.brand} />}
          {unit.maxPlayers && <InfoRow label="Players" value={`Up to ${unit.maxPlayers}`} />}
          {unit.games && unit.games.length > 0 && (
            <InfoRow label="Games" value={unit.games.join(", ")} />
          )}
          {unit.description && <InfoRow label="Specs" value={unit.description} />}
        </div>
      </BottomSheet>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-text-primary font-medium">{label}: </span>
      <span className="text-text-secondary">{value}</span>
    </div>
  );
}
