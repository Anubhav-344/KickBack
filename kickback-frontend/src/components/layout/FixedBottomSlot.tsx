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
 * The inner container spans the full viewport width (PageShell itself has
 * no max-width anymore), so a child positioned with e.g. `right-5` resolves
 * against the real screen edge. This previously capped at max-w-app to
 * line up with PageShell's old centered column — now that PageShell is
 * edge-to-edge, keeping that cap would leave the button floating relative
 * to an invisible, meaningless 480px box instead of the actual page edge.
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
      className="fixed inset-x-0 z-20 pointer-events-none"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <div className="w-full relative">{children}</div>
    </div>
  );
}