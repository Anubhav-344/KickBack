// src/features/booking/components/StartTimeInput.tsx
import { useId } from "react";
import { minutesToParts, partsToMinutes } from "@/lib/dateTime";
import { useBookingDraftStore } from "../store/useBookingDraftStore";
import { AmPmToggle, TimeStepperBlock } from "./TimeControls";

export default function StartTimeInput() {
  const startMinutes = useBookingDraftStore((s) => s.startMinutes);
  const setStartMinutes = useBookingDraftStore((s) => s.setStartMinutes);
  const labelId = useId();

  const { hour12, minute, isPM } = minutesToParts(startMinutes);

  const adjustHour = (delta: number) => {
    let next = hour12 + delta;
    if (next > 12) next = 1;
    if (next < 1) next = 12;
    setStartMinutes(partsToMinutes(next, minute, isPM));
  };

  // Minute deliberately increments by 1, not 15 — start time can be
  // arbitrary (e.g. 12:40) to accommodate offline/walk-in bookings that
  // don't land on a clean grid. Only DURATION is locked to 15-min steps.
  const adjustMinute = (delta: number) => {
    let next = minute + delta;
    if (next > 59) next = 0;
    if (next < 0) next = 59;
    setStartMinutes(partsToMinutes(hour12, next, isPM));
  };

  const setHour = (n: number) => setStartMinutes(partsToMinutes(n, minute, isPM));
  const setMinute = (n: number) => setStartMinutes(partsToMinutes(hour12, n, isPM));

  const setAmPm = (pm: boolean) => {
    setStartMinutes(partsToMinutes(hour12, minute, pm));
  };

  return (
    <div role="group" aria-labelledby={labelId} className="mb-4">
      <div id={labelId} className="text-xs text-text-secondary mb-1.5">
        Start time
      </div>
      <div className="flex gap-2">
        <TimeStepperBlock
          label="HOUR"
          spokenLabel="hour"
          value={String(hour12).padStart(2, "0")}
          onDecrement={() => adjustHour(-1)}
          onIncrement={() => adjustHour(1)}
          onSet={setHour}
          min={1}
          max={12}
        />
        <TimeStepperBlock
          label="MIN"
          spokenLabel="minute"
          value={String(minute).padStart(2, "0")}
          onDecrement={() => adjustMinute(-1)}
          onIncrement={() => adjustMinute(1)}
          onSet={setMinute}
          min={0}
          max={59}
        />
        <AmPmToggle isPM={isPM} onChange={setAmPm} />
      </div>
    </div>
  );
}