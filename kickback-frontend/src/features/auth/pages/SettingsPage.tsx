// src/features/auth/pages/SettingsPage.tsx
import { Link } from "react-router-dom";
import { ChevronRight, Palette, ShieldCheck, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SettingsLayout from "../components/SettingsLayout";

interface SettingsRow {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  destructive?: boolean;
}

const ROWS: SettingsRow[] = [
  {
    to: "/settings/appearance",
    label: "Appearance",
    description: "Choose dark or light mode",
    icon: Palette,
  },
  {
    to: "/settings/security",
    label: "Account security",
    description: "Change your password",
    icon: ShieldCheck,
  },
  {
    to: "/settings/delete-account",
    label: "Delete account",
    description: "Permanently remove your account",
    icon: Trash2,
    destructive: true,
  },
];

// Help & Support is not here on purpose: it stays its own entry in the account menu.
export default function SettingsPage() {
  return (
    <SettingsLayout title="Settings" backTo="/profile" backLabel="Back to profile">
      <nav aria-label="Settings sections">
        <ul className="flex flex-col gap-2.5">
          {ROWS.map((row) => (
            <li key={row.to}>
              <Link
                to={row.to}
                className="flex items-center gap-3.5 bg-bg-surface border border-border-subtle rounded-card px-4 py-4 hover:border-border-strong transition-colors"
              >
                <span className="w-10 h-10 rounded-full bg-bg-raised flex items-center justify-center flex-shrink-0">
                  <row.icon
                    size={18}
                    aria-hidden="true"
                    className={row.destructive ? "text-state-error-text" : "text-text-secondary"}
                  />
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-sm font-semibold ${
                      row.destructive ? "text-state-error-text" : "text-text-primary"
                    }`}
                  >
                    {row.label}
                  </span>
                  <span className="block text-xs text-text-secondary mt-0.5">{row.description}</span>
                </span>
                <ChevronRight size={18} aria-hidden="true" className="text-text-secondary flex-shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </SettingsLayout>
  );
}
