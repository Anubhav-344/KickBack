// src/features/booking/store/useBookingDraftStore.ts
import { create } from "zustand";
import { snapDurationToStep, todayISO } from "@/lib/dateTime";

interface BookingDraftState {
  cafeSlug: string | null;
  resourceId: number | null;
  gameId: number | null;
  gameName: string | null;
  selectedDate: string; // ISO yyyy-mm-dd
  startMinutes: number; // minutes since midnight
  durationMinutes: number;

  setResource: (cafeSlug: string, resourceId: number) => void;
  setGame: (game: { gameId: number; gameName: string } | null) => void;
  setSelectedDate: (date: string) => void;
  setStartMinutes: (minutes: number) => void;
  adjustDuration: (deltaMinutes: number) => void;
  /** Used when the user edits End Time directly instead of Duration —
   *  recomputes duration from the new end point, snapped to a valid step. */
  setEndMinutes: (endMinutes: number) => void;
  reset: () => void;
}

const DEFAULT_DURATION = 60; // 1 hour default, per most-common-booking-length decision

export const useBookingDraftStore = create<BookingDraftState>((set, get) => ({
  cafeSlug: null,
  resourceId: null,
  gameId: null,
  gameName: null,
  selectedDate: todayISO(),
  startMinutes: 14 * 60, // placeholder default; real usage sets this from context/now
  durationMinutes: DEFAULT_DURATION,

  // cafeSlug and resourceId always get set together — the checkout page
  // (which has no URL params of its own) needs cafeSlug to fetch café/offer
  // data, since booking creation is now deferred until Pay, not Book.
  setResource: (cafeSlug, resourceId) => set({ cafeSlug, resourceId }),
  setGame: (game) =>
    set({ gameId: game?.gameId ?? null, gameName: game?.gameName ?? null }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setStartMinutes: (minutes) => set({ startMinutes: minutes }),

  adjustDuration: (deltaMinutes) =>
    set((state) => ({
      durationMinutes: Math.max(15, state.durationMinutes + deltaMinutes),
    })),

  setEndMinutes: (endMinutes) => {
    const { startMinutes } = get();
    const rawDuration = endMinutes - startMinutes;
    set({ durationMinutes: snapDurationToStep(rawDuration) });
  },

  reset: () =>
    set({
      cafeSlug: null,
      resourceId: null,
      gameId: null,
      gameName: null,
      selectedDate: todayISO(),
      startMinutes: 14 * 60,
      durationMinutes: DEFAULT_DURATION,
    }),
}));

// Derived selector — always compute end time, never store it, so it's
// structurally impossible for start/duration/end to disagree with each other.
export function useBookingEndMinutes(): number {
  return useBookingDraftStore((s) => s.startMinutes + s.durationMinutes);
}
