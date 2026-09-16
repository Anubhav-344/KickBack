package com.beanforge.kickback.offer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidateOfferResponse {

    private boolean valid;
    private Long offerId;
    private String promoCode;
    private String title;
    private String offerType;
    private String discountType;
    private BigDecimal discountValue;
    private Integer bonusMinutes;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String message;
}
