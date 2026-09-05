# KickBack Frontend Roadmap — To Backend Integration

Status snapshot and remaining work, organized by priority. Everything here is still frontend-only (mock data), building toward a state where swapping mocks for real API calls is a small, mechanical change rather than a redesign.

---

## Phase 1 — Fix the multi-cafe consistency gap (do this first)

Discovery page now lets users browse multiple cafés, but downstream pages don't respect that yet.

- [ ] **Consolidate mock data into one shared source** (e.g. `src/mocks/cafes.ts`), keyed by `slug`, with full detail (not just the listing-card shape). All pages read from this instead of each hardcoding their own `MOCK_CAFE`/`MOCK_UNIT`/etc.
- [ ] `CafeLandingPage` must look up the café by `cafeSlug` param instead of always showing Respawn Lounge.
- [ ] `ResourceSelectionPage` and `BookingPage` must resolve resource/unit data relative to the *correct* café, not a fixed one.
- [ ] Add a **"Café not found"** state for an invalid/unknown slug (simple 404-style message + link back to Discovery).

This is foundational — every other phase assumes café data is consistent across pages.

---

## Phase 2 — Auth completeness

- [ ] **`RequireAuth` route guard** — a wrapper component that redirects to `/login?redirect=...` if `!isAuthenticated`. Currently only the Booking page's "Book" button checks auth; `/profile` and `/bookings` will silently render broken/empty state if a guest navigates there directly by URL.
- [ ] Apply the guard to `/profile` and `/bookings` (Support page stays public).
- [ ] Decide: is a **Forgot Password** flow in scope for initial launch, or deferred? (My take: defer — it needs real email/SMS infra to be more than a UI shell, so building it now is low-value until backend exists.)

---

## Phase 3 — Missing core screens

- [ ] **My Bookings (real)** — upcoming/past tabs, booking cards (status, time, café), cancel action with confirmation.
- [ ] **Profile (real)** — editable name/email/phone/username, preset avatar picker (grid of selectable images, ties to the `avatar_id` schema addition), logout.
- [ ] **Reviews UI** — schema has a `REVIEWS` table but zero UI exists anywhere. Needs: a "Leave a review" prompt on completed bookings (in My Bookings), a rating+comment form, and reviews surfacing somewhere on the café page (currently `average_rating`/`total_reviews` display but there's no way to see individual reviews).
- [ ] **404 / Not Found page** for unmatched routes.
- [ ] **Error boundary** — a fallback UI for unexpected render crashes, instead of a blank white screen.

---

## Phase 4 — Data-layer hook contracts (highest-leverage prep for backend handoff)

Right now every page has an inline `MOCK_X` constant. Before integration, wrap each in a real hook with the *shape* the backend will need to match, even though the body still just resolves mock data:

```ts
// Example of the pattern to apply everywhere
export function useCafeDetails(slug: string) {
  return useQuery({
    queryKey: ["cafe", slug],
    queryFn: () => mockDelay(getMockCafeBySlug(slug)),
  });
}
```

- [ ] `useCafeListings()`, `useCafeDetails(slug)`
- [ ] `useResourceTypes(cafeSlug)`, `useResources(resourceTypeId)`
- [ ] `useAvailability(resourceId, date)`, `useCreateHold(...)`
- [ ] `useBookingDetails(bookingId)`, `useUserBookings()`
- [ ] `useApplyOffer(...)`, `useInitiatePayment(...)`
- [ ] `useUpdateProfile(...)`

Once this is done, integrating the real backend becomes: swap `queryFn` internals, no component changes. This is the single most valuable thing to nail down before handoff — it's the actual contract between frontend and backend teams.

---

## Phase 5 — Known loose ends from earlier

- [ ] Booking page: End Time is currently **derived-only** — make it directly editable (tap → recompute duration), per the sync logic already designed (`setEndMinutes` exists in the store, just unused).
- [ ] Preview page: hold-countdown expiry currently redirects immediately — consider a brief "expired" locked state before navigating away, so it doesn't feel abrupt mid-interaction.
- [ ] Booking page: selecting a different date doesn't yet refetch bookings/hours for that date (blocked on Phase 4's `useAvailability` existing properly, then just needs `date` in its query key).
- [ ] Consolidate repeated inline button/card styling into real `ui/Button`, `ui/Card`, `ui/Badge` primitives (currently every page hand-rolls its own className strings — works, but drifts over time).

---

## Phase 6 — Final polish pass

- [ ] Loading skeletons for async states (won't be visually meaningful until Phase 4 hooks hit real network latency, but worth having the components ready).
- [ ] Basic accessibility pass — aria-labels on icon-only buttons (mostly done), focus trapping in sheets (Radix handles this already), keyboard navigation spot-check.
- [ ] Desktop-width visual check across every page — we've been mobile-first throughout; worth a deliberate pass confirming the centered-column layout reads intentionally on wide screens, not just "shrunk mobile."

---

## Suggested order

1. Phase 1 (blocking correctness bug)
2. Phase 2 (security/UX gap)
3. Phase 4 (do this *before* Phase 3 — building My Bookings/Reviews directly against proper hooks avoids writing more one-off `MOCK_X` constants that Phase 4 would have to unwind later)
4. Phase 3 (now built on real hook contracts from the start)
5. Phase 5, then Phase 6

At the end of this: a fully-clickable app, every page pulling from consistent mock data through hooks shaped exactly like the eventual real API — meaning backend integration becomes a swap-the-fetcher exercise, not a rewrite.
