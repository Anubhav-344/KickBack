// src/features/auth/pages/MyBookingsPage.tsx
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// STUB — real version: list of upcoming/past bookings from
// GET /users/:id/bookings, with cancel/reschedule actions where allowed.
export default function MyBookingsPage() {
  return (
    <PageShell>
      <Header />
      <div className="px-4 py-6">
        <h1 className="font-display font-semibold text-2xl text-text-primary mb-4">
          My Bookings
        </h1>
        <p className="text-sm text-text-secondary">No bookings yet.</p>
      </div>
      <Footer cafeName="Respawn Lounge" locationLabel="Bhopal" />
    </PageShell>
  );
}
