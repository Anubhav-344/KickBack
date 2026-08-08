// src/features/booking/store/useBookingDraftStore.ts
import { create } from "zustand";
import { snapDurationToStep, todayISO } from "@/lib/dateTime";

interface BookingDraftState {
  resourceId: number | null;
  game: string | null;
  selectedDate: string; // ISO yyyy-mm-dd
  startMinutes: number; // minutes since midnight
  durationMinutes: number;

  setResourceId: (id: number) => void;
  setGame: (game: string | null) => void;
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
  resourceId: null,
  game: null,
  selectedDate: todayISO(),
  startMinutes: 14 * 60, // placeholder default; real usage sets this from context/now
  durationMinutes: DEFAULT_DURATION,

  setResourceId: (id) => set({ resourceId: id }),
  setGame: (game) => set({ game }),
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
      resourceId: null,
      game: null,
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
