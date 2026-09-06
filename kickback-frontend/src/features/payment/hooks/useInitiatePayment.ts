// src/features/payment/hooks/useInitiatePayment.ts
import { useMutation } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";
import type { PaymentMethod } from "../types";

interface InitiatePaymentInput {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
}

interface PaymentResult {
  transactionRef: string;
  status: "SUCCESS";
}

// TEMPORARY: simulates a successful payment after a short delay. The real
// version opens the Razorpay checkout SDK here instead of resolving
// directly — the success/failure shape callers handle stays the same
// either way, so BookingPreviewPage's onSuccess/onError logic won't change.
export function useInitiatePayment() {
  return useMutation({
    mutationFn: (input: InitiatePaymentInput) =>
      mockDelay<PaymentResult>(
        { transactionRef: `TXN${Date.now()}`, status: "SUCCESS" },
        800
      ),
  });
}
