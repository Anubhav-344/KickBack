// src/features/resources/components/ResourceTypePopover.tsx
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
import type { ReactNode } from "react";
import Popover from "@/components/ui/Popover";
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

interface ResourceTypePopoverProps {
  resourceTypes: ResourceTypeSummary[];
  currentResourceTypeId: number;
  trigger: ReactNode;
}

// Desktop-only anchored popover counterpart to the mobile bottom sheet
// (BookResourceTypeModal), for the SWITCHER specifically — a small menu that
// drops right below the trigger, with the rest of the page staying visible.
// This intentionally does NOT replace the floating "Book now" button's
// picker, which is a different kind of interaction (starting a fresh
// selection, not switching an existing one) and keeps the sheet/modal.
export default function ResourceTypePopover({
  resourceTypes,
  currentResourceTypeId,
  trigger,
}: ResourceTypePopoverProps) {
  const navigate = useNavigate();
  const { cafeSlug } = useParams();

  return (
    <Popover trigger={trigger} label="Choose a resource type" panelClassName="w-full p-1.5">
      {(close) =>
        resourceTypes.map((rt) => {
          const Icon = getIcon(rt.resourceName);
          const isActive = rt.resourceTypeId === currentResourceTypeId;
          return (
            <button
              key={rt.resourceTypeId}
              type="button"
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                close();
                navigate(`/cafes/${cafeSlug}/resource-types/${rt.resourceTypeId}`);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left hover:bg-bg-surface transition-colors ${
                isActive ? "bg-bg-surface" : ""
              }`}
            >
              <span className="w-8 h-8 rounded-lg bg-bg-surface flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-text-primary" />
              </span>
              <span className="font-medium text-sm text-text-primary">{rt.resourceName}</span>
            </button>
          );
        })
      }
    </Popover>
  );
}