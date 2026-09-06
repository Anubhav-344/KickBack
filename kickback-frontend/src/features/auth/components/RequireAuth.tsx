// src/features/auth/components/RequireAuth.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/useAuthStore";

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Wraps any route that requires a logged-in user. Guests are redirected to
 * /login with a `redirect` param pointing back here — same pattern as the
 * Booking page's "Book" button gate, just applied at the route level
 * instead of at a single action, for pages that are ENTIRELY gated
 * (Profile, My Bookings) rather than just one button within a public page.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
