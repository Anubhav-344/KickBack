// src/features/resources/components/ResourceTypePopover.tsx
import { useEffect, useRef, useState } from "react";
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

interface ResourceTypePopoverProps {
  resourceTypes: ResourceTypeSummary[];
  currentResourceTypeId: number;
  trigger: React.ReactNode;
}

// Desktop-only alternative to the mobile bottom sheet (BookResourceTypeModal)
// for the SWITCHER specifically — a small anchored menu that drops right
// below the trigger button, with the rest of the page staying visible and
// interactive, closing on an outside click. This intentionally does NOT
// replace the floating "Book now" button's picker, which is a different
// kind of interaction (starting a fresh selection, not switching an
// existing one) and keeps using the sheet/modal even on desktop.
//
// Built with plain React state rather than a Radix Popover, since that's
// not already a dependency here and this doesn't need its full feature set
// (just open/close + click-outside).
export default function ResourceTypePopover({
  resourceTypes,
  currentResourceTypeId,
  trigger,
}: ResourceTypePopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { cafeSlug } = useParams();

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (resourceTypeId: number) => {
    setOpen(false);
    navigate(`/cafes/${cafeSlug}/resource-types/${resourceTypeId}`);
  };

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-bg-raised border border-border-subtle rounded-card p-1.5 shadow-lg z-20">
          {resourceTypes.map((rt) => {
            const Icon = getIcon(rt.resourceName);
            const isActive = rt.resourceTypeId === currentResourceTypeId;
            return (
              <button
                key={rt.resourceTypeId}
                onClick={() => handleSelect(rt.resourceTypeId)}
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
          })}
        </div>
      )}
    </div>
  );
}