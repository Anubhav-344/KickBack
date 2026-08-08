// src/features/resources/components/BookResourceTypeModal.tsx
import * as Dialog from "@radix-ui/react-dialog";
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
import BottomSheet from "@/components/ui/BottomSheet";
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

interface BookResourceTypeModalProps {
  resourceTypes: ResourceTypeSummary[];
  trigger: ReactNode;
}

export default function BookResourceTypeModal({
  resourceTypes,
  trigger,
}: BookResourceTypeModalProps) {
  const navigate = useNavigate();
  const { cafeSlug } = useParams();

  return (
    <BottomSheet trigger={trigger} title="Choose resource">
      <div className="flex flex-col gap-2 mb-3.5">
        {resourceTypes.map((rt) => {
          const Icon = getIcon(rt.resourceName);
          return (
            <Dialog.Close asChild key={rt.resourceTypeId}>
              <button
                onClick={() =>
                  navigate(`/cafes/${cafeSlug}/resource-types/${rt.resourceTypeId}`)
                }
                className="flex items-center gap-3 bg-bg-raised border border-border-subtle rounded-card px-3.5 py-3 text-left active:scale-[0.98] transition-transform"
              >
                <span className="w-9 h-9 rounded-lg bg-accent/12 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-text-primary" />
                </span>
                <span className="flex-1">
                  <span className="block font-display font-semibold text-[15px] text-text-primary">
                    {rt.resourceName}
                  </span>
                  <span className="block text-[11px] text-text-secondary mt-0.5 tabular-nums">
                    From &#8377;{rt.startingHourlyRate}/hr &middot; {rt.totalUnits}{" "}
                    {rt.totalUnits === 1 ? "unit" : "units"}
                  </span>
                </span>
                <span className="text-text-secondary text-lg">&#8250;</span>
              </button>
            </Dialog.Close>
          );
        })}
      </div>

      <Dialog.Close asChild>
        <button className="w-full bg-bg-surface border border-border-subtle text-text-secondary text-sm font-medium py-3 rounded-card">
          Cancel
        </button>
      </Dialog.Close>
    </BottomSheet>
  );
}
