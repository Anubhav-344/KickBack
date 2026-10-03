// src/components/layout/PageShell.tsx
import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

/**
 * The outer shell is now always full-bleed (100% viewport width, zero
 * margin, no border) — per explicit decision to prioritize true edge-to-
 * edge desktop width over a centered-column look.
 *
 * Since the shell itself no longer caps width at all, any page whose
 * content genuinely needs to stay narrower for readability (a login form,
 * a centered single-column booking flow) is responsible for its OWN inner
 * max-width wrapper now — see each page for how it handles that. Pages
 * that are meant to be browsable/wide (Discovery, café detail, two-column
 * checkout) just use the full width directly with no extra wrapper needed.
 */
export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col w-full">
      {children}
    </div>
  );
}
