// src/features/booking/store/useBookingDraftStore.ts
import { create } from "zustand";
import { snapDurationToStep, todayISO } from "@/lib/dateTime";

export type ExtraControllers = number | "UNSURE";

interface BookingDraftState {
  cafeSlug: string | null;
  resourceId: number | null;
  gameId: number | null;
  gameName: string | null;
  /** Players the chosen game supports (null when unknown or no game chosen yet). */
  gameMaxPlayers: number | null;
  /** Controllers wanted on top of the one included with the booking, or "UNSURE" to decide at the café. */
  extraControllers: ExtraControllers;
  selectedDate: string; // ISO yyyy-mm-dd
  startMinutes: number; // minutes since midnight
  /** False until the start time has been set once (by the booking page's "start from now"
   *  default, or by the user). Lets a returning visitor keep the time they chose. */
  startInitialised: boolean;
  durationMinutes: number;

  setResource: (cafeSlug: string, resourceId: number) => void;
  setGame: (game: { gameId: number; gameName: string; maxPlayers?: number } | null) => void;
  setExtraControllers: (value: ExtraControllers) => void;
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
  gameMaxPlayers: null,
  extraControllers: 0,
  selectedDate: todayISO(),
  startMinutes: 14 * 60, // placeholder until the booking page sets "now" (see startInitialised)
  startInitialised: false,
  durationMinutes: DEFAULT_DURATION,

  // cafeSlug and resourceId always get set together — the checkout page
  // (which has no URL params of its own) needs cafeSlug to fetch café/offer
  // data, since booking creation is now deferred until Pay, not Book.
  setResource: (cafeSlug, resourceId) => set({ cafeSlug, resourceId }),
  // Switching game can lower the player limit (a 4-player game to a 2-player one), so a
  // number that no longer fits goes back to 0 rather than being sent and rejected.
  setGame: (game) =>
    set((state) => {
      const gameMaxPlayers = game?.maxPlayers ?? null;
      const tooMany =
        typeof state.extraControllers === "number" &&
        state.extraControllers > Math.max(0, (gameMaxPlayers ?? 1) - 1);
      return {
        gameId: game?.gameId ?? null,
        gameName: game?.gameName ?? null,
        gameMaxPlayers,
        extraControllers: tooMany ? 0 : state.extraControllers,
      };
    }),
  setExtraControllers: (value) => set({ extraControllers: value }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setStartMinutes: (minutes) => set({ startMinutes: minutes, startInitialised: true }),

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
      gameMaxPlayers: null,
      extraControllers: 0,
      selectedDate: todayISO(),
      startMinutes: 14 * 60,
      startInitialised: false,
      durationMinutes: DEFAULT_DURATION,
    }),
}));

// Derived selector — always compute end time, never store it, so it's
// structurally impossible for start/duration/end to disagree with each other.
export function useBookingEndMinutes(): number {
  return useBookingDraftStore((s) => s.startMinutes + s.durationMinutes);
}
