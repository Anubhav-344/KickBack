// src/features/payment/api.ts
import axiosClient from "@/app/axiosClient";
import type { PaymentMethod } from "./types";

interface CreatePaymentPayload {
  bookingId: number;
  amount: number;
  method: PaymentMethod;
}

interface PaymentResponse {
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  transactionReference: string;
  paidAt?: string;
}

interface PaymentConfirmationResponse {
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentStatus: PaymentResponse["paymentStatus"];
  bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "EXPIRED" | "NO_SHOW";
  transactionReference: string;
}

export const paymentApi = {
  createPayment: (payload: CreatePaymentPayload) =>
    axiosClient.post<PaymentResponse>("/payments", payload).then((res) => res.data),

  confirmPayment: (paymentId: number, transactionReference: string) =>
    axiosClient
      .patch<PaymentConfirmationResponse>(`/payments/${paymentId}/confirm`, {
        transactionReference,
      })
      .then((res) => res.data),
};
