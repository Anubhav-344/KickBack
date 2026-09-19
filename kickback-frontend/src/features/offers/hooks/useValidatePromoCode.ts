// src/features/offers/hooks/useValidatePromoCode.ts
import { useMutation } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";
import type { Offer } from "@/features/cafe/types";

// STILL MOCKED — the backend has ValidateOfferRequest/OfferValidationResponse
// DTOs but no OfferController serving them. Matching against the café's
// already-loaded offers client-side in the meantime.
//
// Note the real endpoint does MORE than a code match: it validates
// min_booking_minutes, valid_from/to, applicable_days and time windows
// against the actual booking, and returns the computed discountAmount /
// subtotal / totalAmount. That server-side validation is the authoritative
// one — this client check is convenience only, never a substitute.
export function useValidatePromoCode(availableOffers: Offer[]) {
  return useMutation({
    mutationFn: (code: string): Promise<Offer | null> => {
      const match = availableOffers.find(
        (o) => o.promoCode?.toLowerCase() === code.trim().toLowerCase()
      );
      return mockDelay(match ?? null, 300);
    },
  });
}
