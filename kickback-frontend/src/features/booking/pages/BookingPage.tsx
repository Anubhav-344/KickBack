// src/features/booking/pages/BookingPage.tsx
import { useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResourceHeader from "../components/ResourceHeader";
import AvailabilityTimeline from "../components/AvailabilityTimeline";
import GameSelectField from "../components/GameSelectField";
import StartTimeInput from "../components/StartTimeInput";
import DurationEndTimeFields from "../components/DurationEndTimeFields";
import PriceSummary from "../components/PriceSummary";
import { useBookingDraftStore } from "../store/useBookingDraftStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCafeDetails } from "@/features/cafe/hooks/useCafeDetails";
import { useResourceUnit } from "@/features/resources/hooks/useResources";
import { useAvailability } from "../hooks/useAvailability";
import { useCreateHold } from "../hooks/useCreateHold";
import toast from "react-hot-toast";

export default function BookingPage() {
  const { cafeSlug, resourceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const setResourceId = useBookingDraftStore((s) => s.setResourceId);
  const currentDraftResourceId = useBookingDraftStore((s) => s.resourceId);
  const reset = useBookingDraftStore((s) => s.reset);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const gameId = useBookingDraftStore((s) => s.gameId);
  const selectedDate = useBookingDraftStore((s) => s.selectedDate);
  const startMinutes = useBookingDraftStore((s) => s.startMinutes);
  const durationMinutes = useBookingDraftStore((s) => s.durationMinutes);

  const numericResourceId = resourceId ? Number(resourceId) : undefined;

  const { data: cafe, isLoading: cafeLoading } = useCafeDetails(cafeSlug);
  const { data: unit, isLoading: unitLoading } = useResourceUnit(numericResourceId);
  // Including selectedDate in this hook's query key means picking a
  // different date correctly triggers a refetch — the mock data doesn't
  // vary by date yet, but the wiring is already correct for when it does.
  const { data: availability, isLoading: availabilityLoading } = useAvailability(
    numericResourceId,
    selectedDate
  );

  const createHold = useCreateHold();

  // Only reset the draft when switching to a DIFFERENT resource. Without
  // this guard, returning here from the login redirect (same resourceId)
  // would wipe the game/time/duration the guest had already picked.
  useEffect(() => {
    const newId = numericResourceId ?? null;
    if (newId !== null && newId !== currentDraftResourceId) {
      reset();
      setResourceId(newId);
    }
  }, [numericResourceId, currentDraftResourceId, reset, setResourceId]);

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (!numericResourceId) return;

    createHold.mutate(
      {
        resourceId: numericResourceId,
        gameId,
        startMinutes,
        durationMinutes,
        date: selectedDate,
      },
      {
        onSuccess: (result) => {
          navigate(`/bookings/${result.bookingId}/preview`);
        },
        onError: () => {
          // Real backend can return 409 here if the slot was taken between
          // the client's last check and this request — axiosClient's
          // interceptor already toasts that case; this covers other failures.
          toast.error("Couldn't hold this slot. Please try again.");
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

  return (
    <PageShell>
      <Header />

      <ResourceHeader
        cafeName={cafe.name}
        unitName={unit.resourceName}
        hourlyRate={unit.hourlyRate}
        maxPlayers={unit.maxPlayers}
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
