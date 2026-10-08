// src/features/auth/pages/DeleteAccountPage.tsx
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import SettingsLayout from "../components/SettingsLayout";
import { useDeleteAccount } from "../hooks/useAccountSettings";
import { useAuthStore } from "../store/useAuthStore";

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useDeleteAccount();

  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [passwordError, setPasswordError] = useState<string>();
  const [hasUpcomingBookings, setHasUpcomingBookings] = useState(false);
  const checkboxId = useId();

  const canSubmit = password.length > 0 && confirmed && !deleteAccount.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPasswordError(undefined);
    setHasUpcomingBookings(false);

    deleteAccount.mutate(password, {
      onSuccess: () => {
        // Leave the page first: once logged out, RequireAuth would otherwise
        // bounce this page to the login screen.
        navigate("/", { replace: true });
        logout();
        queryClient.clear();
        toast.success("Your account has been deleted");
      },
      onError: (error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined;
        if (status === 403) setPasswordError("Password is incorrect");
        else if (status === 422) setHasUpcomingBookings(true);
        else if (status === undefined || status < 500) {
          toast.error("Couldn't delete your account. Please try again.");
        }
      },
    });
  };

  return (
    <SettingsLayout title="Delete account" backTo="/settings" backLabel="Back to settings">
      <p className="text-sm text-text-primary mb-3">
        Deleting your account is permanent. Here is what happens:
      </p>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-text-secondary mb-5">
        <li>Your name, email, phone number, username and avatar are erased.</li>
        <li>
          Your past bookings stay in the cafés&rsquo; records, but without your name. You will
          no longer see them.
        </li>
        <li>You cannot undo this. You can sign up again later with the same email or phone.</li>
      </ul>

      {hasUpcomingBookings && (
        <div
          role="alert"
          className="bg-state-error/10 border border-state-error/35 rounded-card px-4 py-3 mb-5 text-sm text-state-error-text"
        >
          You still have an upcoming booking. Cancel it first, then come back.{" "}
          <Link to="/bookings" className="font-semibold underline">
            Go to My Bookings
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Enter your password to confirm"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(undefined);
          }}
          error={passwordError}
        />

        <div className="flex items-start gap-3 mb-5">
          <input
            id={checkboxId}
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-5 h-5 flex-shrink-0 accent-accent"
          />
          <label htmlFor={checkboxId} className="text-sm text-text-primary">
            I understand my account will be permanently deleted.
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-state-error text-on-error font-semibold text-sm py-3.5 rounded-card disabled:opacity-50 transition-opacity"
        >
          {deleteAccount.isPending ? "Deleting..." : "Delete my account"}
        </button>
      </form>
    </SettingsLayout>
  );
}
