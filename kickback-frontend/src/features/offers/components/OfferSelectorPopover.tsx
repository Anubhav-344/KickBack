// src/features/offers/components/OfferSelectorPopover.tsx
import type { ReactNode } from "react";
import Popover from "@/components/ui/Popover";
import { formatOfferSummary } from "@/lib/offers";
import type { Offer } from "@/features/cafe/types";

interface OfferSelectorPopoverProps {
  offers: Offer[];
  trigger: ReactNode;
  onSelect: (offer: Offer) => void;
}

// Desktop-only anchored popover counterpart to OfferSelector's mobile bottom sheet.
export default function OfferSelectorPopover({
  offers,
  trigger,
  onSelect,
}: OfferSelectorPopoverProps) {
  return (
    <Popover
      trigger={trigger}
      label="Available offers"
      className="inline-block"
      panelClassName="w-80 p-1.5"
    >
      {(close) =>
        offers.map((offer) => (
          <button
            key={offer.offerId}
            type="button"
            onClick={() => {
              close();
              onSelect(offer);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-bg-surface transition-colors"
          >
            <span>
              <span className="block text-sm font-medium text-text-primary">{offer.title}</span>
              <span className="block text-xs text-text-secondary mt-0.5">
                {formatOfferSummary(offer)}
              </span>
            </span>
            {offer.promoCode && (
              <span className="text-xs font-medium text-accent-text bg-accent/15 rounded-md px-2 py-1 flex-shrink-0 ml-2">
                {offer.promoCode}
              </span>
            )}
          </button>
        ))
      }
    </Popover>
  );
}
