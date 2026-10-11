// src/features/booking/hooks/useNowMinutes.ts
import { useEffect, useState } from "react";
import { nowMinutes } from "@/lib/dateTime";

/** The current time as minutes since midnight, refreshed every 30 seconds so the
 *  "time already passed" shading on the availability bar keeps up with the clock. */
export function useNowMinutes(): number {
  const [now, setNow] = useState(() => nowMinutes());

  useEffect(() => {
    const id = window.setInterval(() => setNow(nowMinutes()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}
