package com.beanforge.kickback.offer.dto;

import com.beanforge.kickback.enums.DiscountType;
import com.beanforge.kickback.enums.OfferType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferValidationResponse {

    private boolean valid;
    private Long offerId;
    private String title;
    private String promoCode;
    private String message;
    private OfferType offerType;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private Integer bonusMinutes;
    private BigDecimal discountAmount;
    private BigDecimal subtotal;
    private BigDecimal totalAmount;

}
