// src/features/auth/components/ProfileMenuPopover.tsx
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Popover from "@/components/ui/Popover";

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

// Desktop-only dropdown counterpart to ProfileMenu's mobile bottom sheet —
// the standard "click your avatar, a small menu drops down under it" pattern.
// Right-aligned, since the avatar sits at the far right of the header.
export default function ProfileMenuPopover({
  title,
  email,
  items,
  trigger,
}: ProfileMenuPopoverProps) {
  return (
    <Popover
      trigger={trigger}
      label="Account menu"
      align="right"
      panelClassName="w-72 overflow-hidden"
    >
      {(close) => (
        <>
          <div className="px-4 py-3.5 border-b border-border-subtle">
            <div className="font-display font-semibold text-base text-text-primary">{title}</div>
            {email && <div className="text-xs text-text-secondary mt-0.5">{email}</div>}
          </div>

          <div className="p-1.5">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  close();
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
        </>
      )}
    </Popover>
  );
}