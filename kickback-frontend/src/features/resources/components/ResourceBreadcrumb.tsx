// src/features/resources/components/ResourceBreadcrumb.tsx
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Gamepad2,
  Monitor,
  Glasses,
  Gauge,
  CircleDot,
  Triangle,
  DoorOpen,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import BookResourceTypeModal from "./BookResourceTypeModal";
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

interface ResourceBreadcrumbProps {
  cafeName: string;
  currentResourceType: ResourceTypeSummary;
  allResourceTypes: ResourceTypeSummary[];
}

export default function ResourceBreadcrumb({
  cafeName,
  currentResourceType,
  allResourceTypes,
}: ResourceBreadcrumbProps) {
  const navigate = useNavigate();
  const { cafeSlug } = useParams();
  const Icon = getIcon(currentResourceType.resourceName);

  return (
    <div className="px-4 pt-3.5">
      <div className="flex items-center gap-2.5">
        <button onClick={() => navigate(`/cafes/${cafeSlug}`)} aria-label="Back to café">
          <ArrowLeft size={18} className="text-text-secondary" />
        </button>
        <span className="text-[17px] font-medium text-text-primary/65">
          {cafeName}
        </span>
      </div>

      {/* Tapping this opens the same resource-type list as the Book button —
          lets the user switch types without navigating back to the landing page. */}
      <BookResourceTypeModal
        resourceTypes={allResourceTypes}
        trigger={
          <button className="flex items-center justify-between w-full mt-3 bg-bg-surface border border-border-subtle rounded-card px-3.5 py-3 active:scale-[0.98] transition-transform">
            <span className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-bg-raised flex items-center justify-center">
                <Icon size={15} className="text-text-primary" />
              </span>
              <span className="font-display font-semibold text-[19px] text-text-primary">
                {currentResourceType.resourceName}
              </span>
            </span>
            <ChevronDown size={16} className="text-text-secondary" />
          </button>
        }
      />
    </div>
  );
}
