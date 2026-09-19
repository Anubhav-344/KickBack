// src/features/booking/pages/BookingPreviewPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
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
import type { ValidateOfferResult } from "@/features/offers/api";
import { useBookingDetails } from "../hooks/useBookingDetails";
import { useCafeDetails } from "@/features/cafe/hooks/useCafeDetails";
import { useValidateOffer } from "@/features/offers/hooks/useValidateOffer";
import { toISODateTime } from "@/lib/dateTime";

export default function BookingPreviewPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const { data: booking, isLoading: bookingLoading } = useBookingDetails(bookingId);
  // LIVE — feeds the offer list (cafe.offers) for the "select from
  // available offers" sheet, plus the numeric cafeId the validate
  // endpoint requires.
  const { data: cafe } = useCafeDetails(booking?.cafeSlug);

  const [appliedResult, setAppliedResult] = useState<ValidateOfferResult | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

  const validateOffer = useValidateOffer();

  // STILL MOCKED — see useCreateHold's comment; the actual hold_expires_at
  // will come from the server response of POST /bookings once that's safe
  // to rely on.
  const [holdExpiresAt] = useState(() => booking?.holdExpiresAt ?? Date.now() + 10 * 60 * 1000);

  if (bookingLoading || !booking) {
    return (
      <PageShell>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-text-secondary">Loading...</p>
        </div>
        <Footer />
      </PageShell>
    );
  }

  const endMinutes = booking.startMinutes + booking.durationMinutes;
  const subtotal = Math.round((booking.hourlyRate / 60) * booking.durationMinutes);

  // Once an offer is validated server-side, its numbers are authoritative —
  // we display exactly what the backend computed rather than re-deriving
  // discount/tax client-side (which is why PriceBreakdownCard's "tax" line
  // here is back-derived from finalAmount, since /offers/validate doesn't
  // return a separate tax figure).
  const discount = appliedResult?.discountAmount ?? 0;
  const total = appliedResult?.valid ? appliedResult.finalAmount : subtotal;
  const tax = Math.max(0, total - subtotal + discount);

  const runValidation = (offer: Offer) => {
    if (!cafe) return;
    validateOffer.mutate(
      {
        offerId: offer.offerId,
        promoCode: offer.promoCode,
        cafeId: cafe.cafeId,
        date: booking.date,
        startTimestamp: toISODateTime(booking.date, booking.startMinutes),
        endTimestamp: toISODateTime(booking.date, endMinutes),
        bookingAmount: subtotal,
      },
      {
        onSuccess: (result) => {
          if (result.valid) {
            setAppliedResult(result);
            toast.success(`${result.promoCode ?? result.title} applied`);
          } else {
            toast.error(result.message ?? "This offer isn't valid for this booking");
          }
        },
        onError: () => toast.error("Couldn't validate offer. Please try again."),
      }
    );
  };

  const handleApplyCode = () => {
    const match = cafe?.offers.find(
      (o) => o.promoCode?.toLowerCase() === promoInput.trim().toLowerCase()
    );
    if (!match) {
      toast.error("Invalid or expired code");
      return;
    }
    runValidation(match);
  };

  const handleExpire = () => {
    toast.error("Your hold expired — please rebook");
    navigate(-1);
  };

  const handlePay = () => {
    // STILL MOCKED — real version calls useInitiatePayment() (POST
    // /payments then PATCH /payments/{id}/confirm), which requires a real
    // bookingId from a real POST /bookings call. Wiring this now against a
    // fake bookingId would just 404 against the real endpoint, so this
    // stays a placeholder until booking creation itself is safe to use.
    toast.success("Payment successful!");
    navigate(`/bookings/${booking.bookingId}/confirmation`);
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
          cafeName={booking.cafeName}
          resourceName={booking.resourceName}
          game={booking.game}
          dateLabel={booking.dateLabel}
          startMinutes={booking.startMinutes}
          endMinutes={endMinutes}
          durationMinutes={booking.durationMinutes}
        />
      </div>

      <div className="px-4 py-4 border-b border-border-subtle">
        <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
          Offer
        </div>

        {appliedResult?.valid && (
          <div className="flex items-center justify-between bg-state-available/10 border border-state-available/30 rounded-lg px-3.5 py-2.5 mb-2.5">
            <span className="text-xs font-medium text-state-available">
              {appliedResult.promoCode ?? appliedResult.title} applied
            </span>
            <button
              onClick={() => setAppliedResult(null)}
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
            disabled={validateOffer.isPending}
            className="bg-bg-raised border border-border-subtle rounded-lg px-4 text-sm font-semibold text-text-primary disabled:opacity-60"
          >
            {validateOffer.isPending ? "..." : "Apply"}
          </button>
        </div>

        {cafe && cafe.offers.length > 0 && (
          <OfferSelector
            offers={cafe.offers}
            onSelect={runValidation}
            trigger={
              <button className="text-xs font-medium text-accent-hover">
                Select from available offers &#8250;
              </button>
            }
          />
        )}
      </div>

      <div className="px-4 py-4 border-b border-border-subtle">
        <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
          Price details
        </div>
        <PriceBreakdownCard
          subtotal={subtotal}
          discount={discount}
          discountLabel={appliedResult?.promoCode ?? undefined}
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

      <Footer cafeName={booking.cafeName} locationLabel="Bhopal" />
    </PageShell>
  );
}
