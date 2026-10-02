package com.beanforge.kickback.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookingOfferRequest {

    // Both null means "clear any applied offer" — same resolution rules as
    // CreateBookingRequest: offerId takes priority if present, promoCode is
    // used to look it up otherwise, and if both are given they must match.
    private Long offerId;

    private String promoCode;

}