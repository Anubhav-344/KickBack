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
import BookingConfirmationPage from "@/features/booking/pages/BookingConfirmationPage";
import CafeDiscoveryPage from "@/features/cafe/pages/CafeDiscoveryPage";
import RequireAuth from "@/features/auth/components/RequireAuth";
import NotFoundPage from "@/pages/NotFoundPage";

// Single-cafe MVP: root redirects straight to the (only) cafe's page.
// When multi-cafe launches, "/" becomes a discovery page instead —
// this redirect is the only thing that changes.
const CAFE_SLUG = "respawn-lounge";

export const router = createBrowserRouter([
  { 
    path: "/", 
    element: <CafeDiscoveryPage /> 
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
    element: <RequireAuth><BookingPreviewPage /></RequireAuth> 
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
    element: <RequireAuth><ProfilePage /></RequireAuth> 
  },
  { 
    path: "/bookings", 
    element: <RequireAuth><MyBookingsPage /></RequireAuth> 
  },
  { 
    path: "/support", 
    element: <SupportPage /> 
  },
  { 
    path: "/bookings/:bookingId/confirmation", 
    element: <RequireAuth><BookingConfirmationPage /></RequireAuth> 
  },
  { 
    path: "*", 
    element: <NotFoundPage /> 
  },
   
]);
