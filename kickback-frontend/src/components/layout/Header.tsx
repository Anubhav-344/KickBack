// src/components/layout/Header.tsx
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import ProfileMenu from "@/features/auth/components/ProfileMenu";

// Identical shell on every page — logo + brand always on the left.
// The right side is the one thing that varies: a Log in link for guests,
// or the account menu for logged-in users. No page needs to know or care
// which state it's in — this component handles it internally.
export default function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-md bg-accent" />
        <span className="ml-2.5 font-display font-bold text-lg text-text-primary">
          KickBack
        </span>
      </div>

      {isAuthenticated ? (
        <ProfileMenu />
      ) : (
        <Link
          to="/login"
          className="text-sm font-semibold text-accent-hover border border-accent/40 rounded-md px-3.5 py-1.5"
        >
          Log in
        </Link>
      )}
    </header>
  );
}
