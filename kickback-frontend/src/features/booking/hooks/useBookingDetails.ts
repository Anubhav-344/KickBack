// src/features/booking/hooks/useBookingDetails.ts
import { useQuery } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";

export interface BookingDetails {
  bookingId: string;
  cafeName: string;
  cafeSlug: string;
  resourceName: string;
  game?: string | null;
  dateLabel: string;
  startMinutes: number;
  durationMinutes: number;
  hourlyRate: number;
  holdExpiresAt: number;
  status: "PENDING" | "CONFIRMED";
  paymentMethod?: string;
  transactionRef?: string;
  amountPaid?: number;
}

// TEMPORARY: returns a fixed mock booking regardless of bookingId, until a
// real backend persists actual bookings. Shape matches exactly what
// BookingPreviewPage and BookingConfirmationPage already render.
export function useBookingDetails(bookingId: string | undefined) {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () =>
      mockDelay<BookingDetails>({
        bookingId: bookingId ?? "KB-MOCK",
        cafeName: "Respawn Lounge",
        cafeSlug: "respawn-lounge",
        resourceName: "PS5 - Unit 1",
        game: "FIFA 24",
        dateLabel: "Today, 22 Jul",
        startMinutes: 14 * 60,
        durationMinutes: 60,
        hourlyRate: 150,
        holdExpiresAt: Date.now() + 10 * 60 * 1000,
        status: "PENDING",
      }),
    enabled: !!bookingId,
  });
}
