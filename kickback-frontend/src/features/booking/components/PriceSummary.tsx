// src/features/booking/components/PriceSummary.tsx
import Button from "@/components/ui/Button";
import { useBookingDraftStore } from "../store/useBookingDraftStore";

interface PriceSummaryProps {
  hourlyRate: number;
  /** Rupees per extra controller per hour (0 or missing = free). */
  extraControllerRate?: number;
  onBook: () => void;
}

export default function PriceSummary({ hourlyRate, extraControllerRate = 0, onBook }: PriceSummaryProps) {
  const durationMinutes = useBookingDraftStore((s) => s.durationMinutes);
  const extraControllers = useBookingDraftStore((s) => s.extraControllers);
  const extraCount = typeof extraControllers === "number" ? extraControllers : 0;
  const extrasTotal = Math.round((extraControllerRate / 60) * durationMinutes * extraCount);
  const estimatedTotal = Math.round((hourlyRate / 60) * durationMinutes) + extrasTotal;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <div className="flex items-center justify-between mb-3.5 lg:mb-5">
        <span className="text-xs lg:text-sm text-text-secondary">Estimated total</span>
        <span className="font-semibold text-[22px] lg:text-3xl text-text-primary tabular-nums">
          &#8377;{estimatedTotal}
        </span>
      </div>
      {extrasTotal > 0 && (
        <p className="text-xs text-text-secondary -mt-2 mb-3.5 lg:mb-5 text-right">
          Includes &#8377;{extrasTotal} for {extraCount} extra controller{extraCount > 1 ? "s" : ""}
        </p>
      )}
      <Button onClick={onBook} className="lg:py-4 lg:text-base">Book</Button>
    </div>
  );
}
