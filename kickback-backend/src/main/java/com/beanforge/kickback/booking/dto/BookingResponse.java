package com.beanforge.kickback.booking.dto;

import com.beanforge.kickback.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long bookingId;
    private String cafeName;
    private String cafeSlug;
    private String resourceName;
    private String game;
    private LocalDateTime startTimestamp;
    private LocalDateTime endTimestamp;
    private long durationMinutes;
    private BigDecimal hourlyRate;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private LocalDateTime holdExpiresAt;
    private String paymentMethod;
    private String transactionRef;
    private BigDecimal amountPaid;

}
