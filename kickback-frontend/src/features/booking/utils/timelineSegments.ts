// src/features/booking/utils/timelineSegments.ts
import type { ExistingBooking, TimelineSegment } from "../types";

/**
 * Builds the full ordered list of segments spanning the operating window,
 * filling any gap between bookings with "available", and carving out the
 * user's current selection as its own "selected" segment on top.
 */
export function computeTimelineSegments(
  openingMinutes: number,
  closingMinutes: number,
  bookings: ExistingBooking[],
  selectedStart: number,
  selectedEnd: number
): TimelineSegment[] {
  // Points where the segment type could change: window edges, every
  // booking's start/end, and the user's selection start/end.
  const boundaries = new Set<number>([openingMinutes, closingMinutes]);
  bookings.forEach((b) => {
    boundaries.add(clamp(b.startMinutes, openingMinutes, closingMinutes));
    boundaries.add(clamp(b.endMinutes, openingMinutes, closingMinutes));
  });
  boundaries.add(clamp(selectedStart, openingMinutes, closingMinutes));
  boundaries.add(clamp(selectedEnd, openingMinutes, closingMinutes));

  const sorted = Array.from(boundaries).sort((a, b) => a - b);
  const segments: TimelineSegment[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i];
    const end = sorted[i + 1];
    if (start === end) continue;

    const midpoint = (start + end) / 2;
    let type: TimelineSegment["type"] = "available";
    if (midpoint >= selectedStart && midpoint < selectedEnd) {
      type = "selected";
    } else if (bookings.some((b) => midpoint >= b.startMinutes && midpoint < b.endMinutes)) {
      type = "booked";
    }

    segments.push({ type, startMinutes: start, endMinutes: end });
  }

  return segments;
}

/**
 * Available windows for the "Show more details" sheet — computed from real
 * bookings only (the user's own tentative selection doesn't count as
 * "unavailable," since nothing is booked there yet).
 */
export function computeAvailableGaps(
  openingMinutes: number,
  closingMinutes: number,
  bookings: ExistingBooking[]
): { startMinutes: number; endMinutes: number }[] {
  const sortedBookings = [...bookings].sort((a, b) => a.startMinutes - b.startMinutes);
  const gaps: { startMinutes: number; endMinutes: number }[] = [];
  let cursor = openingMinutes;

  for (const booking of sortedBookings) {
    if (booking.startMinutes > cursor) {
      gaps.push({ startMinutes: cursor, endMinutes: booking.startMinutes });
    }
    cursor = Math.max(cursor, booking.endMinutes);
  }
  if (cursor < closingMinutes) {
    gaps.push({ startMinutes: cursor, endMinutes: closingMinutes });
  }

  return gaps.filter((g) => g.endMinutes > g.startMinutes);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
