// src/app/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Most KickBack data (resources, availability) changes from OTHER
      // users' actions, so don't trust a long stale time by default.
      // Individual hooks (e.g. useAvailability) override this with
      // refetchInterval for live polling where it matters.
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0, // never auto-retry a booking/payment mutation silently
    },
  },
});
