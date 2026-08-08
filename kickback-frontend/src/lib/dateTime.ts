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

// Snaps a duration to the nearest valid 15-minute increment, minimum 15 min.
export function snapDurationToStep(minutes: number, stepMinutes = 15): number {
  const snapped = Math.round(minutes / stepMinutes) * stepMinutes;
  return Math.max(stepMinutes, snapped);
}
