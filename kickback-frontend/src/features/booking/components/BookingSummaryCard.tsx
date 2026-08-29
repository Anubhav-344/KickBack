// src/features/booking/components/BookingSummaryCard.tsx
import { formatMinutesAsTime, formatDuration } from "@/lib/dateTime";

interface BookingSummaryCardProps {
  cafeName: string;
  resourceName: string;
  game?: string | null;
  dateLabel: string;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
}

export default function BookingSummaryCard({
  cafeName,
  resourceName,
  game,
  dateLabel,
  startMinutes,
  endMinutes,
  durationMinutes,
}: BookingSummaryCardProps) {
  const rows: [string, string][] = [
    ["Caf\u00E9", cafeName],
    ["Resource", resourceName],
    ...(game ? ([["Game", game]] as [string, string][]) : []),
    ["Date", dateLabel],
    ["Time", `${formatMinutesAsTime(startMinutes)} \u2013 ${formatMinutesAsTime(endMinutes)}`],
    ["Duration", formatDuration(durationMinutes)],
  ];

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-3.5">
      {rows.map(([key, value], i) => (
        <div
          key={key}
          className={`flex items-center justify-between py-1.5 ${
            i !== rows.length - 1 ? "border-b border-border-subtle" : ""
          }`}
        >
          <span className="text-xs text-text-secondary">{key}</span>
          <span className="text-[13px] font-medium text-text-primary text-right tabular-nums">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
