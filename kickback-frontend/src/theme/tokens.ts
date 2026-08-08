// src/theme/tokens.ts
// Mirrors the @theme block in index.css — use this when a color/value is needed
// outside a Tailwind class (e.g. Framer Motion animate props, inline SVG fills,
// chart color scales) so the two never drift out of sync.

export const colors = {
    bgBase: "#12141A",
    bgSurface: "#1C1F26",
    bgRaised: "#242833",
    borderSubtle: "#2E323D",
    textPrimary: "#F2F0EA",
    textSecondary: "#9A9EA8",
    accent: "#FF5A3C",
    accentHover: "#FF7457",
    stateAvailable: "#3DDC8C",
    statePending: "#F5C34C",
    stateBooked: "#5C6270",
    stateError: "#F2495C",
  } as const;
  
  export const fonts = {
    display: "'Barlow Condensed', sans-serif",
    body: "'Inter', sans-serif",
  } as const;
  
  export const radius = {
    card: "12px",
    pill: "24px",
  } as const;
  
  // Booking domain constants — kept here (not scattered across components)
  // so increment rules stay in one place and match backend validation.
  export const booking = {
    durationStepMinutes: 15,
    durationStepHours: 1,
    holdDurationMinutes: 10, // how long a PENDING booking holds the slot before expiry
  } as const;
  