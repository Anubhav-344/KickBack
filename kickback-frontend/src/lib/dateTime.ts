// src/lib/dateTime.ts

/**
 * All booking-page time state is stored internally as "minutes since
 * midnight" (an integer, e.g. 14:00 = 840). This makes duration math
 * (start + duration = end) trivial addition instead of juggling Date
 * objects, and makes overnight-closing cafés (e.g. close at 2 AM) work
 * naturally — closing time is just a number > 1440.
 */

export interface TimeParts {
  hour12: number; // 1-12
  minute: number; // 0-59
  isPM: boolean;
}

export function minutesToParts(totalMinutes: number): TimeParts {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(m / 60);
  const minute = m % 60;
  const isPM = hour24 >= 12;
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, minute, isPM };
}

export function partsToMinutes(hour12: number, minute: number, isPM: boolean): number {
  let hour24 = hour12 % 12;
  if (isPM) hour24 += 12;
  return hour24 * 60 + minute;
}

export function formatMinutesAsTime(totalMinutes: number): string {
  const { hour12, minute, isPM } = minutesToParts(totalMinutes);
  return `${hour12}:${String(minute).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(target, today)) return "Today";
  if (isSameDay(target, tomorrow)) return "Tomorrow";

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${MONTHS[m - 1]}`;
}

// Combines an ISO date with minutes-since-midnight into the full ISO
// LocalDateTime string the backend expects (e.g. "2026-07-22T14:00:00").
// Uses real Date arithmetic (not string math) so totalMinutes >= 1440
// correctly rolls over to the next calendar date for overnight bookings.
export function toISODateTime(dateISO: string, totalMinutes: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const base = new Date(y, m - 1, d, 0, 0, 0);
  base.setMinutes(base.getMinutes() + totalMinutes);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}T${pad(base.getHours())}:${pad(base.getMinutes())}:00`;
}

// Snaps a duration to the nearest valid 15-minute increment, minimum 15 min.
export function snapDurationToStep(minutes: number, stepMinutes = 15): number {
  const snapped = Math.round(minutes / stepMinutes) * stepMinutes;
  return Math.max(stepMinutes, snapped);
}

/** Minutes since midnight for the given moment (default: now), in the user's local time. */
export function nowMinutes(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Rounds up to the next multiple of the step (30 -> 30, 31 -> 35 for a 5-minute step). */
export function ceilToStep(minutes: number, stepMinutes = 5): number {
  return Math.ceil(minutes / stepMinutes) * stepMinutes;
}

/**
 * Where "Start time" should begin when the booking page opens for today:
 * the current time rounded up to the next 5 minutes (so the slot is still in
 * the future by the time someone taps Book), but never before the café opens.
 */
export function defaultStartMinutes(now: number, openingMinutes: number): number {
  return Math.min(Math.max(ceilToStep(now), openingMinutes), 1439);
}
