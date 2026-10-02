// src/features/booking/api.ts
import axiosClient from "@/app/axiosClient";

export interface CreateBookingPayload {
  resourceId: number;
  gameId: number | null;
  date: string; // yyyy-MM-dd
  startTimestamp: string; // ISO LocalDateTime
  endTimestamp: string;
  offerId?: number;
  promoCode?: string;
  notes?: string;
}

// Matches BookingResponse exactly — used for both the create-booking result
// and GET /bookings/{id} (confirmation page).
export interface BookingResponse {
  bookingId: number;
  cafeName: string;
  cafeSlug: string;
  resourceName: string;
  game?: string | null;
  startTimestamp: string;
  endTimestamp: string;
  durationMinutes: number;
  hourlyRate: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "EXPIRED" | "NO_SHOW";
  holdExpiresAt?: string;
  paymentMethod?: string;
  transactionRef?: string;
  amountPaid?: number;
}

// Matches BookingSummaryResponse — used for the My Bookings list.
export interface BookingSummary {
  bookingId: number;
  cafeName: string;
  cafeSlug: string;
  resourceName: string;
  startTimestamp: string;
  endTimestamp: string;
  durationMinutes: number;
  status: BookingResponse["status"];
  totalAmount: number;
  hasReview: boolean;
}

export interface CancelBookingResult {
  bookingId: number;
  status: BookingResponse["status"];
}

export const bookingApi = {
  // LIVE — POST /api/bookings. Can fail with 409 if the slot was taken
  // between the client's last availability check and this request —
  // axiosClient's interceptor already toasts that case.
  createBooking: (payload: CreateBookingPayload) =>
    axiosClient.post<BookingResponse>("/bookings", payload).then((res) => res.data),

  getBooking: (bookingId: number) =>
    axiosClient.get<BookingResponse>(`/bookings/${bookingId}`).then((res) => res.data),

  listMyBookings: () =>
    axiosClient.get<BookingSummary[]>("/bookings").then((res) => res.data),

  cancelBooking: (bookingId: number) =>
    axiosClient
      .patch<CancelBookingResult>(`/bookings/${bookingId}/cancel`)
      .then((res) => res.data),
};
