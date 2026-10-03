// src/features/auth/components/ProfileMenuPopover.tsx
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface ProfileMenuPopoverItem {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
  onSelect: () => void;
}

interface ProfileMenuPopoverProps {
  title: string;
  email?: string;
  items: ProfileMenuPopoverItem[];
  trigger: ReactNode;
}

// Desktop-only anchored dropdown counterpart to ProfileMenu's mobile bottom
// sheet — the standard "click your avatar, a small menu drops down right
// under it" pattern. Right-aligned (right-0) since the avatar sits at the
// far right edge of the header; left-aligning would push the menu off-screen.
export default function ProfileMenuPopover({
  title,
  email,
  items,
  trigger,
}: ProfileMenuPopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {open && (
        <div className="absolute top-full right-0 mt-3 w-72 bg-bg-raised border border-border-subtle rounded-card shadow-lg z-30 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border-subtle">
            <div className="font-display font-semibold text-base text-text-primary">
              {title}
            </div>
            {email && <div className="text-xs text-text-secondary mt-0.5">{email}</div>}
          </div>

          <div className="p-1.5">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-bg-surface transition-colors ${
                  item.destructive ? "text-state-error" : "text-text-primary"
                }`}
              >
                <item.icon
                  size={16}
                  className={item.destructive ? "text-state-error" : "text-text-secondary"}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
