// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import CafeLandingPage from "@/features/cafe/pages/CafeLandingPage";
import ResourceSelectionPage from "@/features/resources/pages/ResourceSelectionPage";
import BookingPage from "@/features/booking/pages/BookingPage";
import BookingPreviewPage from "@/features/booking/pages/BookingPreviewPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import MyBookingsPage from "@/features/auth/pages/MyBookingsPage";
import SupportPage from "@/features/auth/pages/SupportPage";
import NewTicketPage from "@/features/auth/pages/NewTicketPage";
import MyTicketsPage from "@/features/auth/pages/MyTicketsPage";
import SettingsPage from "@/features/auth/pages/SettingsPage";
import AppearanceSettingsPage from "@/features/auth/pages/AppearanceSettingsPage";
import SecuritySettingsPage from "@/features/auth/pages/SecuritySettingsPage";
import DeleteAccountPage from "@/features/auth/pages/DeleteAccountPage";
import BookingConfirmationPage from "@/features/booking/pages/BookingConfirmationPage";
import CafeDiscoveryPage from "@/features/cafe/pages/CafeDiscoveryPage";
import RequireAuth from "@/features/auth/components/RequireAuth";
import NotFoundPage from "@/pages/NotFoundPage";

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
    // Real booking already exists by the time this page loads (created on
    // the Booking page's "Book" click) — the hold is active and offers get
    // applied against this same booking via PATCH /bookings/{id}/offer.
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
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
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
    path: "/settings",
    element: <RequireAuth><SettingsPage /></RequireAuth>
  },
  {
    path: "/settings/appearance",
    element: <RequireAuth><AppearanceSettingsPage /></RequireAuth>
  },
  {
    path: "/settings/security",
    element: <RequireAuth><SecuritySettingsPage /></RequireAuth>
  },
  {
    path: "/settings/delete-account",
    element: <RequireAuth><DeleteAccountPage /></RequireAuth>
  },
  { 
    path: "/support", 
    element: <SupportPage /> 
  },
  {
    path: "/support/tickets",
    element: <RequireAuth><MyTicketsPage /></RequireAuth>
  },
  {
    path: "/support/tickets/new",
    element: <RequireAuth><NewTicketPage /></RequireAuth>
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
