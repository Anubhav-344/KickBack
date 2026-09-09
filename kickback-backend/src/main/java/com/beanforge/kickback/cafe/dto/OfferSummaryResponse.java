package com.beanforge.kickback.cafe.dto;

import com.beanforge.kickback.enums.DiscountType;
import com.beanforge.kickback.enums.OfferType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferSummaryResponse {

    private Long offerId;
    private String title;
    private String promoCode;
    private String description;
    private OfferType offerType;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private Integer bonusMinutes;
    private LocalDate validFrom;
    private LocalDate validTo;
    private boolean active;

}
