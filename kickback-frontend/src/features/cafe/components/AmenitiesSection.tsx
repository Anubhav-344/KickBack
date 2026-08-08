// src/features/cafe/components/AmenitiesSection.tsx
import { Wifi, Utensils, Snowflake, Car, type LucideIcon } from "lucide-react";
import type { Amenity } from "../types";

const ICON_MAP: Record<string, LucideIcon> = {
  wifi: Wifi,
  snacks: Utensils,
  ac: Snowflake,
  parking: Car,
};

interface AmenitiesSectionProps {
  amenities: Amenity[];
}

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  if (amenities.length === 0) return null;

  return (
    <section className="px-4 py-4 border-b border-border-subtle">
      <h2 className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
        Amenities
      </h2>
      <div className="flex flex-wrap gap-2">
        {amenities.map((a) => {
          const Icon = ICON_MAP[a.iconName.toLowerCase()];
          return (
            <div
              key={a.amenityId}
              className="flex items-center gap-1.5 text-xs text-text-secondary border border-border-subtle rounded-full px-3 py-1.5"
            >
              {Icon && <Icon size={12} />}
              {a.amenityName}
            </div>
          );
        })}
      </div>
    </section>
  );
}
