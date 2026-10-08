// src/features/booking/pages/BookingPreviewPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BookingPreviewSkeleton } from "../components/BookingSkeletons";
import HoldCountdown from "../components/HoldCountdown";
import BookingSummaryCard from "../components/BookingSummaryCard";
import PriceBreakdownCard from "../components/PriceBreakdownCard";
import OfferSelector from "@/features/offers/components/OfferSelector";
import PaymentMethodPicker from "@/features/payment/components/PaymentMethodPicker";
import type { PaymentMethod } from "@/features/payment/types";
import type { Offer } from "@/features/cafe/types";
import { useBookingDetails } from "../hooks/useBookingDetails";
import { useCafeDetails } from "@/features/cafe/hooks/useCafeDetails";
import { useApplyBookingOffer } from "../hooks/useApplyBookingOffer";
import { useInitiatePayment } from "@/features/payment/hooks/useInitiatePayment";
import { formatDateLabel, formatMinutesAsTime } from "@/lib/dateTime";

interface FieldError {
  field?: string;
  defaultMessage?: string;
}
interface BackendErrorBody {
  detail?: string;
  message?: string;
  errors?: FieldError[];
}

function humanizeFieldError(field: string | undefined, message: string): string {
  const lower = message.toLowerCase();
  if ((field === "startTimestamp" || field === "endTimestamp") && lower.includes("future")) {
    return "That time has already passed. Please pick a later start time.";
  }
  if (field === "gameId") {
    return "Please choose a valid game for this resource.";
  }
  return message;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  const data = (error as { response?: { data?: BackendErrorBody } })?.response?.data;
  if (!data) return fallback;

  const fieldError = data.errors?.[0];
  if (fieldError?.defaultMessage) {
    return humanizeFieldError(fieldError.field, fieldError.defaultMessage);
  }
  if (data.detail) return data.detail;
  if (data.message && !data.message.startsWith("Validation failed for object=")) {
    return data.message;
  }
  return fallback;
}

function isAlreadyToastedGlobally(error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 401 || status === 409;
}

