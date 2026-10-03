// src/components/layout/AuthSidePanel.tsx
import { Gamepad2 } from "lucide-react";

interface AuthSidePanelProps {
  className?: string;
}

/**
 * Decorative panel filling the right half of login/signup/profile on
 * desktop — these are the only remaining pages using a centered single
 * column, which looked inconsistent once every browsing page went full
 * width. Since there's no real marketing photography to show here, this
 * follows the same pattern as Stripe/Linear-style auth screens: the form
 * stays compact and usable, the other half is purely atmospheric branding,
 * not functional content.
 */
export default function AuthSidePanel({ className = "" }: AuthSidePanelProps) {
  return (
    <div
      className={`relative items-center justify-center overflow-hidden bg-gradient-to-br from-bg-raised via-bg-surface to-bg-base ${className}`}
    >
      {/* Soft accent glow, purely atmospheric */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #FF5A3C, transparent 70%)" }}
      />

      <div className="relative flex flex-col items-center text-center px-12">
        <div className="w-20 h-20 rounded-3xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-8">
          <Gamepad2 size={38} className="text-accent" />
        </div>
        <h2 className="font-display font-semibold text-4xl text-text-primary mb-3">
          KickBack
        </h2>
        <p className="text-text-secondary text-base max-w-sm">
          Your next gaming session is a few taps away. PS5, PC, VR and more —
          book a slot at Bhopal&apos;s favourite gaming caf&eacute;s.
        </p>
      </div>
    </div>
  );
}
