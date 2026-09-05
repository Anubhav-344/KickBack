// src/features/booking/components/AvailabilityTimeline.tsx
import { useRef } from "react";
import { CalendarDays } from "lucide-react";
import type { ExistingBooking, OperatingWindow } from "../types";
import { computeTimelineSegments, computeAvailableGaps } from "../utils/timelineSegments";
import { useBookingDraftStore, useBookingEndMinutes } from "../store/useBookingDraftStore";
import { formatDateLabel, todayISO } from "@/lib/dateTime";
import AvailableSlotsSheet from "./AvailableSlotsSheet";

const SEGMENT_COLOR: Record<string, string> = {
  booked: "bg-state-booked",
  available: "bg-state-available/50 animate-pulse-available",
  selected: "bg-accent shadow-accent-glow",
};

interface AvailabilityTimelineProps {
  unitName: string;
  operatingWindow: OperatingWindow;
  bookings: ExistingBooking[];
}

export default function AvailabilityTimeline({
  unitName,
  operatingWindow,
  bookings,
}: AvailabilityTimelineProps) {
  const startMinutes = useBookingDraftStore((s) => s.startMinutes);
  const endMinutes = useBookingEndMinutes();
  const selectedDate = useBookingDraftStore((s) => s.selectedDate);
  const setSelectedDate = useBookingDraftStore((s) => s.setSelectedDate);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    // showPicker() is the reliable way to open the native calendar from
    // anywhere on our custom-styled pill — without it, browsers (especially
    // desktop) only open the picker when the user clicks the input's own
    // built-in icon, not the surrounding area.
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  const dateLabel = formatDateLabel(selectedDate);

  const { openingMinutes, closingMinutes } = operatingWindow;
  const totalSpan = closingMinutes - openingMinutes;

  const segments = operatingWindow.isClosedToday
    ? []
    : computeTimelineSegments(openingMinutes, closingMinutes, bookings, startMinutes, endMinutes);
  const gaps = operatingWindow.isClosedToday
    ? []
    : computeAvailableGaps(openingMinutes, closingMinutes, bookings);

  const tickCount = operatingWindow.isClosedToday ? 0 : Math.floor(totalSpan / 120) + 1;
  const ticks = Array.from({ length: tickCount }, (_, i) => openingMinutes + i * 120);

  return (
    <section className="px-4 py-4 border-b border-border-subtle">
      <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
        Availability
      </div>

      {/* Full-width date selector. The styled pill below is purely visual;
          a real (invisible) <input type="date"> sits on top of it and
          captures the tap, opening the browser/OS's native calendar —
          genuinely "a standard calendar" rather than a custom-built one. */}
      <div className="relative w-full mb-3">
        <button
          type="button"
          onClick={openDatePicker}
          className="w-full flex items-center justify-between bg-bg-surface border border-border-subtle rounded-card px-3.5 py-3 active:scale-[0.98] transition-transform"
        >
          <span className="text-sm font-medium text-text-primary">{dateLabel}</span>
          <CalendarDays size={16} className="text-text-secondary" />
        </button>
        <input
          ref={dateInputRef}
          type="date"
          value={selectedDate}
          min={todayISO()}
          onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
          aria-label="Choose booking date"
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
          tabIndex={-1}
        />
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-card p-3.5">
        {operatingWindow.isClosedToday ? (
          <div className="text-sm text-text-secondary text-center py-2">
            Closed on this date
          </div>
        ) : (
          <>
            <AvailableSlotsSheet
              unitName={unitName}
              dateLabel={dateLabel}
              gaps={gaps}
              trigger={
                <div className="flex h-[26px] rounded-md overflow-hidden gap-px cursor-pointer">
                  {segments.map((seg, i) => (
                    <div
                      key={i}
                      className={SEGMENT_COLOR[seg.type]}
                      style={{ flex: seg.endMinutes - seg.startMinutes }}
                    />
                  ))}
                </div>
              }
            />

            <div className="flex justify-between text-[10px] text-text-secondary mt-1.5 tabular-nums">
              {ticks.map((t) => (
                <span key={t}>{formatTickLabel(t)}</span>
              ))}
            </div>

            <div className="flex gap-3.5 mt-3">
              <Legend color="bg-state-booked" label="Booked" />
              <Legend color="bg-state-available/50" label="Available" />
              <Legend color="bg-accent" label="Your slot" />
            </div>

            <AvailableSlotsSheet
              unitName={unitName}
              dateLabel={dateLabel}
              gaps={gaps}
              trigger={
                <button className="block ml-auto mt-2.5 text-[11px] font-medium text-accent-hover">
                  Show more details &#8250;
                </button>
              }
            />
          </>
        )}
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
      <span className={`w-2 h-2 rounded-sm ${color}`} />
      {label}
    </div>
  );
}

function formatTickLabel(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(m / 60);
  const isPM = hour24 >= 12;
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12} ${isPM ? "PM" : "AM"}`;
}
