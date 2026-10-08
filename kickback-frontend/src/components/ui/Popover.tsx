// src/components/ui/Popover.tsx
import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

interface TriggerProps {
  onClick?: (e: unknown) => void;
  [key: string]: unknown;
}

interface PopoverProps {
  /** A single button element. Popover adds its aria attributes and click handling. */
  trigger: ReactNode;
  /** Accessible name for the opened panel, e.g. "Choose a game". */
  label: string;
  /** Which edge of the trigger the panel lines up with. */
  align?: "left" | "right";
  /** Extra classes for the wrapper, e.g. "inline-block". */
  className?: string;
  /** Width / padding of the panel, e.g. "w-56 p-1.5". */
  panelClassName?: string;
  /** Panel content. Call `close()` after a choice to dismiss it and return focus to the trigger. */
  children: (close: () => void) => ReactNode;
}

/**
 * The desktop "small menu that drops under a button" used by the resource-type
 * switcher, game filter, game select, offer selector and account menu. These
 * used to be five copies of the same code; keeping it here means the
 * accessibility behaviour lives in one place:
 *
 *  - the trigger announces itself (aria-haspopup / aria-expanded / aria-controls)
 *  - Escape closes it and puts focus back on the trigger
 *  - choosing something closes it and puts focus back on the trigger
 *  - clicking outside, or Tabbing out of it, closes it
 */
export default function Popover({
  trigger,
  label,
  align = "left",
  className = "",
  panelClassName = "",
  children,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback(() => {
    setOpen(false);
    rootRef.current?.querySelector<HTMLElement>("[data-popover-trigger]")?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  const triggerElement = isValidElement<TriggerProps>(trigger)
    ? cloneElement(trigger, {
        "aria-haspopup": "true",
        "aria-expanded": open,
        "aria-controls": open ? panelId : undefined,
        "data-popover-trigger": "",
        onClick: (e: unknown) => {
          trigger.props.onClick?.(e);
          setOpen((v) => !v);
        },
      })
    : trigger;

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      // Closes when keyboard focus moves somewhere outside. relatedTarget is
      // null for plain mouse clicks on non-focusable areas (and Safari never
      // focuses buttons on click), so only a real focus move counts — the
      // outside-click handler above covers the mouse.
      onBlur={(e) => {
        if (open && e.relatedTarget && !rootRef.current?.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      {triggerElement}

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={label}
          className={`absolute top-full mt-2 ${
            align === "right" ? "right-0" : "left-0"
          } bg-bg-raised border border-border-subtle rounded-card shadow-lg z-30 ${panelClassName}`}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}