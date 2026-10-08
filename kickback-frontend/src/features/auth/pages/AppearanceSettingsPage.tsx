// src/features/auth/pages/AppearanceSettingsPage.tsx
import type { Theme } from "@/lib/theme";
import SettingsLayout from "../components/SettingsLayout";
import { useThemeChoice } from "../hooks/useThemeChoice";

interface ThemeOption {
  value: Theme;
  label: string;
  description: string;
  // Fixed colours on purpose: each card previews ITS theme, whatever is active now.
  preview: { page: string; card: string; line: string };
}

const OPTIONS: ThemeOption[] = [
  {
    value: "dark",
    label: "Dark",
    description: "Easy on the eyes in dim rooms. The default.",
    preview: { page: "#12141A", card: "#1C1F26", line: "#2E323D" },
  },
  {
    value: "light",
    label: "Light",
    description: "Bright and clear in daylight.",
    preview: { page: "#F5F6F8", card: "#FFFFFF", line: "#D8DBE2" },
  },
];

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useThemeChoice();

  return (
    <SettingsLayout title="Appearance" backTo="/settings" backLabel="Back to settings">
      <fieldset>
        <legend className="text-sm text-text-secondary mb-3">Theme</legend>
        <div className="flex flex-col gap-3">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className="relative flex items-center gap-4 bg-bg-surface border border-border-strong rounded-card p-4 cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-bg-raised has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-text"
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                aria-label={option.label}
                checked={theme === option.value}
                onChange={() => setTheme(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className="w-16 h-12 rounded-lg flex-shrink-0 p-1.5 flex flex-col gap-1 border"
                style={{ background: option.preview.page, borderColor: option.preview.line }}
              >
                <span className="h-3 rounded-sm" style={{ background: option.preview.card }} />
                <span className="h-2 w-1/2 rounded-sm bg-accent" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-text-primary">{option.label}</span>
                <span className="block text-xs text-text-secondary mt-0.5">{option.description}</span>
              </span>
              <span
                aria-hidden="true"
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  theme === option.value ? "border-accent" : "border-border-strong"
                }`}
              >
                {theme === option.value && <span className="w-2.5 h-2.5 rounded-full bg-accent" />}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-xs text-text-secondary mt-4 leading-relaxed">
        Saved to your account, so your choice follows you to your other devices.
      </p>
    </SettingsLayout>
  );
}
