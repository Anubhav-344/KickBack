package com.beanforge.kickback.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CafeListingResponse {

    private Long cafeId;
    private String slug;
    private String name;
    private String area;
    private String city;
    private BigDecimal averageRating;
    private int totalReviews;
    private BigDecimal startingHourlyRate;
    private List<String> resourceTypeTags;
    private String imageUrl;
    private OperatingWindowResponse todayOperatingWindow;

}
