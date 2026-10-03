// src/features/resources/components/ResourceTypeGrid.tsx
import { useNavigate, useParams } from "react-router-dom";
import {
  Gamepad2,
  Monitor,
  Glasses,
  Gauge,
  CircleDot,
  Triangle,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";
import type { ResourceTypeSummary } from "@/features/cafe/types";

const ICON_MAP: Record<string, LucideIcon> = {
  ps5: Gamepad2,
  pc: Monitor,
  vr: Glasses,
  "racing sim": Gauge,
  "8 ball pool": CircleDot,
  snooker: Triangle,
  "private room (ps5)": DoorOpen,
};

function getIcon(resourceName: string): LucideIcon {
  return ICON_MAP[resourceName.toLowerCase()] ?? Gamepad2;
}

interface ResourceTypeGridProps {
  resourceTypes: ResourceTypeSummary[];
}

export default function ResourceTypeGrid({ resourceTypes }: ResourceTypeGridProps) {
  const navigate = useNavigate();
  const { cafeSlug } = useParams();

  return (
    <section className="px-4 lg:px-8 py-4 border-b border-border-subtle">
      <h2 className="text-xs lg:text-sm uppercase tracking-wide text-text-secondary mb-2.5 lg:mb-3.5">
        Choose a resource type
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {resourceTypes.map((rt) => {
          const Icon = getIcon(rt.resourceName);
          const isWide = rt.resourceName.toLowerCase().includes("private room");

          return (
            <button
              key={rt.resourceTypeId}
              onClick={() =>
                navigate(`/cafes/${cafeSlug}/resource-types/${rt.resourceTypeId}`)
              }
              className={`text-left bg-bg-surface border border-border-subtle rounded-card p-3 lg:p-5 hover:border-accent/40 active:scale-[0.97] transition ${
                isWide ? "col-span-2" : ""
              }`}
            >
              <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-lg bg-bg-raised flex items-center justify-center mb-2.5 lg:mb-3.5">
                <Icon size={18} className="text-text-primary lg:w-[22px] lg:h-[22px]" />
              </div>
              <div className="font-display font-semibold text-base lg:text-xl text-text-primary">
                {rt.resourceName}
              </div>
              <div className="text-xs lg:text-sm text-text-secondary mt-0.5 tabular-nums">
                From &#8377;{rt.startingHourlyRate}/hr
              </div>
              <div className="inline-flex items-center gap-1 mt-2 lg:mt-3 text-[11px] lg:text-xs font-medium px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full bg-bg-raised border border-border-subtle text-text-secondary">
                {rt.totalUnits} {rt.totalUnits === 1 ? "unit" : "units"}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
