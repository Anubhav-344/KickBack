// src/features/offers/api.ts
import axiosClient from "@/app/axiosClient";

export interface ValidateOfferInput {
  offerId: number;
  promoCode?: string;
  cafeId: number;
  date: string; // yyyy-MM-dd
  startTimestamp: string; // ISO LocalDateTime
  endTimestamp: string;
  bookingAmount: number;
}

export interface ValidateOfferResult {
  valid: boolean;
  offerId: number;
  promoCode?: string;
  title: string;
  offerType: string;
  discountType?: string;
  discountValue?: number;
  bonusMinutes?: number;
  discountAmount: number;
  finalAmount: number;
  message?: string;
}

// LIVE — POST /api/offers/validate
export const offerApi = {
  validate: (input: ValidateOfferInput) =>
    axiosClient.post<ValidateOfferResult>("/offers/validate", input).then((res) => res.data),
};
