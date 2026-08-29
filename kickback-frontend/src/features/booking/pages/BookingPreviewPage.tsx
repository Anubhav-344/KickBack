// src/features/booking/pages/BookingPreviewPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HoldCountdown from "../components/HoldCountdown";
import BookingSummaryCard from "../components/BookingSummaryCard";
import PriceBreakdownCard from "../components/PriceBreakdownCard";
import OfferSelector from "@/features/offers/components/OfferSelector";
import PaymentMethodPicker from "@/features/payment/components/PaymentMethodPicker";
import type { PaymentMethod } from "@/features/payment/types";
import type { Offer } from "@/features/cafe/types";
import { computeOfferDiscount, TAX_RATE } from "@/lib/offers";
import toast from "react-hot-toast";

// TEMPORARY mock — replace with useBookingDetails(bookingId), which returns
// the PENDING booking created when "Book" was pressed on the previous page,
// including its real hold_expires_at from the server.
const MOCK_BOOKING = {
  cafeName: "Respawn Lounge",
  resourceName: "PS5 - Unit 1",
  game: "FIFA 24",
  dateLabel: "Today, 22 Jul",
  startMinutes: 14 * 60,
  durationMinutes: 60,
  hourlyRate: 150,
};

const MOCK_OFFERS: Offer[] = [
  {
    offerId: 1,
    title: "Weekday happy hour",
    promoCode: "HAPPY20",
    offerType: "PERCENTAGE_DISCOUNT",
    discountType: "PERCENTAGE",
    discountValue: 20,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    isActive: true,
  },
  {
    offerId: 2,
    title: "Squad session",
    promoCode: "SQUAD100",
    offerType: "FLAT_DISCOUNT",
    discountType: "FIXED",
    discountValue: 100,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    isActive: true,
  },
];

export default function BookingPreviewPage() {
  const navigate = useNavigate();
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

  // Placeholder hold expiry: 10 minutes from page load. Real version reads
  // this from the server's bookings.hold_expires_at, not a client timer.
  const [holdExpiresAt] = useState(() => Date.now() + 10 * 60 * 1000);

  const endMinutes = MOCK_BOOKING.startMinutes + MOCK_BOOKING.durationMinutes;
  const subtotal = Math.round((MOCK_BOOKING.hourlyRate / 60) * MOCK_BOOKING.durationMinutes);
  const discount = appliedOffer ? computeOfferDiscount(appliedOffer, subtotal) : 0;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const total = subtotal - discount + tax;

  const handleApplyCode = () => {
    const match = MOCK_OFFERS.find(
      (o) => o.promoCode?.toLowerCase() === promoInput.trim().toLowerCase()
    );
    if (match) {
      setAppliedOffer(match);
      toast.success(`${match.promoCode} applied`);
    } else {
      toast.error("Invalid or expired code");
    }
  };

  const handleExpire = () => {
    toast.error("Your hold expired — please rebook");
    navigate(-1);
  };

  const handlePay = () => {
    // Next: useInitiatePayment() -> Razorpay checkout -> on success,
    // update booking to CONFIRMED and navigate to a confirmation screen.
    toast.success("Redirecting to payment...");
  };

  return (
    <PageShell>
      <Header />

      <div className="flex items-center gap-2.5 px-4 pt-3.5">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} className="text-text-secondary" />
        </button>
        <h1 className="font-display font-semibold text-xl text-text-primary">
          Booking Preview
        </h1>
      </div>

      <HoldCountdown expiresAt={holdExpiresAt} onExpire={handleExpire} />

      <div className="px-4 py-4 border-b border-border-subtle">
        <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
          Summary
        </div>
        <BookingSummaryCard
          cafeName={MOCK_BOOKING.cafeName}
          resourceName={MOCK_BOOKING.resourceName}
          game={MOCK_BOOKING.game}
          dateLabel={MOCK_BOOKING.dateLabel}
          startMinutes={MOCK_BOOKING.startMinutes}
          endMinutes={endMinutes}
          durationMinutes={MOCK_BOOKING.durationMinutes}
        />
      </div>

      <div className="px-4 py-4 border-b border-border-subtle">
        <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
          Offer
        </div>

        {appliedOffer && (
          <div className="flex items-center justify-between bg-state-available/10 border border-state-available/30 rounded-lg px-3.5 py-2.5 mb-2.5">
            <span className="text-xs font-medium text-state-available">
              {appliedOffer.promoCode} applied &mdash; {appliedOffer.discountValue}
              {appliedOffer.discountType === "PERCENTAGE" ? "%" : "\u20B9"} off
            </span>
            <button
              onClick={() => setAppliedOffer(null)}
              className="text-[11px] text-text-secondary"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-2.5">
          <input
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 bg-bg-surface border border-border-subtle rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary"
          />
          <button
            onClick={handleApplyCode}
            className="bg-bg-raised border border-border-subtle rounded-lg px-4 text-sm font-semibold text-text-primary"
          >
            Apply
          </button>
        </div>

        <OfferSelector
          offers={MOCK_OFFERS}
          onSelect={(offer) => setAppliedOffer(offer)}
          trigger={
            <button className="text-xs font-medium text-accent-hover">
              Select from available offers &#8250;
            </button>
          }
        />
      </div>

      <div className="px-4 py-4 border-b border-border-subtle">
        <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
          Price details
        </div>
        <PriceBreakdownCard
          subtotal={subtotal}
          discount={discount}
          discountLabel={appliedOffer?.promoCode}
          tax={tax}
          total={total}
        />
      </div>

      <div className="px-4 py-4">
        <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
          Pay using
        </div>
        <PaymentMethodPicker selected={paymentMethod} onSelect={setPaymentMethod} />
      </div>

      <div className="px-4 py-4">
        <button
          onClick={handlePay}
          className="w-full bg-accent text-bg-base font-semibold text-[15px] py-3.5 rounded-card shadow-accent-glow"
        >
          Pay &#8377;{total}
        </button>
      </div>

      <Footer cafeName={MOCK_BOOKING.cafeName} locationLabel="Bhopal" />
    </PageShell>
  );
}
