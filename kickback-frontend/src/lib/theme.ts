// src/lib/theme.ts
import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "kickback-theme";
const CHANGE_EVENT = "kickback-theme-change";

// Dark is the default. The inline script in index.html applies a saved "light"
// choice before the first paint (so there is no flash); this file keeps the
// attribute, the browser's theme-color and the saved choice in step afterwards.

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "light" ? "#F5F6F8" : "#12141A");
  document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private window); the choice then lasts for this visit only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/** Current theme plus a function that flips it. Re-renders when the theme changes. */
export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  return [theme, () => applyTheme(theme === "light" ? "dark" : "light")];
}
