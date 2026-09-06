// src/features/booking/hooks/useAvailability.ts
import { useQuery } from "@tanstack/react-query";
import { getCafeBySlug, getBookingsForResource } from "@/mocks/cafes";
import { mockDelay } from "@/lib/mockDelay";
import type { OperatingWindow, ExistingBooking } from "../types";

interface AvailabilityData {
  operatingWindow: OperatingWindow;
  bookings: ExistingBooking[];
}

// `date` is already part of the query key even though the mock data doesn't
// vary by date yet (everything represents "today") — this means switching
// dates on the booking page will correctly trigger a refetch the moment the
// backend actually returns different data per date, with zero hook changes.
export function useAvailability(
  cafeSlug: string | undefined,
  resourceId: number | undefined,
  date: string
) {
  return useQuery({
    queryKey: ["availability", cafeSlug, resourceId, date],
    queryFn: (): Promise<AvailabilityData> => {
      const cafe = cafeSlug ? getCafeBySlug(cafeSlug) : undefined;
      const bookings = resourceId ? getBookingsForResource(resourceId) : [];
      const operatingWindow: OperatingWindow = cafe?.operatingWindowToday ?? {
        openingMinutes: 0,
        closingMinutes: 0,
        isClosedToday: true,
      };
      return mockDelay({ operatingWindow, bookings });
    },
    enabled: !!cafeSlug && !!resourceId,
  });
}
