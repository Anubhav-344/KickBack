// src/lib/cafeStatus.ts
import { formatMinutesAsTime } from "./dateTime";

export interface DayOperatingWindow {
  openingMinutes: number;
  closingMinutes: number; // may exceed 1440 for overnight closing
  isClosedToday: boolean;
}

export interface CafeOpenStatus {
  isOpenNow: boolean;
  label: string; // "Open now" | "Opens at 5:00 PM" | "Closed today"
}

export function computeCafeOpenStatus(
  window: DayOperatingWindow,
  nowMinutes: number = getCurrentMinutes()
): CafeOpenStatus {
  if (window.isClosedToday) {
    return { isOpenNow: false, label: "Closed today" };
  }

  const { openingMinutes, closingMinutes } = window;

  if (nowMinutes >= openingMinutes && nowMinutes < closingMinutes) {
    return { isOpenNow: true, label: "Open now" };
  }

  if (nowMinutes < openingMinutes) {
    // Hasn't opened yet today — genuinely "opens soon/later today"
    return { isOpenNow: false, label: `Opens at ${formatMinutesAsTime(openingMinutes)}` };
  }

  // Already past closing for today, no more window left
  return { isOpenNow: false, label: "Closed today" };
}

function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}
