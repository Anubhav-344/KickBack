// src/features/auth/pages/MyBookingsPage.tsx
import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingListCard from "../components/BookingListCard";
import { useUserBookings } from "../hooks/useUserBookings";

type Tab = "upcoming" | "past";

const UPCOMING_STATUSES = new Set(["PENDING", "CONFIRMED"]);

export default function MyBookingsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const { data: bookings, isLoading } = useUserBookings();

  const filtered = (bookings ?? []).filter((b) =>
    tab === "upcoming" ? UPCOMING_STATUSES.has(b.status) : !UPCOMING_STATUSES.has(b.status)
  );

  return (
    <PageShell>
      <Header />

      <div className="px-4 pt-5">
        <h1 className="font-display font-semibold text-2xl text-text-primary mb-4">
          My Bookings
        </h1>

        <div className="flex gap-2 mb-4">
          <TabButton label="Upcoming" active={tab === "upcoming"} onClick={() => setTab("upcoming")} />
          <TabButton label="Past" active={tab === "past"} onClick={() => setTab("past")} />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary text-center py-10">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-10">
            No {tab} bookings.
          </p>
        ) : (
          filtered.map((booking) => (
            <BookingListCard key={booking.bookingId} booking={booking} />
          ))
        )}
      </div>

      <Footer />
    </PageShell>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-sm font-medium py-2.5 rounded-card border transition-colors ${
        active
          ? "bg-accent text-bg-base border-accent"
          : "bg-bg-surface text-text-secondary border-border-subtle"
      }`}
    >
      {label}
    </button>
  );
}
