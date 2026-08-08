// src/features/booking/components/PriceSummary.tsx
import { useBookingDraftStore } from "../store/useBookingDraftStore";

interface PriceSummaryProps {
  hourlyRate: number;
  onBook: () => void;
}

export default function PriceSummary({ hourlyRate, onBook }: PriceSummaryProps) {
  const durationMinutes = useBookingDraftStore((s) => s.durationMinutes);
  const estimatedTotal = Math.round((hourlyRate / 60) * durationMinutes);

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-xs text-text-secondary">Estimated total</span>
        <span className="font-semibold text-[22px] text-text-primary tabular-nums">
          &#8377;{estimatedTotal}
        </span>
      </div>
      <button
        onClick={onBook}
        className="w-full bg-accent text-bg-base font-semibold text-[15px] py-3.5 rounded-card shadow-accent-glow"
      >
        Book
      </button>
    </div>
  );
}
