package com.beanforge.kickback.repository;

import com.beanforge.kickback.entity.Resource;
import com.beanforge.kickback.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

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