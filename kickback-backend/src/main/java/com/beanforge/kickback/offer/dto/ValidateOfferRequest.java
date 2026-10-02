package com.beanforge.kickback.offer.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidateOfferRequest {

    @NotNull
    @Positive
    private Long offerId;

    private String promoCode;

    @NotNull
    private Long cafeId;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalDateTime startTimestamp;

    @NotNull
    private LocalDateTime endTimestamp;

    @NotNull
    private BigDecimal bookingAmount;
}
