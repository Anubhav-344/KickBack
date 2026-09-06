// src/lib/mockDelay.ts

// Wraps mock data in a Promise with artificial latency, so hooks built on
// top of it behave exactly like real network calls (loading states actually
// show, React Query's caching/retry behavior gets exercised, etc.) — this
// is what makes the swap to a real API later a non-event for consuming
// components: they've already been coded against async behavior.
export function mockDelay<T>(data: T, ms = 400): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
  }
  