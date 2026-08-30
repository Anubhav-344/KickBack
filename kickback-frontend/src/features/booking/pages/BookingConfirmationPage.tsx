// src/features/booking/pages/BookingConfirmationPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingSummaryCard from "../components/BookingSummaryCard";
import SuccessBurst from "../components/SuccessBurst";

// TEMPORARY mock — replace with useBookingDetails(bookingId), returning the
// now-CONFIRMED booking plus its linked PAYMENTS row (amount, method,
// transaction_reference) once the backend exists.
const MOCK_CONFIRMED_BOOKING = {
  bookingId: "KB-20260722-0847",
  cafeName: "Respawn Lounge",
  cafeSlug: "respawn-lounge",
  resourceName: "PS5 - Unit 1",
  game: "FIFA 24",
  dateLabel: "Today, 22 Jul",
  startMinutes: 14 * 60,
  durationMinutes: 60,
  amountPaid: 126,
  paymentMethod: "UPI",
  transactionRef: "TXN8823471",
};

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  void bookingId; // will select the real booking once wired to a backend

  const booking = MOCK_CONFIRMED_BOOKING;
  const endMinutes = booking.startMinutes + booking.durationMinutes;

  return (
    <PageShell>
      <Header />

      <div className="flex flex-col items-center pt-10 pb-6 px-6 text-center">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <SuccessBurst />
          <div className="w-16 h-16 rounded-full bg-state-available/15 flex items-center justify-center">
            <CheckCircle2 size={34} className="text-state-available" />
          </div>
        </div>
        <h1 className="font-display font-semibold text-2xl text-text-primary">
          Booking confirmed!
        </h1>
        <p className="text-sm text-text-secondary mt-1.5">
          See you at {booking.cafeName}
        </p>
      </div>

      <div className="px-4 py-4 border-b border-border-subtle">
        <div className="text-xs uppercase tracking-wide text-text-secondary mb-2.5">
          Booking details
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
          Payment
        </div>
        <div className="bg-bg-surface border border-border-subtle rounded-card p-3.5 flex flex-col gap-2">
          <Row label="Amount paid" value={`\u20B9${booking.amountPaid}`} />
          <Row label="Payment method" value={booking.paymentMethod} />
          <Row label="Transaction ID" value={booking.transactionRef} />
          <Row label="Booking ID" value={booking.bookingId} />
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-2.5">
        <button
          onClick={() => navigate("/bookings")}
          className="w-full bg-accent text-bg-base font-semibold text-sm py-3.5 rounded-card shadow-accent-glow"
        >
          View My Bookings
        </button>
        <button
          onClick={() => navigate(`/cafes/${booking.cafeSlug}`)}
          className="w-full bg-bg-surface border border-border-subtle text-text-primary font-medium text-sm py-3.5 rounded-card"
        >
          Back to Caf&eacute;
        </button>
      </div>

      <Footer cafeName={booking.cafeName} locationLabel="Bhopal" />
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary font-medium tabular-nums">{value}</span>
    </div>
  );
}
