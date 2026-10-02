package com.beanforge.kickback.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.beanforge.kickback.entity.Booking;
import com.beanforge.kickback.entity.Resource;

import jakarta.persistence.LockModeType;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    /**
     * Fixes the double-booking race condition: without this, two concurrent
     * createBooking() calls for the same resource can both pass the overlap
     * check before either commits, since a plain SELECT takes no lock.
     *
     * PESSIMISTIC_WRITE makes MySQL take a row lock (SELECT ... FOR UPDATE)
     * on this specific resource row for the lifetime of the transaction. A
     * second concurrent request for the SAME resource blocks here until the
     * first transaction commits or rolls back — at which point its own
     * overlap check correctly sees whatever the first transaction just
     * committed. Different resources are never blocked by each other, since
     * the lock is per-row, not table-wide.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Resource r WHERE r.resourceId = :resourceId")
    Optional<Resource> findByIdForUpdate(@Param("resourceId") Long resourceId);

    @Query("""
        SELECT b
        FROM Booking b
        WHERE b.resource.resourceId = :resourceId
          AND b.startTimestamp < :endOfDay
          AND b.endTimestamp > :startOfDay
          AND b.bookingStatus IN (
              com.beanforge.kickback.enums.BookingStatus.PENDING,
              com.beanforge.kickback.enums.BookingStatus.CONFIRMED
          )
        ORDER BY b.startTimestamp
        """)
    List<Booking> findActiveBookingsForDate(
            @Param("resourceId") Long resourceId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
}