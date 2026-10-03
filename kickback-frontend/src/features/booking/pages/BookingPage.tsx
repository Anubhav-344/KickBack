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

  useEffect(() => {
    const newId = numericResourceId ?? null;
    if (newId !== null && newId !== currentDraftResourceId && cafeSlug) {
      reset();
      setResource(cafeSlug, newId);
    }
  }, [numericResourceId, currentDraftResourceId, cafeSlug, reset, setResource]);

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

  const selectedGame = unit.games?.find((g) => g.gameId === gameId);

  return (
    <PageShell>
      <Header />

      {/* ============== MOBILE / TABLET (below lg): unchanged single column ============== */}
      <div className="lg:hidden max-w-xl mx-auto w-full">
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
      </div>

      {/* ============== DESKTOP (lg+): two-column ==============
          Left column now uses the FULL available width (no max-w cap on
          the fields section anymore) — everything (header, timeline,
          fields) aligns to the same left edge via consistent padding. */}
      <div className="hidden lg:flex gap-12 px-10 xl:px-16 py-10">
        <div className="flex-1 min-w-0">
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

          <div className="py-4">
            <GameSelectField games={unit.games ?? []} />
            <StartTimeInput />
            <DurationEndTimeFields />
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0 sticky top-10 self-start">
          <div className="bg-bg-surface border border-border-subtle rounded-2xl">
            <PriceSummary hourlyRate={unit.hourlyRate} onBook={handleBook} />
          </div>
        </div>
      </div>

          </PageShell>
  );
}
