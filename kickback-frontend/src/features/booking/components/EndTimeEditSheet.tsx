// src/features/booking/components/EndTimeEditSheet.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";
import { minutesToParts, partsToMinutes } from "@/lib/dateTime";

interface EndTimeEditSheetProps {
  currentEndMinutes: number;
  onConfirm: (endMinutes: number) => void;
  trigger: ReactNode;
}

// Lets the user edit End Time directly instead of only adjusting Duration.
// Edits are local to this sheet until "Done" is pressed — onConfirm then
// calls the store's setEndMinutes(), which recomputes Duration from the
// gap to Start Time (snapped to a valid 15-min step). Nothing commits if
// the sheet is dismissed without confirming.
export default function EndTimeEditSheet({
  currentEndMinutes,
  onConfirm,
  trigger,
}: EndTimeEditSheetProps) {
  const [open, setOpen] = useState(false);
  const [draftMinutes, setDraftMinutes] = useState(currentEndMinutes);

  const { hour12, minute, isPM } = minutesToParts(draftMinutes);

  const adjustHour = (delta: number) => {
    let next = hour12 + delta;
    if (next > 12) next = 1;
    if (next < 1) next = 12;
    setDraftMinutes(partsToMinutes(next, minute, isPM));
  };

  const adjustMinute = (delta: number) => {
    let next = minute + delta;
    if (next > 59) next = 0;
    if (next < 0) next = 59;
    setDraftMinutes(partsToMinutes(hour12, next, isPM));
  };

  const setAmPm = (pm: boolean) => setDraftMinutes(partsToMinutes(hour12, minute, pm));

  const handleOpenChange = (next: boolean) => {
    if (next) setDraftMinutes(currentEndMinutes); // reset draft each time it opens
    setOpen(next);
  };

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange} title="Set end time" trigger={trigger}>
      <div className="flex gap-2 mb-5">
        <Stepper label="HOUR" value={String(hour12).padStart(2, "0")} onDecrement={() => adjustHour(-1)} onIncrement={() => adjustHour(1)} />
        <Stepper label="MIN" value={String(minute).padStart(2, "0")} onDecrement={() => adjustMinute(-1)} onIncrement={() => adjustMinute(1)} />
        <div className="flex-none w-16 bg-bg-surface border border-border-subtle rounded-card p-2.5 flex flex-col gap-1">
          <button
            onClick={() => setAmPm(false)}
            className={`text-center text-xs font-semibold py-1.5 rounded-md transition-colors ${
              !isPM ? "bg-accent text-bg-base" : "text-text-secondary"
            }`}
          >
            AM
          </button>
          <button
            onClick={() => setAmPm(true)}
            className={`text-center text-xs font-semibold py-1.5 rounded-md transition-colors ${
              isPM ? "bg-accent text-bg-base" : "text-text-secondary"
            }`}
          >
            PM
          </button>
        </div>
      </div>

      <Button
        onClick={() => {
          onConfirm(draftMinutes);
          setOpen(false);
        }}
      >
        Done
      </Button>
    </BottomSheet>
  );
}

function Stepper({
  label,
  value,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex-1 bg-bg-surface border border-border-subtle rounded-card p-2.5">
      <div className="text-[10px] text-text-secondary text-center mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <button
          onClick={onDecrement}
          className="w-[22px] h-[22px] rounded-md bg-bg-raised flex items-center justify-center text-xs font-semibold text-text-primary"
        >
          {"\u2212"}
        </button>
        <span className="font-semibold text-base text-text-primary tabular-nums">{value}</span>
        <button
          onClick={onIncrement}
          className="w-[22px] h-[22px] rounded-md bg-bg-raised flex items-center justify-center text-xs font-semibold text-text-primary"
        >
          +
        </button>
      </div>
    </div>
  );
}
