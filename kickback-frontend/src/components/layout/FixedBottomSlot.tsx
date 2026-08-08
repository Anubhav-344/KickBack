// src/components/layout/FixedBottomSlot.tsx
import type { ReactNode } from "react";

interface FixedBottomSlotProps {
  children: ReactNode;
}

/**
 * A genuinely viewport-fixed layer (no transform on any ancestor), so
 * children stay pinned to the bottom of the screen while scrolling —
 * true "position: fixed" behavior.
 *
 * It centers an inner max-w-app column so a floating button placed inside
 * lines up with the page's column edge on wide desktop screens, instead of
 * the raw browser window edge.
 *
 * NOTE: this replaces the earlier approach of putting `transform` on
 * PageShell to create a containing block. That trick breaks `position:
 * fixed` elements — they stop tracking the viewport and instead become
 * relative to the transformed ancestor's full content height, so they only
 * appear once you scroll to the very bottom. Any future fixed/floating UI
 * (hold countdown, snackbars, etc.) should use THIS pattern, not that one.
 */
export default function FixedBottomSlot({ children }: FixedBottomSlotProps) {
  return (
    <div
      className="fixed inset-x-0 z-20 flex justify-center pointer-events-none"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <div className="w-full max-w-app relative">{children}</div>
    </div>
  );
}
