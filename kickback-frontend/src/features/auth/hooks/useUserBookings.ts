// src/features/auth/hooks/useUserBookings.ts
import { useQuery } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";

export interface UserBookingSummary {
  bookingId: string;
  cafeName: string;
  cafeSlug: string;
  resourceName: string;
  dateLabel: string;
  startMinutes: number;
  durationMinutes: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "EXPIRED" | "NO_SHOW";
  totalAmount: number;
}

// TEMPORARY: fixed mock list, replace with GET /users/me/bookings.
// Written now (ahead of the real My Bookings page build in Phase 3) so
// that page can be built directly against this hook from the start.
const MOCK_USER_BOOKINGS: UserBookingSummary[] = [
  {
    bookingId: "KB-20260722-0847",
    cafeName: "Respawn Lounge",
    cafeSlug: "respawn-lounge",
    resourceName: "PS5 - Unit 1",
    dateLabel: "Today, 22 Jul",
    startMinutes: 14 * 60,
    durationMinutes: 60,
    status: "CONFIRMED",
    totalAmount: 126,
  },
];

export function useUserBookings() {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => mockDelay(MOCK_USER_BOOKINGS),
  });
}
