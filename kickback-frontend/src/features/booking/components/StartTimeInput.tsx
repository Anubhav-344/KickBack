// src/features/booking/components/StartTimeInput.tsx
import { minutesToParts, partsToMinutes } from "@/lib/dateTime";
import { useBookingDraftStore } from "../store/useBookingDraftStore";

export default function StartTimeInput() {
  const startMinutes = useBookingDraftStore((s) => s.startMinutes);
  const setStartMinutes = useBookingDraftStore((s) => s.setStartMinutes);

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

  const setAmPm = (pm: boolean) => {
    setStartMinutes(partsToMinutes(hour12, minute, pm));
  };

  return (
    <div className="mb-4">
      <div className="text-xs text-text-secondary mb-1.5">Start time</div>
      <div className="flex gap-2">
        <TimeStepperBlock label="HOUR" value={String(hour12).padStart(2, "0")} onDecrement={() => adjustHour(-1)} onIncrement={() => adjustHour(1)} />
        <TimeStepperBlock label="MIN" value={String(minute).padStart(2, "0")} onDecrement={() => adjustMinute(-1)} onIncrement={() => adjustMinute(1)} />

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
    </div>
  );
}

function TimeStepperBlock({
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
        <StepperButton onClick={onDecrement} symbol={"\u2212"} />
        <span className="font-semibold text-base text-text-primary tabular-nums">
          {value}
        </span>
        <StepperButton onClick={onIncrement} symbol="+" />
      </div>
    </div>
  );
}

function StepperButton({ onClick, symbol }: { onClick: () => void; symbol: string }) {
  return (
    <button
      onClick={onClick}
      className="w-[22px] h-[22px] rounded-md bg-bg-raised flex items-center justify-center text-xs font-semibold text-text-primary"
    >
      {symbol}
    </button>
  );
}
