package com.beanforge.kickback.booking.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    @NotNull
    @Positive
    private Long resourceId;

    private Long gameId;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalDateTime startTimestamp;

    @NotNull
    @Future
    private LocalDateTime endTimestamp;

    private Long offerId;

    private String promoCode;

    private String notes;

}
