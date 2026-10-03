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
import ResourceTypePopover from "./ResourceTypePopover";
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

  // Same visual trigger button used by both — only the thing that opens
  // when you click it differs between mobile and desktop below.
  const triggerButton = (
    <button className="flex items-center justify-between w-full mt-3 lg:mt-5 bg-bg-surface border border-border-subtle rounded-card px-3.5 lg:px-5 py-3 lg:py-4 hover:border-accent/40 active:scale-[0.98] transition lg:max-w-md">
      <span className="flex items-center gap-2.5">
        <span className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-bg-raised flex items-center justify-center">
          <Icon size={15} className="text-text-primary lg:w-[18px] lg:h-[18px]" />
        </span>
        <span className="font-display font-semibold text-[19px] lg:text-xl text-text-primary">
          {currentResourceType.resourceName}
        </span>
      </span>
      <ChevronDown size={16} className="text-text-secondary" />
    </button>
  );

  return (
    <div className="px-4 lg:px-8 pt-3.5 lg:pt-6">
      <div className="flex items-center gap-2.5">
        <button onClick={() => navigate(`/cafes/${cafeSlug}`)} aria-label="Back to café">
          <ArrowLeft size={18} className="text-text-secondary lg:w-5 lg:h-5" />
        </button>
        <span className="text-[17px] lg:text-xl font-medium text-text-primary/65">
          {cafeName}
        </span>
      </div>

      {/* Mobile/tablet: full bottom sheet, unchanged — still the right
          pattern for touch (bigger tap targets, thumb-friendly). */}
      <div className="lg:hidden">
        <BookResourceTypeModal
          resourceTypes={allResourceTypes}
          trigger={triggerButton}
        />
      </div>

      {/* Desktop: small anchored popover instead — lighter weight for a
          mouse-driven "switch between a few options" interaction, doesn't
          dim the rest of the page. */}
      <div className="hidden lg:block lg:max-w-md">
        <ResourceTypePopover
          resourceTypes={allResourceTypes}
          currentResourceTypeId={currentResourceType.resourceTypeId}
          trigger={triggerButton}
        />
      </div>
    </div>
  );
}