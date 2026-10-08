// src/components/layout/Header.tsx
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import ProfileMenu from "@/features/auth/components/ProfileMenu";
import { LogoMark } from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

// Identical shell on every page — logo + brand always on the left.
// The right side is the one thing that varies: a Log in link for guests,
// or the account menu for logged-in users. No page needs to know or care
// which state it's in — this component handles it internally.
export default function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-5 border-b border-border-subtle">
      <Link to="/" className="flex items-center">
        <LogoMark className="w-6 h-6 lg:w-8 lg:h-8" />
        <span className="ml-2.5 font-display font-bold text-lg lg:text-xl text-text-primary">
          KickBack
        </span>
      </Link>

      <div className="flex items-center gap-2.5 lg:gap-3">
        <ThemeToggle />
        {isAuthenticated ? (
          <ProfileMenu />
        ) : (
          <Link
            to="/login"
            className="text-sm lg:text-base font-semibold text-accent-text border border-accent/40 rounded-md px-3.5 lg:px-5 py-1.5 lg:py-2"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
