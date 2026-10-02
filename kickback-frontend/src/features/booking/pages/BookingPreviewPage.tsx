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
import { useBookingDetails } from "../hooks/useBookingDetails";
import { useCafeDetails } from "@/features/cafe/hooks/useCafeDetails";
import { useApplyBookingOffer } from "../hooks/useApplyBookingOffer";
import { useInitiatePayment } from "@/features/payment/hooks/useInitiatePayment";
import { formatDateLabel } from "@/lib/dateTime";

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
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-text-secondary">Loading...</p>
        </div>
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

      {holdExpiresAtMs && (
        <HoldCountdown expiresAt={holdExpiresAtMs} onExpire={handleExpire} />
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
            placeholder="Enter promo code"
            className="flex-1 bg-bg-surface border border-border-subtle rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary"
          />
          <button
            onClick={handleApplyCode}
            disabled={applyOffer.isPending}
            className="bg-bg-raised border border-border-subtle rounded-lg px-4 text-sm font-semibold text-text-primary disabled:opacity-60"
          >
            {applyOffer.isPending ? "..." : "Apply"}
          </button>
        </div>

        {cafe && cafe.offers.length > 0 && (
          <OfferSelector
            offers={cafe.offers}
            onSelect={applyOfferToBooking}
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
          className="w-full bg-accent text-bg-base font-semibold text-[15px] py-3.5 rounded-card shadow-accent-glow disabled:opacity-60"
        >
          {initiatePayment.isPending ? "Processing..." : `Pay \u20B9${booking.totalAmount}`}
        </button>
      </div>

      <Footer cafeName={booking.cafeName} locationLabel="Bhopal" />
    </PageShell>
  );
}
