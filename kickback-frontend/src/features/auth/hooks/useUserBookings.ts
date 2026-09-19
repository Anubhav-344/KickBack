// src/features/auth/hooks/useUserBookings.ts
import { useQuery } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";

// Mirrors the backend's BookingSummaryResponse DTO, so this becomes a
// straight swap once the endpoint exists.
export interface UserBookingSummary {
  bookingId: number;
  cafeName: string;
  cafeSlug: string;
  resourceName: string;
  startTimestamp: string; // ISO LocalDateTime
  endTimestamp: string;
  durationMinutes: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "EXPIRED" | "NO_SHOW";
  totalAmount: number;
}

// STILL MOCKED — BookingSummaryResponse exists as a DTO, but there's no
// controller serving it. UserController only exposes GET/PATCH /api/users/me;
// there's no /api/users/me/bookings (or /api/bookings) endpoint yet.
const MOCK_USER_BOOKINGS: UserBookingSummary[] = [
  {
    bookingId: 1001,
    cafeName: "Respawn Lounge",
    cafeSlug: "respawn-lounge",
    resourceName: "PS5 - Unit 1",
    startTimestamp: "2026-07-22T14:00:00",
    endTimestamp: "2026-07-22T15:00:00",
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
