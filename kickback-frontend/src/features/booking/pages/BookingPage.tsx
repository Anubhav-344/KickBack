// src/features/booking/pages/BookingPage.tsx
import { useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResourceHeader from "../components/ResourceHeader";
import AvailabilityTimeline from "../components/AvailabilityTimeline";
import GameSelectField from "../components/GameSelectField";
import StartTimeInput from "../components/StartTimeInput";
import DurationEndTimeFields from "../components/DurationEndTimeFields";
import PriceSummary from "../components/PriceSummary";
import { useBookingDraftStore, useBookingEndMinutes } from "../store/useBookingDraftStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCafeDetails } from "@/features/cafe/hooks/useCafeDetails";
import { useResourceUnit } from "@/features/resources/hooks/useResources";
import { useAvailability } from "../hooks/useAvailability";
import { useCreateBooking } from "../hooks/useCreateBooking";
import { toISODateTime } from "@/lib/dateTime";

export default function BookingPage() {
  const { cafeSlug, resourceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const setResource = useBookingDraftStore((s) => s.setResource);
  const currentDraftResourceId = useBookingDraftStore((s) => s.resourceId);
  const reset = useBookingDraftStore((s) => s.reset);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const gameId = useBookingDraftStore((s) => s.gameId);
  const selectedDate = useBookingDraftStore((s) => s.selectedDate);
  const startMinutes = useBookingDraftStore((s) => s.startMinutes);
  const endMinutes = useBookingEndMinutes();

  const numericResourceId = resourceId ? Number(resourceId) : undefined;

  const { data: cafe, isLoading: cafeLoading } = useCafeDetails(cafeSlug);
  const { data: unit, isLoading: unitLoading } = useResourceUnit(numericResourceId);
  const { data: availability, isLoading: availabilityLoading } = useAvailability(
    numericResourceId,
    selectedDate
  );

  const createBooking = useCreateBooking();

  // Only reset the draft when switching to a DIFFERENT resource. Without
  // this guard, returning here from the login redirect (same resourceId)
  // would wipe the game/time/duration the guest had already picked.
  useEffect(() => {
    const newId = numericResourceId ?? null;
    if (newId !== null && newId !== currentDraftResourceId && cafeSlug) {
      reset();
      setResource(cafeSlug, newId);
    }
  }, [numericResourceId, currentDraftResourceId, cafeSlug, reset, setResource]);

  // "Book" creates the real hold immediately (back to the original design)
  // — the resource row gets locked server-side right away, so the slot is
  // actually protected while the user is still on the Preview page picking
  // an offer and payment method. Any offer chosen there goes through
  // PATCH /bookings/{id}/offer against this same booking, so Pay never
  // needs to create anything new — it just charges whatever total that
  // endpoint most recently returned.
  const handleBook = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (!numericResourceId) return;

    createBooking.mutate(
      {
        resourceId: numericResourceId,
        gameId,
        date: selectedDate,
        startTimestamp: toISODateTime(selectedDate, startMinutes),
        endTimestamp: toISODateTime(selectedDate, endMinutes),
      },
      {
        onSuccess: (booking) => {
          navigate(`/bookings/${booking.bookingId}/preview`);
        },
        onError: () => {
          // 409 (slot taken) already gets its own toast from axiosClient's
          // global interceptor; this covers other validation failures.
          toast.error("Couldn't hold this slot. Please try again.", { id: "booking-error" });
        },
      }
    );
  };

  const isLoading = cafeLoading || unitLoading || availabilityLoading;

  if (isLoading) {
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

  if (!cafe || !unit) {
    return (
      <PageShell>
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-sm text-text-secondary mb-5">
            This resource couldn&apos;t be found.
          </p>
          <Link
            to={cafe ? `/cafes/${cafe.slug}` : "/"}
            className="text-sm font-semibold text-accent-hover border border-accent/40 rounded-md px-4 py-2"
          >
            {cafe ? "Back to Caf\u00E9" : "Back to Discovery"}
          </Link>
        </div>
        <Footer />
      </PageShell>
    );
  }

  // Different games can support different player counts on the same unit
  // (e.g. a PS5 might allow 1-4 for FIFA but 1-2 for another title) — look
  // up the selected game's own range, falling back to the resource's own
  // maxPlayers when no game is picked yet.
  const selectedGame = unit.games?.find((g) => g.gameId === gameId);

  return (
    <PageShell>
      <Header />

      <ResourceHeader
        cafeName={cafe.name}
        unitName={unit.resourceName}
        hourlyRate={unit.hourlyRate}
        maxPlayers={selectedGame?.maxPlayers ?? unit.maxPlayers}
        minPlayers={selectedGame?.minPlayers}
        imageUrl={unit.imageUrl}
      />

      <AvailabilityTimeline
        unitName={unit.resourceName}
        operatingWindow={availability?.operatingWindow ?? { openingMinutes: 0, closingMinutes: 0, isClosedToday: true }}
        bookings={availability?.bookings ?? []}
      />

      <div className="px-4 py-4">
        <GameSelectField games={unit.games ?? []} />
        <StartTimeInput />
        <DurationEndTimeFields />
      </div>

      <PriceSummary
        hourlyRate={unit.hourlyRate}
        onBook={handleBook}
      />

      <Footer cafeName={cafe.name} locationLabel={cafe.address.city} />
    </PageShell>
  );
}
