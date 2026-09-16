package com.beanforge.kickback.repository;

import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
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

    Optional<Booking> findByBookingIdAndUser_UserId(Long bookingId, Long userId);
}
