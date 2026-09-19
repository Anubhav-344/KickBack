// src/features/booking/hooks/useAvailability.ts
import { useQuery } from "@tanstack/react-query";
import { resourceApi } from "@/features/resources/api";

// LIVE — GET /api/resources/{resourceId}/availability?date=YYYY-MM-DD
//
// cafeSlug is deliberately NOT a parameter: the backend keys availability on
// resourceId alone. `date` is in the query key, so changing the date picker
// on the booking page now genuinely refetches that day's data.
export function useAvailability(resourceId: number | undefined, date: string) {
  return useQuery({
    queryKey: ["availability", resourceId, date],
    queryFn: () => resourceApi.getAvailability(resourceId!, date),
    enabled: !!resourceId && !!date,
  });
}
