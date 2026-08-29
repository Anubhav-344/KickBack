// src/lib/offers.ts
import type { Offer } from "@/features/cafe/types";

export function formatOfferSummary(offer: Offer): string {
  if (offer.offerType === "EXTRA_TIME") return `+${offer.bonusMinutes} min free`;
  if (offer.discountType === "PERCENTAGE") return `${offer.discountValue}% off`;
  return `\u20B9${offer.discountValue} off`;
}

/** Returns the discount amount in rupees for a given subtotal. EXTRA_TIME
 *  offers don't reduce price (they add bonus minutes instead), so they
 *  return 0 here — handle bonus minutes separately where relevant. */
export function computeOfferDiscount(offer: Offer, subtotal: number): number {
  if (offer.offerType === "EXTRA_TIME") return 0;
  if (offer.discountType === "PERCENTAGE" && offer.discountValue) {
    return Math.round((subtotal * offer.discountValue) / 100);
  }
  if (offer.discountType === "FIXED" && offer.discountValue) {
    return Math.min(offer.discountValue, subtotal); // never discount below zero
  }
  return 0;
}

export const TAX_RATE = 0.05; // placeholder GST-style rate — confirm real rate before launch
