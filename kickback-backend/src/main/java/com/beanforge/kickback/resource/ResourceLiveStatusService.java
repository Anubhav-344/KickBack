package com.beanforge.kickback.resource;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.enums.BookingStatus;
import com.beanforge.kickback.repository.BookingRepository;

/**
 * Answers "is this unit being used RIGHT NOW, and when does it next free
 * up?" for a batch of resources, based on real bookings.
 *
 * The resource's own `status` column (AVAILABLE / MAINTENANCE /
 * OUT_OF_SERVICE) only says whether a unit is in service — it never changes
 * when someone books it. This layers the booking-based answer on top of it.
 * Callers should only apply it to resources whose stored status is
 * AVAILABLE: maintenance / out-of-service always take priority over "in use".
 *
 * Looks up all resources in a single query, not one query per unit.
 */
@Service
public class ResourceLiveStatusService {

    /** nextFreeAt is only set when inUseNow is true. */
    public record LiveStatus(boolean inUseNow, LocalDateTime nextFreeAt) {
        public static final LiveStatus FREE = new LiveStatus(false, null);
    }

    // Back-to-back bookings are chained to find the true next-free time, but
    // there's no need to look further ahead than this.
    private static final long LOOKAHEAD_DAYS = 2;

    private final BookingRepository bookingRepository;

    public ResourceLiveStatusService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public Map<Long, LiveStatus> computeLiveStatus(Collection<Long> resourceIds) {
        if (resourceIds == null || resourceIds.isEmpty()) {
            return Map.of();
        }

        LocalDateTime now = LocalDateTime.now();

        List<Booking> bookings = bookingRepository.findLiveAndUpcomingBookings(
                resourceIds,
                BookingStatus.PENDING,
                BookingStatus.CONFIRMED,
                now,
                now.plusDays(LOOKAHEAD_DAYS));

        Map<Long, List<Booking>> byResource = new HashMap<>();
        for (Booking booking : bookings) {
            byResource
                    .computeIfAbsent(booking.getResource().getResourceId(), id -> new ArrayList<>())
                    .add(booking);
        }

        Map<Long, LiveStatus> result = new HashMap<>();
        for (Long resourceId : resourceIds) {
            result.put(resourceId, statusFor(byResource.getOrDefault(resourceId, List.of()), now));
        }
        return result;
    }

    // `bookings` is already sorted by start time, and every booking in it
    // ends after `now` (guaranteed by the query).
    private LiveStatus statusFor(List<Booking> bookings, LocalDateTime now) {
        LocalDateTime freeAt = null;

        for (Booking booking : bookings) {
            if (freeAt == null) {
                if (booking.getStartTimestamp().isAfter(now)) {
                    // Earliest remaining booking hasn't started yet, so the
                    // unit is free right now.
                    break;
                }
                // Already started and still running: in use until it ends.
                freeAt = booking.getEndTimestamp();
            } else if (!booking.getStartTimestamp().isAfter(freeAt)) {
                // Starts exactly when (or before) the previous one ends:
                // back-to-back, so it isn't actually free until this ends too.
                if (booking.getEndTimestamp().isAfter(freeAt)) {
                    freeAt = booking.getEndTimestamp();
                }
            } else {
                // A real gap — the unit frees up at `freeAt`.
                break;
            }
        }

        return freeAt == null ? LiveStatus.FREE : new LiveStatus(true, freeAt);
    }
}