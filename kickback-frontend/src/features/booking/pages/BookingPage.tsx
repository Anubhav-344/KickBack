// src/features/booking/pages/BookingPage.tsx
import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import type { ExistingBooking, OperatingWindow } from "../types";

// TEMPORARY mock data — replace with real queries:
//   useResourceDetails(resourceId), useOperatingHours(cafeSlug, date),
//   useExistingBookings(resourceId, date)
const MOCK_UNIT = {
  resourceId: 1,
  resourceName: "PS5 - Unit 1",
  hourlyRate: 150,
  maxPlayers: 4,
  games: ["FIFA 24", "GTA V", "God of War"],
};

const MOCK_OPERATING_WINDOW: OperatingWindow = {
  openingMinutes: 12 * 60, // 12 PM
  closingMinutes: 24 * 60, // 12 AM
  isClosed: false,
};

const MOCK_BOOKINGS: ExistingBooking[] = [
  { startMinutes: 12 * 60, endMinutes: 13 * 60 }, // 12-1 PM
  { startMinutes: 19 * 60, endMinutes: 20 * 60 }, // 7-8 PM
];

export default function BookingPage() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const setResourceId = useBookingDraftStore((s) => s.setResourceId);
  const currentDraftResourceId = useBookingDraftStore((s) => s.resourceId);
  const reset = useBookingDraftStore((s) => s.reset);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Only reset the draft when switching to a DIFFERENT resource. Without
  // this guard, returning here from the login redirect (same resourceId)
  // would wipe the game/time/duration the guest had already picked —
  // exactly the state we're trying to preserve across the login gate.
  useEffect(() => {
    const newId = resourceId ? Number(resourceId) : null;
    if (newId !== null && newId !== currentDraftResourceId) {
      reset();
      setResourceId(newId);
    }
  }, [resourceId, currentDraftResourceId, reset, setResourceId]);

  const handleBook = () => {
    // Guests can browse and configure a booking freely — auth is only
    // required at the moment of actually creating it, since bookings.user_id
    // is a required FK. Their selections stay in the Zustand draft store,
    // so returning here after login picks up right where they left off.
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    // Next: create the PENDING hold via useCreateHold(), then navigate
    // to the preview page once the server confirms the slot is claimed.
    navigate(`/bookings/pending/preview`);
  };

  return (
    <PageShell>
      <Header />

      <ResourceHeader
        cafeName="Respawn Lounge"
        unitName={MOCK_UNIT.resourceName}
        hourlyRate={MOCK_UNIT.hourlyRate}
        maxPlayers={MOCK_UNIT.maxPlayers}
      />

      <AvailabilityTimeline
        unitName={MOCK_UNIT.resourceName}
        operatingWindow={MOCK_OPERATING_WINDOW}
        bookings={MOCK_BOOKINGS}
      />

      <div className="px-4 py-4">
        <GameSelectField games={MOCK_UNIT.games} />
        <StartTimeInput />
        <DurationEndTimeFields />
      </div>

      <PriceSummary hourlyRate={MOCK_UNIT.hourlyRate} onBook={handleBook} />

      <Footer cafeName="Respawn Lounge" locationLabel="Bhopal" />
    </PageShell>
  );
}
