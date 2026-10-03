// src/features/resources/components/BookResourceTypeDesktopModal.tsx
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
  X,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
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

interface BookResourceTypeDesktopModalProps {
  resourceTypes: ResourceTypeSummary[];
  trigger: ReactNode;
}

// Desktop-only counterpart to BookResourceTypeModal's mobile bottom sheet.
// Unlike the other three pickers (which became small anchored popovers),
// this one stays a centered modal — it's triggered by a fixed floating
// button with no natural anchor point to drop a popover from. What changes
// is the CONTENT: a proper grid of cards (matching ResourceTypeGrid's own
// style) sized for the space, instead of the same narrow vertical list
// used on mobile, which looked like a small island floating in a lot of
// dimmed empty space on a wide screen.
export default function BookResourceTypeDesktopModal({
  resourceTypes,
  trigger,
}: BookResourceTypeDesktopModalProps) {
  const navigate = useNavigate();
  const { cafeSlug } = useParams();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-bg-surface border border-border-subtle rounded-2xl p-8 z-50">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="font-display font-semibold text-2xl text-text-primary">
              Choose resource
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-bg-raised flex items-center justify-center text-text-secondary"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {resourceTypes.map((rt) => {
              const Icon = getIcon(rt.resourceName);
              return (
                <Dialog.Close asChild key={rt.resourceTypeId}>
                  <button
                    onClick={() =>
                      navigate(`/cafes/${cafeSlug}/resource-types/${rt.resourceTypeId}`)
                    }
                    className="text-left bg-bg-raised border border-border-subtle rounded-card p-5 hover:border-accent/40 active:scale-[0.98] transition"
                  >
                    <div className="w-11 h-11 rounded-lg bg-accent/12 flex items-center justify-center mb-3">
                      <Icon size={20} className="text-text-primary" />
                    </div>
                    <div className="font-display font-semibold text-lg text-text-primary">
                      {rt.resourceName}
                    </div>
                    <div className="text-sm text-text-secondary mt-1 tabular-nums">
                      From &#8377;{rt.startingHourlyRate}/hr &middot; {rt.totalUnits}{" "}
                      {rt.totalUnits === 1 ? "unit" : "units"}
                    </div>
                  </button>
                </Dialog.Close>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}