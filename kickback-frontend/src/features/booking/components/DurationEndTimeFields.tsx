// src/features/booking/components/DurationEndTimeFields.tsx
import { formatDuration, formatMinutesAsTime } from "@/lib/dateTime";
import { useBookingDraftStore, useBookingEndMinutes } from "../store/useBookingDraftStore";
import EndTimeEditSheet from "./EndTimeEditSheet";

export default function DurationEndTimeFields() {
  const durationMinutes = useBookingDraftStore((s) => s.durationMinutes);
  const adjustDuration = useBookingDraftStore((s) => s.adjustDuration);
  const setEndMinutes = useBookingDraftStore((s) => s.setEndMinutes);
  const endMinutes = useBookingEndMinutes();

  return (
    <div className="flex gap-2.5">
      <div className="flex-1 bg-bg-surface border border-border-subtle rounded-card p-3">
        <div className="text-xs text-text-secondary mb-1.5">Duration</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => adjustDuration(-15)}
            className="w-[26px] h-[26px] rounded-md bg-bg-raised flex items-center justify-center text-sm font-semibold text-text-primary"
          >
            &minus;
          </button>
          <span className="font-display font-semibold text-[15px] text-text-primary tabular-nums">
            {formatDuration(durationMinutes)}
          </span>
          <button
            onClick={() => adjustDuration(15)}
            className="w-[26px] h-[26px] rounded-md bg-bg-raised flex items-center justify-center text-sm font-semibold text-text-primary"
          >
            +
          </button>
        </div>
      </div>

      {/* Tapping this opens a picker to set End Time directly — confirming
          calls setEndMinutes(), which recomputes Duration from the gap to
          Start Time (snapped to a valid 15-min step). Editing Duration via
          the stepper on the left still works exactly as before; these are
          just two different ways to land on the same end result. */}
      <EndTimeEditSheet
        currentEndMinutes={endMinutes}
        onConfirm={setEndMinutes}
        trigger={
          <button className="flex-1 bg-bg-surface border border-border-subtle rounded-card p-3 text-left">
            <div className="text-xs text-text-secondary mb-1.5">End time</div>
            <div className="font-display font-semibold text-[20px] text-text-primary tabular-nums">
              {formatMinutesAsTime(endMinutes)}
            </div>
            <div className="text-[10px] text-accent-hover mt-0.5">Tap to edit</div>
          </button>
        }
      />
    </div>
  );
}
