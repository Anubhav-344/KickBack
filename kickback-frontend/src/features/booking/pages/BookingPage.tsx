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
import { getCafeBySlug, getUnitById, getBookingsForResource } from "@/mocks/cafes";

export default function BookingPage() {
  const { cafeSlug, resourceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const setResourceId = useBookingDraftStore((s) => s.setResourceId);
  const currentDraftResourceId = useBookingDraftStore((s) => s.resourceId);
  const reset = useBookingDraftStore((s) => s.reset);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const cafe = cafeSlug ? getCafeBySlug(cafeSlug) : undefined;
  const unit = resourceId ? getUnitById(Number(resourceId)) : undefined;
  const bookings = resourceId ? getBookingsForResource(Number(resourceId)) : [];

  // Only reset the draft when switching to a DIFFERENT resource. Without
  // this guard, returning here from the login redirect (same resourceId)
  // would wipe the game/time/duration the guest had already picked.
  useEffect(() => {
    const newId = resourceId ? Number(resourceId) : null;
    if (newId !== null && newId !== currentDraftResourceId) {
      reset();
      setResourceId(newId);
    }
  }, [resourceId, currentDraftResourceId, reset, setResourceId]);

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    // Next: create the PENDING hold via useCreateHold(), then navigate
    // to the preview page once the server confirms the slot is claimed.
    navigate(`/bookings/pending/preview`);
  };

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
        operatingWindow={cafe.operatingWindowToday}
        bookings={bookings}
      />

      <div className="px-4 py-4">
        <GameSelectField games={unit.games ?? []} />
        <StartTimeInput />
        <DurationEndTimeFields />
      </div>

      <PriceSummary hourlyRate={unit.hourlyRate} onBook={handleBook} />

      <Footer cafeName={cafe.name} locationLabel={cafe.address.city} />
    </PageShell>
  );
}
