package com.beanforge.kickback.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.beanforge.kickback.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingSummaryResponse {

    private Long bookingId;
    private String cafeName;
    private String cafeSlug;
    private String resourceName;
    private LocalDateTime startTimestamp;
    private LocalDateTime endTimestamp;
    private long durationMinutes;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private boolean hasReview;

}