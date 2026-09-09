package com.beanforge.kickback.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CafeDetailsResponse {

    private Long cafeId;
    private String slug;
    private String name;
    private String description;
    private String email;
    private String phone;
    private BigDecimal averageRating;
    private int totalReviews;
    private boolean openNow;
    private List<String> images;
    private CafeAddressResponse address;
    private List<AmenityResponse> amenities;
    private List<OfferSummaryResponse> offers;
    private List<ResourceTypeSummaryResponse> resourceTypes;
    private OperatingWindowResponse operatingWindow;

}
