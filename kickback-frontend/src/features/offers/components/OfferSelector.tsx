// src/features/offers/components/OfferSelector.tsx
import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { formatOfferSummary } from "@/lib/offers";
import type { Offer } from "@/features/cafe/types";

interface OfferSelectorProps {
  offers: Offer[];
  trigger: ReactNode;
  onSelect: (offer: Offer) => void;
}

export default function OfferSelector({ offers, trigger, onSelect }: OfferSelectorProps) {
  return (
    <BottomSheet trigger={trigger} title="Available offers">
      <div className="flex flex-col gap-2">
        {offers.map((offer) => (
          <Dialog.Close asChild key={offer.offerId}>
            <button
              onClick={() => onSelect(offer)}
              className="flex items-center justify-between bg-bg-raised border border-border-subtle rounded-card px-3.5 py-3 text-left"
            >
              <span>
                <span className="block text-sm font-medium text-text-primary">
                  {offer.title}
                </span>
                <span className="block text-xs text-text-secondary mt-0.5">
                  {formatOfferSummary(offer)}
                </span>
              </span>
              {offer.promoCode && (
                <span className="text-xs font-medium text-accent-hover bg-accent/15 rounded-md px-2 py-1">
                  {offer.promoCode}
                </span>
              )}
            </button>
          </Dialog.Close>
        ))}
      </div>
    </BottomSheet>
  );
}
