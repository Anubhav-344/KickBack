// src/features/booking/components/PriceSummary.tsx
import Button from "@/components/ui/Button";
import { useBookingDraftStore } from "../store/useBookingDraftStore";

interface PriceSummaryProps {
  hourlyRate: number;
  onBook: () => void;
}

export default function PriceSummary({ hourlyRate, onBook }: PriceSummaryProps) {
  const durationMinutes = useBookingDraftStore((s) => s.durationMinutes);
  const estimatedTotal = Math.round((hourlyRate / 60) * durationMinutes);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      <div className="flex items-center justify-between mb-3.5 lg:mb-5">
        <span className="text-xs lg:text-sm text-text-secondary">Estimated total</span>
        <span className="font-semibold text-[22px] lg:text-3xl text-text-primary tabular-nums">
          &#8377;{estimatedTotal}
        </span>
      </div>
      <Button onClick={onBook} className="lg:py-4 lg:text-base">Book</Button>
    </div>
  );
}
