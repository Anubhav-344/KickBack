// src/features/offers/hooks/useValidateOffer.ts
import { useMutation } from "@tanstack/react-query";
import { offerApi, type ValidateOfferInput } from "../api";

// LIVE — POST /api/offers/validate. This is the server-authoritative check
// (min booking length, valid dates/days, time windows) — the client-side
// promo-code lookup that precedes this call is convenience only, to find
// the offerId this endpoint requires; it's never a substitute for this
// server response.
export function useValidateOffer() {
  return useMutation({
    mutationFn: (input: ValidateOfferInput) => offerApi.validate(input),
  });
}
