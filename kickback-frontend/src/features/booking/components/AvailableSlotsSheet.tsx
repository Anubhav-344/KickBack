// src/features/booking/components/AvailableSlotsSheet.tsx
import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { formatMinutesAsTime } from "@/lib/dateTime";
import { useBookingDraftStore } from "../store/useBookingDraftStore";

interface AvailableSlotsSheetProps {
  unitName: string;
  dateLabel: string;
  gaps: { startMinutes: number; endMinutes: number }[];
  trigger: ReactNode;
}

export default function AvailableSlotsSheet({
  unitName,
  dateLabel,
  gaps,
  trigger,
}: AvailableSlotsSheetProps) {
  const setStartMinutes = useBookingDraftStore((s) => s.setStartMinutes);
  const setEndMinutes = useBookingDraftStore((s) => s.setEndMinutes);

  return (
    <BottomSheet trigger={trigger} title="Available slots">
      <div className="text-xs text-text-secondary -mt-2 mb-3.5">
        {unitName} &middot; {dateLabel}
      </div>

      <div className="flex flex-col gap-2">
        {gaps.length === 0 && (
          <div className="text-sm text-text-secondary py-2">
            No availability left today.
          </div>
        )}
        {gaps.map((gap) => (
          <Dialog.Close asChild key={`${gap.startMinutes}-${gap.endMinutes}`}>
            <button
              onClick={() => {
                // Tapping a listed window jumps the selection there directly —
                // sets a 1hr default (or the full gap if shorter) as a
                // reasonable starting point; user can still fine-tune after.
                const duration = Math.min(60, gap.endMinutes - gap.startMinutes);
                setStartMinutes(gap.startMinutes);
                setEndMinutes(gap.startMinutes + duration);
              }}
              className="flex items-center gap-2.5 bg-bg-raised border border-border-subtle rounded-lg px-3.5 py-3 text-left active:scale-[0.98] transition-transform"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-state-available/70 flex-shrink-0" />
              <span className="text-[13px] text-text-primary tabular-nums">
                {formatMinutesAsTime(gap.startMinutes)} to{" "}
                {formatMinutesAsTime(gap.endMinutes)} &mdash; Available
              </span>
            </button>
          </Dialog.Close>
        ))}
      </div>
    </BottomSheet>
  );
}
