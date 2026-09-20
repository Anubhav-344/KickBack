// src/features/auth/hooks/useUserBookings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  hasReview?: boolean; // only meaningful for COMPLETED bookings
}

// STILL MOCKED — BookingSummaryResponse exists as a DTO, but there's no
// controller serving it. UserController only exposes GET/PATCH /api/users/me;
// there's no /api/users/me/bookings (or /api/bookings list) endpoint yet.
let MOCK_USER_BOOKINGS: UserBookingSummary[] = [
  {
    bookingId: 1001,
    cafeName: "Respawn Lounge",
    cafeSlug: "respawn-lounge",
    resourceName: "PS5 - Unit 1",
    startTimestamp: "2026-07-24T14:00:00",
    endTimestamp: "2026-07-24T15:00:00",
    durationMinutes: 60,
    status: "CONFIRMED",
    totalAmount: 126,
  },
  {
    bookingId: 998,
    cafeName: "Pixel Arena",
    cafeSlug: "pixel-arena",
    resourceName: "Racing Sim - Rig 1",
    startTimestamp: "2026-07-15T18:00:00",
    endTimestamp: "2026-07-15T19:30:00",
    durationMinutes: 90,
    status: "COMPLETED",
    totalAmount: 330,
    hasReview: false,
  },
  {
    bookingId: 991,
    cafeName: "Respawn Lounge",
    cafeSlug: "respawn-lounge",
    resourceName: "VR - Unit 1",
    startTimestamp: "2026-07-10T16:00:00",
    endTimestamp: "2026-07-10T17:00:00",
    durationMinutes: 60,
    status: "CANCELLED",
    totalAmount: 200,
  },
];

export function useUserBookings() {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => mockDelay(MOCK_USER_BOOKINGS, 400),
  });
}

// Called by useCreateReview on success — mutates the same in-memory mock
// array so the "Leave a review" prompt disappears immediately after
// submitting, without needing a real backend round-trip.
export function markBookingAsReviewed(bookingId: number) {
  MOCK_USER_BOOKINGS = MOCK_USER_BOOKINGS.map((b) =>
    b.bookingId === bookingId ? { ...b, hasReview: true } : b
  );
}

// STILL MOCKED — the real PATCH /bookings/{id}/cancel endpoint DOES exist
// on the backend (BookingController), but wiring it here would mean
// calling it with fake mock bookingIds, which would just 404. This mutates
// the same in-memory mock array so the UI behaves correctly for now; swap
// mutationFn for the real PATCH call once bookings are genuinely created
// via the (currently unsafe) POST /bookings endpoint.
export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: number) => {
      MOCK_USER_BOOKINGS = MOCK_USER_BOOKINGS.map((b) =>
        b.bookingId === bookingId ? { ...b, status: "CANCELLED" as const } : b
      );
      return mockDelay(undefined, 400);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
    },
  });
}
