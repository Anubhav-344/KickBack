\------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TO-COMPLETE

\------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



1. Picking a different date doesn't refetch bookings/operating hours yet — still static mock data regardless of selectedDate
2. think about adding cash as an payment option
3. change no. of players in booking page on game selection
4. think of adding settings/notification in profile dropdown
5. Since you mentioned pfp selection from a preset gallery, not custom upload — that's a good call (avoids image moderation/storage entirely) — but it means USERS needs a new column, something like avatar\_id INT NULL referencing a small fixed set of preset images. Worth adding whenever you touch the schema next.
6. check what happens when you try to book for a unavailable slot
7. No back btn in pfp, my bookings, help-support pages
8. Placeholder in cafe search shows incorrect info

\------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

COMPLETED

\------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



1. make the phone no. on cafe home page redirectable
2. show profile if logged in or else login btn on header top left
3. 



\------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

STATUS

\------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



| Page | Status |

|---|---|

| Café landing | ✅ Built |

| Resource type → unit selection | ✅ Built |

| Booking page (time/duration/game) | ✅ Built |

| Booking preview (offers, payment method) | ✅ Built |

| \*\*Booking confirmation (post-payment success)\*\* | ✅ Built |

| Login/Signup | ✅ Built |

| Profile / My Bookings / Support | 🟡 Stubs only |

| \*\*Reviews (leaving one after a completed session)\*\* | ❌ Never designed at all — schema has a `REVIEWS` table, but no UI exists anywhere |

| Multi-cafe discovery/home | ❌ Not built (what you're asking about now) |

| Owner-side dashboard | ❌ Not started (out of scope so far — we only ever wireframed the end-user flow) |

