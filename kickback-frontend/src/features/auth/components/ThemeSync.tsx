// src/features/auth/components/ThemeSync.tsx
import { useEffect, useRef } from "react";
import { applyTheme, getTheme } from "@/lib/theme";
import { useUserProfile } from "../hooks/useUpdateProfile";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Renders nothing. Once per login session, if the user's account has a saved
 * theme, make this device use it (that is how a choice made on another device
 * arrives). Only the first load counts, so a toggle made a moment ago is never
 * undone by an older copy of the profile. Accounts that never chose a theme
 * keep whatever this browser already has.
 */
export default function ThemeSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: profile } = useUserProfile();
  const synced = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      synced.current = false; // next login syncs again
      return;
    }
    if (synced.current || !profile) return;
    synced.current = true;
    if (profile.theme) {
      const accountTheme = profile.theme === "LIGHT" ? "light" : "dark";
      if (accountTheme !== getTheme()) applyTheme(accountTheme);
    }
  }, [isAuthenticated, profile]);

  return null;
}
