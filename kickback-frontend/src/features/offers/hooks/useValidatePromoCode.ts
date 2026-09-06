// src/features/offers/hooks/useValidatePromoCode.ts
import { useMutation } from "@tanstack/react-query";
import { mockDelay } from "@/lib/mockDelay";
import { getCafeBySlug } from "@/mocks/cafes";
import type { Offer } from "@/features/cafe/types";

// TEMPORARY: real version is a server-side check (also validates
// min_booking_minutes, valid_from/to, applicable_days against the actual
// booking — see earlier design notes on re-validating offers server-side
// at both apply-time AND payment-time, not just client-side).
export function useValidatePromoCode(cafeSlug: string | undefined) {
  return useMutation({
    mutationFn: (code: string): Promise<Offer | null> => {
      const cafe = cafeSlug ? getCafeBySlug(cafeSlug) : undefined;
      const match = cafe?.offers.find(
        (o) => o.promoCode?.toLowerCase() === code.trim().toLowerCase()
      );
      return mockDelay(match ?? null, 300);
    },
  });
}
