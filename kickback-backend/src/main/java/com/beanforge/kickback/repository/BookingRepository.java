package com.beanforge.kickback.repository;

import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            WHERE b.resource.resourceId = :resourceId
              AND (
                    b.bookingStatus = :confirmedStatus
                    OR (b.bookingStatus = :pendingStatus
                        AND b.holdExpiresAt IS NOT NULL
                        AND b.holdExpiresAt > :now)
                  )
              AND b.startTimestamp < :endTimestamp
              AND b.endTimestamp > :startTimestamp
            """)
    boolean existsOverlappingBooking(
            @Param("resourceId") Long resourceId,
            @Param("startTimestamp") LocalDateTime startTimestamp,
            @Param("endTimestamp") LocalDateTime endTimestamp,
            @Param("pendingStatus") BookingStatus pendingStatus,
            @Param("confirmedStatus") BookingStatus confirmedStatus,
            @Param("now") LocalDateTime now);

    List<Booking> findByUser_UserIdOrderByStartTimestampDesc(Long userId);

    // Used by account deletion: does this user still have a booking that is
    // running or coming up (CONFIRMED, or PENDING with a hold that has not
    // expired)? Same "still occupies the slot" rule as the queries above.
    @Query("""
            SELECT COUNT(b) > 0
            FROM Booking b
            WHERE b.user.userId = :userId
              AND b.endTimestamp > :now
              AND (
                    b.bookingStatus = :confirmedStatus
                    OR (b.bookingStatus = :pendingStatus
                        AND b.holdExpiresAt IS NOT NULL
                        AND b.holdExpiresAt > :now)
                  )
            """)
    boolean hasActiveBookings(
            @Param("userId") Long userId,
            @Param("pendingStatus") BookingStatus pendingStatus,
            @Param("confirmedStatus") BookingStatus confirmedStatus,
            @Param("now") LocalDateTime now);

    Optional<Booking> findByBookingIdAndUser_UserId(Long bookingId, Long userId);

    // Used by the scheduled lifecycle job: PENDING bookings whose hold
    // window has passed without ever being paid for.
    List<Booking> findByBookingStatusAndHoldExpiresAtBefore(
            BookingStatus status, LocalDateTime cutoff);

    // Used by the scheduled lifecycle job: CONFIRMED bookings whose session
    // time has already passed — these become eligible for review creation
    // once marked COMPLETED.
    List<Booking> findByBookingStatusAndEndTimestampBefore(
            BookingStatus status, LocalDateTime cutoff);

    // Used by ResourceLiveStatusService for the "In use now / Next free at"
    // badge on resource cards. Same "counts as occupying the slot" rule as
    // existsOverlappingBooking: CONFIRMED, or PENDING with an unexpired hold.
    // Returns everything still running or starting before the horizon, in
    // start order, so back-to-back bookings can be chained to find the real
    // next-free time. JOIN FETCH avoids a per-booking lookup of the resource.
    @Query("""
            SELECT b
            FROM Booking b
            JOIN FETCH b.resource r
            WHERE r.resourceId IN :resourceIds
              AND (
                    b.bookingStatus = :confirmedStatus
                    OR (b.bookingStatus = :pendingStatus
                        AND b.holdExpiresAt IS NOT NULL
                        AND b.holdExpiresAt > :now)
                  )
              AND b.endTimestamp > :now
              AND b.startTimestamp < :horizon
            ORDER BY b.startTimestamp
            """)
    List<Booking> findLiveAndUpcomingBookings(
            @Param("resourceIds") Collection<Long> resourceIds,
            @Param("pendingStatus") BookingStatus pendingStatus,
            @Param("confirmedStatus") BookingStatus confirmedStatus,
            @Param("now") LocalDateTime now,
            @Param("horizon") LocalDateTime horizon);
}