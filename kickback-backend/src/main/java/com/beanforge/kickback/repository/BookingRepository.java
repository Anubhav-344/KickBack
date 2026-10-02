package com.beanforge.kickback.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.enums.BookingStatus;

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
}