function minutesFromISO(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

export default function BookingPreviewPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const numericBookingId = bookingId ? Number(bookingId) : undefined;

  const { data: booking, isLoading: bookingLoading } = useBookingDetails(numericBookingId);
  // Only needed for the browsable offers list — the booking itself already
  // carries its own up-to-date pricing once an offer is applied.
  const { data: cafe } = useCafeDetails(booking?.cafeSlug);

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

  const applyOffer = useApplyBookingOffer();
  const initiatePayment = useInitiatePayment();

  if (bookingLoading || !booking) {
    return (
      <PageShell>
        <Header />
        <BookingPreviewSkeleton />
        <Footer />
      </PageShell>
    );
  }

  const startMinutes = minutesFromISO(booking.startTimestamp);
  const endMinutes = minutesFromISO(booking.endTimestamp);
  const dateLabel = formatDateLabel(booking.startTimestamp.slice(0, 10));
  const holdExpiresAtMs = booking.holdExpiresAt ? new Date(booking.holdExpiresAt).getTime() : null;

  const applyOfferToBooking = (offer: Offer | null) => {
    applyOffer.mutate(
      {
        bookingId: booking.bookingId,
        offerId: offer?.offerId ?? null,
        promoCode: offer?.promoCode ?? null,
      },
      {
        onSuccess: () => {
          if (offer) {
            setAppliedPromoCode(offer.promoCode ?? offer.title);
            toast.success(`${offer.promoCode ?? offer.title} applied`, { id: "offer-result" });
          } else {
            setAppliedPromoCode(null);
            toast.success("Offer removed", { id: "offer-result" });
          }
        },
        onError: (error) => {
          if (isAlreadyToastedGlobally(error)) return;
          toast.error(extractErrorMessage(error, "Couldn't apply this offer. Please try again."), {
            id: "offer-result",
          });
        },
      }
    );
  };

  const handleApplyCode = () => {
    const match = cafe?.offers.find(
      (o) => o.promoCode?.toLowerCase() === promoInput.trim().toLowerCase()
    );
    if (!match) {
      toast.error("Invalid or expired code", { id: "offer-result" });
      return;
    }
    applyOfferToBooking(match);
  };

  const handleExpire = () => {
    toast.error("Your hold expired — please rebook", { id: "hold-expired" });
    navigate(-1);
  };

  const handlePay = () => {
    if (initiatePayment.isPending) return;

    initiatePayment.mutate(
      {
        bookingId: booking.bookingId,
        amount: booking.totalAmount,
        method: paymentMethod,
      },
      {
        onSuccess: () => {
          toast.success("Payment successful!");
          navigate(`/bookings/${booking.bookingId}/confirmation`);
        },
        onError: (error) => {
          if (!isAlreadyToastedGlobally(error)) {
            toast.error(
              extractErrorMessage(error, "Payment failed. Please try again."),
              { id: "payment-error" }
            );
          }
        },
      }
    );
  };

  // Shared offer-section JSX — identical markup/handlers used in both the
  // mobile and desktop layouts below, just placed in different positions.
  const offerSection = (
    <>
      {appliedPromoCode && (
        <div className="flex items-center justify-between bg-state-available/10 border border-state-available/30 rounded-lg px-3.5 py-2.5 mb-2.5">
          <span className="text-xs font-medium text-state-available">
            {appliedPromoCode} applied
          </span>
          <button
            onClick={() => applyOfferToBooking(null)}
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
          aria-label="Promo code"
          placeholder="Enter promo code"
          className="flex-1 bg-bg-surface border border-border-strong rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary"
        />
        <button
          onClick={handleApplyCode}
          disabled={applyOffer.isPending}
          className="bg-bg-raised border border-border-subtle rounded-lg px-4 text-sm font-semibold text-text-primary disabled:opacity-60"
        >
          {applyOffer.isPending ? "Applying..." : "Apply"}
        </button>
      </div>

      {cafe && cafe.offers.length > 0 && (
        <OfferSelector
          offers={cafe.offers}
          onSelect={applyOfferToBooking}
          trigger={
            <button className="text-xs font-medium text-accent-text">
              Select from available offers &#8250;
            </button>
          }
        />
      )}
    </>
  );

  const priceAndPaySection = (
    <>
      <PriceBreakdownCard
        subtotal={booking.subtotal}
        discount={booking.discountAmount}
        discountLabel={appliedPromoCode ?? undefined}
        tax={booking.taxAmount}
        total={booking.totalAmount}
      />
      <div className="mt-5">
        <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
          Pay using
        </div>
        <PaymentMethodPicker selected={paymentMethod} onSelect={setPaymentMethod} />
      </div>
      <button
        onClick={handlePay}
        disabled={initiatePayment.isPending}
        className="w-full mt-5 lg:mt-7 bg-accent text-on-accent font-semibold text-[15px] lg:text-base py-3.5 lg:py-4 rounded-card shadow-accent-glow disabled:opacity-60"
      >
        {initiatePayment.isPending ? "Processing..." : `Pay \u20B9${booking.totalAmount}`}
      </button>
    </>
  );

  return (
    <PageShell title="Checkout">
      <Header />

      {/* ============== MOBILE / TABLET (below lg): unchanged single column ============== */}
      <div className="lg:hidden">
        <div className="flex items-center gap-2.5 px-4 pt-3.5">
          <button onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={18} className="text-text-secondary" />
          </button>
          <h1 className="font-display font-semibold text-xl text-text-primary">
            Booking Preview
          </h1>
        </div>

        {holdExpiresAtMs && (
          <div className="mx-4 mt-3.5">
            <HoldCountdown expiresAt={holdExpiresAtMs} onExpire={handleExpire} />
          </div>
        )}

        <div className="px-4 py-4 border-b border-border-subtle">
          <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
            Summary
          </div>
          <BookingSummaryCard
            cafeName={booking.cafeName}
            resourceName={booking.resourceName}
            game={booking.game}
            dateLabel={dateLabel}
            startMinutes={startMinutes}
            endMinutes={endMinutes}
            durationMinutes={booking.durationMinutes}
          />
        </div>

        <div className="px-4 py-4 border-b border-border-subtle">
          <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
            Offer
          </div>
          {offerSection}
        </div>

        <div className="px-4 py-4 border-b border-border-subtle">
          <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
            Price details
          </div>
          <PriceBreakdownCard
            subtotal={booking.subtotal}
            discount={booking.discountAmount}
            discountLabel={appliedPromoCode ?? undefined}
            tax={booking.taxAmount}
            total={booking.totalAmount}
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
            disabled={initiatePayment.isPending}
            className="w-full bg-accent text-on-accent font-semibold text-[15px] py-3.5 rounded-card shadow-accent-glow disabled:opacity-60"
          >
            {initiatePayment.isPending ? "Processing..." : `Pay \u20B9${booking.totalAmount}`}
          </button>
        </div>
      </div>

      {/* ============== DESKTOP (lg+): two-column checkout ==============
          Left: scrollable booking details + offer selection — flex-1 with
          NO max-width, so it genuinely absorbs all available space instead
          of being capped and centered with leftover margin.
          Right: fixed, wider sticky sidebar with the hold countdown, price
          breakdown, and payment — stays visible without scrolling. */}
      <div className="hidden lg:flex gap-12 px-10 xl:px-16 py-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-12">
            <button onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft size={22} className="text-text-secondary" />
            </button>
            <h1 className="font-display font-semibold text-3xl text-text-primary">
              Booking Preview
            </h1>
          </div>

          <div className="flex items-center gap-6 mb-12">
            <div className="w-[120px] h-[120px] rounded-2xl flex-shrink-0 bg-gradient-to-br from-bg-raised to-bg-surface border border-border-subtle overflow-hidden">
              {cafe?.images?.[0] && (
                <img src={cafe.images[0]} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <div className="font-display font-semibold text-3xl text-text-primary">
                {booking.resourceName}
              </div>
              <div className="text-base text-text-secondary mt-1.5">
                {cafe?.name ?? booking.cafeName}
                {cafe?.address?.city ? ` \u00B7 ${cafe.address.city}` : ""}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-12">
            <DetailCard label="Game" value={booking.game ?? "\u2014"} />
            <DetailCard label="Date" value={dateLabel} />
            <DetailCard
              label="Time"
              value={`${formatMinutesAsTime(startMinutes)} \u2013 ${formatMinutesAsTime(endMinutes)}`}
            />
            <DetailCard label="Duration" value={`${booking.durationMinutes} min`} />
          </div>

          <div className="text-sm uppercase tracking-wide text-text-secondary mb-3.5">
            Offer
          </div>
          <div className="max-w-xl">{offerSection}</div>
        </div>

        {/* Fixed, wider sidebar — a price/pay card doesn't benefit from
            growing arbitrarily wide, but it's sized generously enough to
            feel proportionate to the now much bigger left column. */}
        <div className="w-[440px] flex-shrink-0 sticky top-10 self-start">
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8">
            {holdExpiresAtMs && (
              <div className="mb-6">
                <HoldCountdown expiresAt={holdExpiresAtMs} onExpire={handleExpire} />
              </div>
            )}
            <div className="text-sm uppercase tracking-wide text-text-secondary mb-3.5">
              Price details
            </div>
            {priceAndPaySection}
          </div>
        </div>
      </div>

      
    </PageShell>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card px-5 py-5">
      <div className="text-xs uppercase tracking-wide text-text-secondary mb-1.5">{label}</div>
      <div className="font-display font-semibold text-lg text-text-primary">{value}</div>
    </div>
  );
}
