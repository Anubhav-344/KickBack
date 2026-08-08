// src/features/cafe/components/OfferSlider.tsx
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Offer } from "../types";

interface OfferSliderProps {
  offers: Offer[];
}

function formatOfferSub(offer: Offer): string {
  if (offer.offerType === "EXTRA_TIME") return `+${offer.bonusMinutes} min free`;
  if (offer.discountType === "PERCENTAGE") return `${offer.discountValue}% off`;
  return `\u20B9${offer.discountValue} off`;
}

export default function OfferSlider({ offers }: OfferSliderProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (offers.length === 0) return null;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = (el.firstElementChild as HTMLElement)?.offsetWidth ?? 1;
    setActiveIndex(Math.round(el.scrollLeft / slideWidth));
  };

  return (
    <section className="px-4 py-4 border-b border-border-subtle">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs uppercase tracking-wide text-text-secondary">
          Offers
        </h2>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-accent-hover"
        >
          View all
          <ChevronDown
            size={11}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {!expanded && (
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory -mx-4 [&::-webkit-scrollbar]:hidden"
          >
            {offers.map((offer) => (
              // Each slide is exactly the scroll container's full width, placed
              // back-to-back with zero gap — this is what prevents any sliver
              // of the next card from peeking in. Centering/spacing for the
              // actual card comes from this wrapper's own padding, not from a
              // flex gap (a gap smaller than the padding is what caused the
              // peek in the first place).
              <div key={offer.offerId} className="snap-start shrink-0 w-full px-4">
                <OfferCard offer={offer} compact={false} />
              </div>
            ))}
          </div>

          {offers.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2.5">
              {offers.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? "w-3.5 bg-accent" : "w-1.5 bg-border-subtle"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {expanded && (
        <div className="flex flex-col gap-2">
          {offers.map((offer) => (
            <OfferCard key={offer.offerId} offer={offer} compact />
          ))}
        </div>
      )}
    </section>
  );
}

function OfferCard({ offer, compact }: { offer: Offer; compact: boolean }) {
  return (
    <div
      className={`bg-bg-surface border border-border-subtle flex items-center justify-between ${
        compact ? "rounded-lg px-3 py-2.5" : "rounded-card px-3.5 py-3"
      }`}
    >
      <div>
        <div className={`font-medium text-text-primary ${compact ? "text-[13px]" : "text-sm"}`}>
          {offer.title}
        </div>
        <div className={`text-text-secondary mt-0.5 ${compact ? "text-[11px]" : "text-xs"}`}>
          {formatOfferSub(offer)}
        </div>
      </div>
      {offer.promoCode && (
        <div className="text-xs font-medium text-accent-hover bg-accent/15 rounded-md px-2 py-1 flex-shrink-0 ml-2">
          {offer.promoCode}
        </div>
      )}
    </div>
  );
}
