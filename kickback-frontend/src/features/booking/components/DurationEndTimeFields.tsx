// src/features/booking/components/DurationEndTimeFields.tsx
import { formatDuration, formatMinutesAsTime } from "@/lib/dateTime";
import { useBookingDraftStore, useBookingEndMinutes } from "../store/useBookingDraftStore";

export default function DurationEndTimeFields() {
  const durationMinutes = useBookingDraftStore((s) => s.durationMinutes);
  const adjustDuration = useBookingDraftStore((s) => s.adjustDuration);
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

      {/* End time is read-only display for now — always derived from
          start + duration, so it can never disagree with the fields above.
          A future pass can make this tappable to edit end time directly,
          which would call setEndMinutes() to recompute duration instead. */}
      <div className="flex-1 bg-bg-surface border border-border-subtle rounded-card p-3">
        <div className="text-xs text-text-secondary mb-1.5">End time</div>
        <div className="font-display font-semibold text-[20px] text-text-primary tabular-nums">
          {formatMinutesAsTime(endMinutes)}
        </div>
        <div className="text-[10px] text-text-secondary mt-0.5">Auto-updates</div>
      </div>
    </div>
  );
}
