// src/features/payment/hooks/useInitiatePayment.ts
import { useMutation } from "@tanstack/react-query";
import { paymentApi } from "../api";
import type { PaymentMethod } from "../types";

interface CompletePaymentInput {
  bookingId: number;
  amount: number;
  method: PaymentMethod;
}

// LIVE — real two-step flow: POST /payments creates a PENDING payment with
// a server-generated transaction reference, then PATCH /payments/{id}/confirm
// marks it SUCCESS and flips the booking to CONFIRMED.
//
// In production, a real gateway (Razorpay, etc.) would sit between these two
// calls — the user leaves to pay, the gateway redirects back with its own
// transaction reference, and only THEN do we call confirm. Since there's no
// real gateway wired in yet, we call confirm immediately using the
// reference the create step already gave us, simulating instant success.
export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (input: CompletePaymentInput) => {
      const created = await paymentApi.createPayment(input);
      return paymentApi.confirmPayment(created.paymentId, created.transactionReference);
    },
  });
}
