// src/components/ui/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { useThemeChoice } from "@/features/auth/hooks/useThemeChoice";

/**
 * Switches between dark (default) and light. The label names the action, which is
 * what a screen reader user needs ("Switch to light mode"); the icon shows the mode
 * you would switch TO, as most sites do.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useThemeChoice();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg border border-border-strong bg-bg-surface text-text-primary flex items-center justify-center flex-shrink-0"
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
