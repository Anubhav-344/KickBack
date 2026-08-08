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

export default function ResourceUnitCard({ unit }: ResourceUnitCardProps) {
  const navigate = useNavigate();
  const { cafeSlug } = useParams();

  // BOOKED here just means "in use right now" — since real availability
  // depends on the time range picked on the next page, we still let the
  // user proceed (they might want a later slot). Only maintenance/out-of-
  // service units are truly unselectable at this stage.
  const isSelectable = unit.status !== "OUT_OF_SERVICE" && unit.status !== "MAINTENANCE";

  return (
    <div className="relative bg-bg-surface border border-border-subtle rounded-card overflow-hidden">
      <button
        onClick={() =>
          isSelectable &&
          navigate(`/cafes/${cafeSlug}/resources/${unit.resourceId}/book`)
        }
        disabled={!isSelectable}
        className={`w-full text-left transition-transform ${
          isSelectable ? "active:scale-[0.97]" : "opacity-60 cursor-not-allowed"
        }`}
      >
        <div className="h-[74px] bg-gradient-to-br from-bg-raised to-bg-surface overflow-hidden">
          {unit.imageUrl && (
            <img
              src={unit.imageUrl}
              alt={unit.resourceName}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-2.5">
          <div className="font-display font-semibold text-[15px] text-text-primary">
            {unit.resourceName}
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5 tabular-nums">
            &#8377;{unit.hourlyRate}/hr
          </div>
          <div
            className={`inline-block mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLES[unit.status]}`}
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

      {/* Sibling to the button above, not nested inside it — two overlapping
          interactive elements are fine as long as they aren't nested in the DOM */}
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
          {unit.brand && (
            <InfoRow label="Brand" value={unit.brand} />
          )}
          {unit.maxPlayers && (
            <InfoRow label="Players" value={`Up to ${unit.maxPlayers}`} />
          )}
          {unit.games && unit.games.length > 0 && (
            <InfoRow label="Games" value={unit.games.join(", ")} />
          )}
          {unit.description && (
            <InfoRow label="Specs" value={unit.description} />
          )}
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
