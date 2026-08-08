// src/components/layout/PageShell.tsx
import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

/**
 * Mobile-first shell: full width up to 480px (max-w-app), centered column
 * beyond that on desktop.
 *
 * Does NOT use a transform here (see FixedBottomSlot for why) — any fixed
 * floating UI (Book button, hold countdown, etc.) should be rendered via
 * FixedBottomSlot instead of relying on this wrapper as a containing block.
 */
export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-bg-base flex justify-center">
      <div className="w-full max-w-app relative flex flex-col min-h-screen md:border-x md:border-border-subtle">
        {children}
      </div>
    </div>
  );
}
