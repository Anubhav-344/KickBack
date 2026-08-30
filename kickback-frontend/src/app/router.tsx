// src/app/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import CafeLandingPage from "@/features/cafe/pages/CafeLandingPage";
import ResourceSelectionPage from "@/features/resources/pages/ResourceSelectionPage";
import BookingPage from "@/features/booking/pages/BookingPage";
import BookingPreviewPage from "@/features/booking/pages/BookingPreviewPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import MyBookingsPage from "@/features/auth/pages/MyBookingsPage";
import SupportPage from "@/features/auth/pages/SupportPage";

// Single-cafe MVP: root redirects straight to the (only) cafe's page.
// When multi-cafe launches, "/" becomes a discovery page instead —
// this redirect is the only thing that changes.
const CAFE_SLUG = "respawn-lounge";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={`/cafes/${CAFE_SLUG}`} replace />,
  },
  {
    path: "/cafes/:cafeSlug",
    element: <CafeLandingPage />,
  },
  {
    path: "/cafes/:cafeSlug/resource-types/:resourceTypeId",
    element: <ResourceSelectionPage />,
  },
  {
    path: "/cafes/:cafeSlug/resources/:resourceId/book",
    element: <BookingPage />,
  },
  {
    path: "/bookings/:bookingId/preview",
    element: <BookingPreviewPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  { 
    path: "/profile", 
    element: <ProfilePage /> 
  },
  { path: "/bookings", 
    element: <MyBookingsPage /> 
  },
  { path: "/support", 
    element: <SupportPage /> 
  },
]);
