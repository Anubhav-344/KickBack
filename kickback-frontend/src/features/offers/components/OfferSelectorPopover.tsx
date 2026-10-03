// src/features/offers/components/OfferSelectorPopover.tsx
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { formatOfferSummary } from "@/lib/offers";
import type { Offer } from "@/features/cafe/types";

interface OfferSelectorPopoverProps {
  offers: Offer[];
  trigger: ReactNode;
  onSelect: (offer: Offer) => void;
}

// Desktop-only anchored popover counterpart to OfferSelector's mobile
// bottom sheet — same pattern as ResourceTypePopover/GameFilterPopover.
export default function OfferSelectorPopover({
  offers,
  trigger,
  onSelect,
}: OfferSelectorPopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (offer: Offer) => {
    setOpen(false);
    onSelect(offer);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-bg-raised border border-border-subtle rounded-card p-1.5 shadow-lg z-20">
          {offers.map((offer) => (
            <button
              key={offer.offerId}
              onClick={() => handleSelect(offer)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-bg-surface transition-colors"
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
                <span className="text-xs font-medium text-accent-hover bg-accent/15 rounded-md px-2 py-1 flex-shrink-0 ml-2">
                  {offer.promoCode}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}